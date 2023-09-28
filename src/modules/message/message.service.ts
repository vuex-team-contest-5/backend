import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { MessageDto, MessagePagingDto } from './message.dto';
import { InjectModel } from '@nestjs/sequelize';
import { MessageModel } from './message.model';
import { randomUUID } from 'crypto';
import { CommonException } from '../../common/errors/common.error';
import { Sequelize } from 'sequelize-typescript';
import { AdminService } from './../admin/admin.service';
import { ClientService } from './../client/client.service';
import { ClientModel } from '../client/client.model';
import { TeacherModel } from '../teacher/teacher.model';
import { AdminModel } from '../admin/admin.model';
import { TypeModel } from '../type/type.model';
import { ChatService } from './../chat/chat.service';
import { ChatModel } from '../chat/chat.model';

@Injectable()
export class MessageService extends BaseService<MessageDto, MessageDto> {
  constructor(
    @InjectModel(MessageModel) readonly model: typeof MessageModel,
    private readonly adminService: AdminService,
    private readonly clientService: ClientService,
    private readonly chatService: ChatService,
    private readonly sequelize: Sequelize,
  ) {
    super(model);
  }

  async create(data: MessageDto) {
    const chat = await this.chatService.findById(data.chatId);

    if (chat.adminId !== data.ownerId && chat.clientId !== data.ownerId) {
      throw CommonException.NotFound('Owner');
    }

    data.id = randomUUID();
    data.isClient = chat.clientId === data.ownerId;

    await this.model.create(data);

    const instance = await this.model.findOne({
      where: { id: data.id },
      attributes: {
        exclude: ['chatId', 'createdBy', 'updatedAt', 'deletedAt', 'deletedBy'],
      },
      include: [
        {
          model: ChatModel,
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
        },
      ],
    });

    return instance.toJSON();
  }

  async findAll(query: MessagePagingDto): Promise<ResponsePaging<MessageDto>> {
    query.limit = Number(query.limit || 10);
    query.page = Number(query.page || 1);

    const filter = { chatId: query.chatId };
    if (query.status) {
      filter['status'] = query.status;
    }

    const instance = await this.model.findAndCountAll({
      order: [['createdAt', String(query.orderType || 'ASC')]],
      where: filter,
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
      attributes: {
        exclude: ['chatId', 'createdBy', 'updatedAt', 'deletedAt', 'deletedBy'],
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

  async updateById(data: MessageDto) {
    const instance = await this.model.findOne({
      where: { id: data.id },
      attributes: {
        exclude: ['chatId', 'createdBy', 'updatedAt', 'deletedAt', 'deletedBy'],
      },
      include: [
        {
          model: ChatModel,
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
        },
      ],
    });

    if (!instance) {
      throw CommonException.NotFound(this.model.tableName);
    }

    if (data.chatId) {
      await this.chatService.findById(data.chatId);
    }

    return (await instance.update(data)).toJSON();
  }
}
