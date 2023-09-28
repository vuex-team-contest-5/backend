import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { TeacherDto, TeacherPagingDto } from './teacher.dto';
import { InjectModel } from '@nestjs/sequelize';
import { TeacherModel } from './teacher.model';
import { TypeService } from './../type/type.service';
import { randomUUID } from 'crypto';
import { CommonException } from '../../common/errors/common.error';
import { TypeModel } from '../type/type.model';
import { hashPassword } from '../../auth/bcrypt';
import { ImageService } from '../image/image.service';
import { Sequelize } from 'sequelize-typescript';
import { ClientModel } from '../client/client.model';

@Injectable()
export class TeacherService extends BaseService<TeacherDto, TeacherDto> {
  constructor(
    @InjectModel(TeacherModel) readonly model: typeof TeacherModel,
    private readonly typeService: TypeService,
    private readonly imageService: ImageService,
    private readonly sequelize: Sequelize,
  ) {
    super(model);
  }

  async create(data: TeacherDto, image?: Express.Multer.File) {
    await this.typeService.findById(data.typeId);

    const userByPhoneNumber = await this.findByPhoneNumber(data.phoneNumber, [
      'id',
    ]);
    if (userByPhoneNumber) {
      throw CommonException.AllreadyExist('Phone Number');
    }

    const userByEmail = await this.findByEmail(data.email, ['id']);
    if (userByEmail) {
      throw CommonException.AllreadyExist('Email');
    }

    data.id = randomUUID();
    data.hashedPassword = await hashPassword(data.password, 10);

    let fileName = null;
    if (image) fileName = await this.imageService.create(image);
    data.imageName = fileName;

    await this.model.create(data);

    const instance = await this.model.findOne({
      where: { id: data.id },
      attributes: {
        exclude: [
          'hashedPassword',
          'typeId',
          'createdAt',
          'createdBy',
          'updatedAt',
          'deletedAt',
          'deletedBy',
        ],
      },
      include: [
        {
          model: TypeModel,
          attributes: {
            exclude: [
              'createdAt',
              'createdBy',
              'updatedAt',
              'deletedAt',
              'deletedBy',
            ],
          },
        },
      ],
    });

    return instance.toJSON();
  }

  async findAll(query: TeacherPagingDto): Promise<ResponsePaging<TeacherDto>> {
    query.limit = Number(query.limit || 10);
    query.page = Number(query.page || 1);

    const filter = {};
    if (query.status) {
      filter['status'] = query.status;
    }
    if (query.typeId) {
      filter['typeId'] = query.typeId;
    }

    const instance = await this.model.findAndCountAll({
      order: [['createdAt', String(query.orderType || 'ASC')]],
      where: filter,
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
      attributes: {
        include: [
          [Sequelize.literal('COUNT("TeacherModel"."id")::INTEGER'), 'count'],
        ],
        exclude: [
          'hashedPassword',
          'typeId',
          'createdAt',
          'createdBy',
          'updatedAt',
          'deletedAt',
          'deletedBy',
        ],
      },
      include: [
        {
          model: TypeModel,
          attributes: {
            exclude: [
              'createdAt',
              'createdBy',
              'updatedAt',
              'deletedAt',
              'deletedBy',
            ],
          },
        },
        {
          model: ClientModel,
          attributes: [],
        },
      ],
      paranoid: false,
      subQuery: false,
      group: ['TeacherModel.id', 'type.id'],
    });

    return {
      meta: {
        limit: query.limit,
        currentPage: query.page,
        totalPages: Math.ceil(instance.count.length / query.limit),
        totalCount: instance.count.length,
      },
      data: instance.rows.map((row) => row.toJSON()),
    };
  }

  async updateById(data: TeacherDto, image?: Express.Multer.File) {
    const instance = await this.model.findOne({
      where: { id: data.id },
      attributes: {
        exclude: [
          'hashedPassword',
          'typeId',
          'createdAt',
          'createdBy',
          'updatedAt',
          'deletedAt',
          'deletedBy',
        ],
      },
      include: [
        {
          model: TypeModel,
          attributes: {
            exclude: [
              'createdAt',
              'createdBy',
              'updatedAt',
              'deletedAt',
              'deletedBy',
            ],
          },
        },
      ],
    });

    if (!instance) {
      throw CommonException.NotFound(this.model.tableName);
    }

    if (data.typeId) {
      await this.typeService.findById(data.typeId);
    }

    if (data.phoneNumber) {
      const userByPhoneNumber = await this.findByPhoneNumber(data.phoneNumber, [
        'id',
      ]);
      if (userByPhoneNumber && userByPhoneNumber.id != data.id) {
        throw CommonException.AllreadyExist('Phone Number');
      }
    }

    if (data.email) {
      const userByEmail = await this.findByEmail(data.email, ['id']);
      if (userByEmail && userByEmail.id != data.id) {
        throw CommonException.AllreadyExist('Email');
      }
    }

    if (data.password) {
      data.hashedPassword = await hashPassword(data.password, 10);
    }

    if (image) {
      if (instance.toJSON().imageName) {
        await this.model.update(
          { imageName: null },
          { where: { id: data.id } },
        );
        await this.imageService.remove(instance.toJSON().imageName);
      }

      const fileName = await this.imageService.create(image);

      data.imageName = fileName;
    }

    return (await instance.update(data)).toJSON();
  }

  async findByEmail(
    email: string,
    attributes: (keyof TeacherDto)[] = ['id', 'email'],
  ) {
    return await this.model
      .findOne({
        where: { email },
        attributes: attributes,
        include: [
          {
            model: TypeModel,
            attributes: {
              exclude: [
                'createdAt',
                'createdBy',
                'updatedAt',
                'deletedAt',
                'deletedBy',
              ],
            },
          },
        ],
      })
      .then((v) => v?.toJSON());
  }

  async findByPhoneNumber(
    phoneNumber: string,
    attributes: (keyof TeacherDto)[] = ['id', 'phoneNumber'],
  ) {
    return await this.model
      .findOne({
        where: { phoneNumber },
        attributes: attributes,
        include: [
          {
            model: TypeModel,
            attributes: {
              exclude: [
                'createdAt',
                'createdBy',
                'updatedAt',
                'deletedAt',
                'deletedBy',
              ],
            },
          },
        ],
      })
      .then((v) => v?.toJSON());
  }
}
