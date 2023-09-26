import { Injectable } from '@nestjs/common';
import { TypeDto, TypePagingDto } from './type.dto';
import { InjectModel } from '@nestjs/sequelize';
import { TypeModel } from './type.model';
import { BaseService } from '../../base/base.service';
import { Sequelize } from 'sequelize';

@Injectable()
export class TypeService extends BaseService<TypeDto, TypeDto> {
  constructor(@InjectModel(TypeModel) model: typeof TypeModel) {
    super(model);
  }

  async findAll(query: TypePagingDto): Promise<ResponsePaging<TypeDto>> {
    query.limit = Number(query.limit || 10);
    query.page = Number(query.page || 1);

    const instance = await this.model.findAndCountAll({
      order: [['createdAt', String(query.orderType || 'ASC')]],
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
      attributes: {
        include: [
          [Sequelize.literal('COUNT("TypeModel"."id")::INTEGER'), 'count'],
        ],
        exclude: [
          'createdAt',
          'createdBy',
          'updatedAt',
          'deletedAt',
          'deletedBy',
        ],
      },
      // include: [
      //   {
      //     model: TeacherModel,
      //     attributes: [],
      //   },
      // ],
      paranoid: false,
      subQuery: false,
      group: ['TypeModel.id'],
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
