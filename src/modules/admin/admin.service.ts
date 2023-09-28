import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { AdminDto, AdminPagingDto } from './admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { AdminModel } from './admin.model';
import { randomUUID } from 'crypto';
import { CommonException } from '../../common/errors/common.error';
import { hashPassword } from '../../auth/bcrypt';
import { ImageService } from '../image/image.service';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AdminService extends BaseService<AdminDto, AdminDto> {
  constructor(
    @InjectModel(AdminModel) readonly model: typeof AdminModel,
    private readonly imageService: ImageService,
    private readonly sequelize: Sequelize,
  ) {
    super(model);
  }

  async create(data: AdminDto, image?: Express.Multer.File) {
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
          'createdAt',
          'createdBy',
          'updatedAt',
          'deletedAt',
          'deletedBy',
        ],
      },
    });

    return instance.toJSON();
  }

  async findAll(query: AdminPagingDto): Promise<ResponsePaging<AdminDto>> {
    query.limit = Number(query.limit || 10);
    query.page = Number(query.page || 1);

    const filter = {};
    if (query.status) {
      filter['status'] = query.status;
    }

    const instance = await this.model.findAndCountAll({
      order: [['createdAt', String(query.orderType || 'ASC')]],
      where: filter,
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
      attributes: {
        exclude: [
          'hashedPassword',
          'createdAt',
          'createdBy',
          'updatedAt',
          'deletedAt',
          'deletedBy',
        ],
      },
    });

    return {
      meta: {
        limit: query.limit,
        currentPage: query.page,
        totalPages: Math.ceil(instance.count / query.limit),
        totalCount: instance.count,
      },
      data: instance.rows.map((row) => row.toJSON()),
    };
  }

  async updateById(data: AdminDto, image?: Express.Multer.File) {
    const instance = await this.model.findOne({
      where: { id: data.id },
      attributes: {
        exclude: [
          'hashedPassword',
          'createdAt',
          'createdBy',
          'updatedAt',
          'deletedAt',
          'deletedBy',
        ],
      },
    });

    if (!instance) {
      throw CommonException.NotFound(this.model.tableName);
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
    attributes: (keyof AdminDto)[] = ['id', 'email'],
  ) {
    return await this.model
      .findOne({
        where: { email },
        attributes: attributes,
      })
      .then((v) => v?.toJSON());
  }

  async findByPhoneNumber(
    phoneNumber: string,
    attributes: (keyof AdminDto)[] = ['id', 'phoneNumber'],
  ) {
    return await this.model
      .findOne({
        where: { phoneNumber },
        attributes: attributes,
      })
      .then((v) => v?.toJSON());
  }
}
