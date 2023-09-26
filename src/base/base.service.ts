import { PGBaseModel } from './base.model';
import { BaseDto } from './base.dto';
import { MakeNullishOptional } from 'sequelize/types/utils';
import { randomUUID } from 'crypto';
import { CommonException } from '../common/errors/common.error';

type CreationAttributes = Pick<BaseDto, 'id'>;

export abstract class BaseService<
  TModelAttributes extends BaseDto = BaseDto,
  TCreationAttributes extends CreationAttributes = CreationAttributes,
> {
  protected constructor(
    protected model: typeof PGBaseModel<TModelAttributes, TCreationAttributes>,
  ) {}

  async create(data: MakeNullishOptional<TCreationAttributes>) {
    data.id = randomUUID();

    return (
      await this.model.create(data, {
        isNewRecord: true,
        returning: true,
      })
    ).toJSON();
  }

  async findById(id: any): Promise<TModelAttributes> {
    const instance = await this.model.findOne({
      where: { id },
      attributes: {
        exclude: [
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

    return instance.toJSON();
  }

  async updateById(data: TModelAttributes) {
    const instance = await this.model.findOne({
      where: { id: data.id },
      attributes: {
        exclude: [
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

    return (await instance.update(data)).toJSON();
  }

  async deleteById(id: any) {
    const instance = await this.model.findOne({
      where: { id },
      attributes: {
        exclude: [
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

    await instance.update({ status: true } as Partial<TModelAttributes>);
    return { id };
  }
}
