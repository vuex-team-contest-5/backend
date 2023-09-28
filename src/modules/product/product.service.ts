import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { ProductDto, ProductPagingDto } from './product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { ProductModel } from './product.model';
import { randomUUID } from 'crypto';
import { CommonException } from '../../common/errors/common.error';
import { ImageService } from '../image/image.service';
import { Sequelize } from 'sequelize-typescript';
import { CategoryService } from '../category/category.service';
import { CategoryModel } from '../category/category.model';

@Injectable()
export class ProductService extends BaseService<ProductDto, ProductDto> {
  constructor(
    @InjectModel(ProductModel) model: typeof ProductModel,
    private categoryService: CategoryService,
    private readonly imageService: ImageService,
    private sequelize: Sequelize,
  ) {
    super(model);
  }

  async create(data: ProductDto, image?: Express.Multer.File) {
    await this.categoryService.findById(data.categoryId);

    data.id = randomUUID();

    let fileName = null;
    if (image) fileName = await this.imageService.create(image);
    data.imageName = fileName;

    await this.model.create(data);

    const instance = await this.model.findOne({
      where: { id: data.id },
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
    });

    return instance.toJSON();
  }

  async findAll(query: ProductPagingDto): Promise<ResponsePaging<ProductDto>> {
    query.limit = Number(query.limit || 10);
    query.page = Number(query.page || 1);

    const filter = { type: query.type };
    if (query.categoryId) {
      filter['categoryId'] = query.categoryId;
    }

    const instance = await this.model.findAndCountAll({
      order: [['createdAt', String(query.orderType || 'ASC')]],
      where: filter,
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
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

  async updateById(data: ProductDto, image?: Express.Multer.File) {
    const instance = await this.model.findOne({
      where: { id: data.id },
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
    });

    if (!instance) {
      throw CommonException.NotFound(this.model.tableName);
    }

    if (data.categoryId) {
      await this.categoryService.findById(data.categoryId);
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
}
