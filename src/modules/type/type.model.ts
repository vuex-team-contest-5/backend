import { Table, Column, HasMany } from 'sequelize-typescript';
import { PGBaseModel } from '../../base/base.model';
import { TypeDto } from './type.dto';
import { PG_TABLE_NAMES } from '../../common/constant/tables';
import { TeacherModel } from '../teacher/teacher.model';
import { TeacherDto } from '../teacher/teacher.dto';

@Table({ tableName: PG_TABLE_NAMES.TYPE, underscored: true })
export class TypeModel extends PGBaseModel<TypeDto, TypeDto> {
  @Column({ allowNull: false })
  name: string;

  @HasMany(() => TeacherModel)
  teacher: TeacherDto[];
}
