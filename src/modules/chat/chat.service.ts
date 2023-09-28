import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { ChatDto, ChatPagingDto } from './chat.dto';
import { InjectModel } from '@nestjs/sequelize';
import { ChatModel } from './chat.model';
import { randomUUID } from 'crypto';
import { CommonException } from '../../common/errors/common.error';
import { Sequelize } from 'sequelize-typescript';
import { AdminService } from './../admin/admin.service';
import { ClientService } from './../client/client.service';
import { ClientModel } from '../client/client.model';
import { TeacherModel } from '../teacher/teacher.model';
import { AdminModel } from '../admin/admin.model';
import { TypeModel } from '../type/type.model';

@Injectable()
export class ChatService extends BaseService<ChatDto, ChatDto> {
  constructor(
    @InjectModel(ChatModel) readonly model: typeof ChatModel,
    private readonly adminService: AdminService,
    private readonly clientService: ClientService,
    private readonly sequelize: Sequelize,
  ) {
    super(model);
  }

  async create(data: ChatDto, image?: Express.Multer.File) {
    await this.adminService.findById(data.adminId);
    await this.clientService.findById(data.clientId);

    data.id = randomUUID();

    await this.model.create(data);

    const instance = await this.model.findOne({
      where: { id: data.id },
      attributes: {
        exclude: [
          'adminId',
          'clientId',
          'createdAt',
          'createdBy',
          'updatedAt',
          'deletedAt',
          'deletedBy',
        ],
      },
      include: [
        {
          model: AdminModel,
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
        },
        {
          model: ClientModel,
          attributes: {
            exclude: [
              'hashedPassword',
              'teacherId',
              'createdAt',
              'createdBy',
              'updatedAt',
              'deletedAt',
              'deletedBy',
            ],
          },
          include: [
            {
              model: TeacherModel,
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
            },
          ],
        },
      ],
    });

    return instance.toJSON();
  }

  async findAll(query: ChatPagingDto): Promise<ResponsePaging<ChatDto>> {
    query.limit = Number(query.limit || 10);
    query.page = Number(query.page || 1);

    const filter = {};
    if (query.status) {
      filter['status'] = query.status;
    }
    if (query.adminId) {
      filter['adminId'] = query.adminId;
    }
    if (query.clientId) {
      filter['clientId'] = query.clientId;
    }

    const instance = await this.model.findAndCountAll({
      order: [['createdAt', String(query.orderType || 'ASC')]],
      where: filter,
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
      attributes: {
        exclude: [
          'adminId',
          'clientId',
          'createdAt',
          'createdBy',
          'updatedAt',
          'deletedAt',
          'deletedBy',
        ],
      },
      include: [
        {
          model: AdminModel,
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
        },
        {
          model: ClientModel,
          attributes: {
            exclude: [
              'hashedPassword',
              'teacherId',
              'createdAt',
              'createdBy',
              'updatedAt',
              'deletedAt',
              'deletedBy',
            ],
          },
          include: [
            {
              model: TeacherModel,
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
            },
          ],
        },
      ],
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

  async updateById(data: ChatDto, image?: Express.Multer.File) {
    const instance = await this.model.findOne({
      where: { id: data.id },
      attributes: {
        exclude: [
          'adminId',
          'clientId',
          'createdAt',
          'createdBy',
          'updatedAt',
          'deletedAt',
          'deletedBy',
        ],
      },
      include: [
        {
          model: AdminModel,
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
        },
        {
          model: ClientModel,
          attributes: {
            exclude: [
              'hashedPassword',
              'teacherId',
              'createdAt',
              'createdBy',
              'updatedAt',
              'deletedAt',
              'deletedBy',
            ],
          },
          include: [
            {
              model: TeacherModel,
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
            },
          ],
        },
      ],
    });

    if (!instance) {
      throw CommonException.NotFound(this.model.tableName);
    }

    if (data.adminId) {
      await this.adminService.findById(data.adminId);
    }

    if (data.clientId) {
      await this.clientService.findById(data.clientId);
    }

    return (await instance.update(data)).toJSON();
  }
}
