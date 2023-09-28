import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { ClientDto, ClientPagingDto } from './client.dto';
import { InjectModel } from '@nestjs/sequelize';
import { ClientModel } from './client.model';
import { TeacherService } from '../teacher/teacher.service';
import { ImageService } from '../image/image.service';
import { Sequelize } from 'sequelize-typescript';
import { CommonException } from '../../common/errors/common.error';
import { randomUUID } from 'crypto';
import { hashPassword } from '../../auth/bcrypt';
import { TeacherModel } from '../teacher/teacher.model';
import { TypeModel } from '../type/type.model';
import { OrderModel } from './order/order.model';
import { OrderDto } from './order/order.dto';
import { ProductService } from './../product/product.service';
import { ProductModel } from '../product/product.model';
import { CategoryModel } from '../category/category.model';

@Injectable()
export class ClientService extends BaseService<ClientDto, ClientDto> {
  constructor(
    @InjectModel(ClientModel) readonly model: typeof ClientModel,
    @InjectModel(OrderModel) readonly orderModel: typeof OrderModel,
    @InjectModel(ProductModel) readonly productModel: typeof ProductModel,
    private readonly teacherService: TeacherService,
    private readonly productService: ProductService,
    private readonly imageService: ImageService,
    private readonly sequelize: Sequelize,
  ) {
    super(model);
  }

  async create(data: ClientDto, image?: Express.Multer.File) {
    await this.teacherService.findById(data.teacherId);

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
    });

    return instance.toJSON();
  }

  async findAll(query: ClientPagingDto): Promise<ResponsePaging<ClientDto>> {
    query.limit = Number(query.limit || 10);
    query.page = Number(query.page || 1);

    const filter = {};
    if (query.status) {
      filter['status'] = query.status;
    }
    if (query.teacherId) {
      filter['teacherId'] = query.teacherId;
    }

    const instance = await this.model.findAndCountAll({
      order: [['createdAt', String(query.orderType || 'ASC')]],
      where: filter,
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
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

  async findById(id: string): Promise<ClientDto> {
    const instance = await this.model.findOne({
      where: { id },
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
        {
          model: OrderModel,
          attributes: {
            exclude: [
              'productId',
              'clientId',
              'createdBy',
              'updatedAt',
              'deletedAt',
              'deletedBy',
            ],
          },
          include: [
            {
              model: ProductModel,
              attributes: {
                exclude: [
                  'categoryId',
                  'createdBy',
                  'updatedAt',
                  'deletedAt',
                  'deletedBy',
                ],
              },
              include: [
                {
                  model: CategoryModel,
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
      group: [
        'ClientModel.id',
        'teacher.id',
        'teacher->type.id',
        'order.id',
        'order->product.id',
        'order->product->category.id',
      ],
    });

    if (!instance) {
      throw CommonException.NotFound(this.model.tableName);
    }

    return instance.toJSON();
  }

  async updateById(data: ClientDto, image?: Express.Multer.File) {
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
    });

    if (!instance) {
      throw CommonException.NotFound(this.model.tableName);
    }

    if (data.teacherId) {
      await this.teacherService.findById(data.teacherId);
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

  async orderProduct(data: OrderDto) {
    await this.findById(data.clientId);
    const product = await this.productService.findById(data.productId);

    if (product.count < data.count) {
      throw new BadRequestException(
        `There is only ${product.count} products left!`,
      );
    }

    const tr = await this.sequelize.transaction();

    try {
      await this.productModel.update(
        {
          count: product.count - data.count,
        },
        {
          where: { id: data.productId },
          transaction: tr,
        },
      );

      data.id = randomUUID();

      await this.orderModel.create(data, { transaction: tr });

      const instance = await this.orderModel.findOne({
        where: { id: data.id },
        transaction: tr,
        attributes: {
          exclude: [
            'productId',
            'clientId',
            'createdBy',
            'updatedAt',
            'deletedAt',
            'deletedBy',
          ],
        },
        include: [
          {
            model: ClientModel,
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
            model: ProductModel,
            attributes: {
              exclude: [
                'categoryId',
                'createdBy',
                'updatedAt',
                'deletedAt',
                'deletedBy',
              ],
            },
            include: [
              {
                model: CategoryModel,
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
      });

      await tr.commit();

      return instance.toJSON();
    } catch (error) {
      await tr.rollback();
      throw CommonException.UnknownError(error, 400);
    }
  }

  async removeOrder(id: any) {
    const instance = await this.orderModel.findOne({
      where: { id },
      attributes: ['id'],
    });

    if (!instance) {
      throw CommonException.NotFound(this.orderModel.tableName);
    }

    await instance.update({ status: false });
    return { id };
  }

  async findByEmail(
    email: string,
    attributes: (keyof ClientDto)[] = ['id', 'email'],
  ) {
    return await this.model
      .findOne({
        where: { email },
        attributes: attributes,
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
      })
      .then((v) => v?.toJSON());
  }

  async findByPhoneNumber(
    phoneNumber: string,
    attributes: (keyof ClientDto)[] = ['id', 'phoneNumber'],
  ) {
    return await this.model
      .findOne({
        where: { phoneNumber },
        attributes: attributes,
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
      })
      .then((v) => v?.toJSON());
  }
}
