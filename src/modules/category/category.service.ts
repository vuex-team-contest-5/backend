import { Injectable } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { CategoryDto, CategoryPagingDto } from './category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryModel } from './category.model';
import { Sequelize } from 'sequelize';

@Injectable()
@Injectable()
export class CategoryService extends BaseService<CategoryDto, CategoryDto> {
  constructor(@InjectModel(CategoryModel) model: typeof CategoryModel) {
    super(model);
  }

  async findAll(
    query: CategoryPagingDto,
  ): Promise<ResponsePaging<CategoryDto>> {
    query.limit = Number(query.limit || 10);
    query.page = Number(query.page || 1);

    const filter = { type: query.type };

    const instance = await this.model.findAndCountAll({
      order: [['createdAt', String(query.orderType || 'ASC')]],
      where: filter,
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
      attributes: {
        include: [
          [Sequelize.literal('COUNT("CategoryModel"."id")::INTEGER'), 'count'],
        ],
        exclude: [
          'createdAt',
          'createdBy',
          'updatedAt',
          'deletedAt',
          'deletedBy',
        ],
      },
      include: [
        // {
        //   model: ProductModel,
        //   attributes: [],
        // },
      ],
      paranoid: false,
      subQuery: false,
      group: ['CategoryModel.id'],
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
}
