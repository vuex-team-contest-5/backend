import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClientModel } from '../modules/client/client.model';
import { Sequelize } from 'sequelize-typescript';
import { CommonException } from '../common/errors/common.error';
import { randomUUID } from 'crypto';
import { hashPassword } from '../auth/bcrypt';
import { AdminService } from './../modules/admin/admin.service';
import { LoginDto } from './dto/login.dto';
import { AuthException } from './auth.errors';
import { MailService } from './mail/mail.service';
import { AdminModel } from '../modules/admin/admin.model';
import { ClientService } from './../modules/client/client.service';
import { RedisService } from './redis/redis.service';
import { RegisterDto } from './dto/register.dto';
import { OtpDto } from './dto/otp.dto';
import { JwtPayloadDto } from './dto/jwt.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ProductModel } from '../modules/product/product.model';
import { TeacherModel } from '../modules/teacher/teacher.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AdminModel) readonly adminModel: typeof AdminModel,
    @InjectModel(ClientModel) readonly clientModel: typeof ClientModel,
    @InjectModel(ProductModel) readonly productModel: typeof ProductModel,
    @InjectModel(TeacherModel) readonly teacherModel: typeof TeacherModel,
    private readonly adminService: AdminService,
    private readonly clientService: ClientService,
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly sequelize: Sequelize,
  ) {}

  async registerAdmin(data: RegisterDto) {
    const userByPhoneNumber = await this.adminService.findByPhoneNumber(
      data.phoneNumber,
      ['id'],
    );
    if (userByPhoneNumber) {
      throw CommonException.AllreadyExist('Phone Number');
    }

    const userByEmail = await this.adminService.findByEmail(data.email, ['id']);
    if (userByEmail) {
      throw CommonException.AllreadyExist('Email');
    }

    data.id = randomUUID();
    data.hashedPassword = await hashPassword(data.password, 10);

    await this.adminModel.create(data);

    const instance = await this.adminModel.findOne({
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

  async loginAdminWithPhoneNumber({
    email,
    phoneNumber,
  }: LoginDto): Promise<any> {
    const admin = await this.adminService.findByEmail(email, [
      'id',
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
    ]);

    if (!(admin && admin.phoneNumber === phoneNumber)) {
      throw AuthException.Unauthorized();
    }

    const fullName = `${admin.firstName} ${admin.lastName}`;

    const otp = await this.generateOTP();

    await this.mailService.sendConfirmation(admin.email, fullName, otp);

    const redisExpire = 2 * 60;

    await this.redisService.set(
      {
        key: admin.id,
        value: JSON.stringify({ code: otp, role: 'admin' }),
      },
      redisExpire,
    );

    return {
      ownerId: admin.id,
      message: `OTP send to email: ${admin.email}`,
    };
  }

  async loginClientWithPhoneNumber({
    email,
    phoneNumber,
  }: LoginDto): Promise<any> {
    const client = await this.clientService.findByEmail(email, [
      'id',
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
    ]);

    if (!(client && client.phoneNumber === phoneNumber)) {
      throw AuthException.Unauthorized();
    }

    const fullName = `${client.firstName} ${client.lastName}`;

    const otp = await this.generateOTP();

    await this.mailService.sendConfirmation(client.email, fullName, otp);

    const redisExpire = 2 * 60;

    await this.redisService.set(
      {
        key: client.id,
        value: JSON.stringify({ code: otp, role: 'client' }),
      },
      redisExpire,
    );

    return {
      ownerId: client.id,
      message: `OTP send to email: ${client.email}`,
    };
  }

  async verifyOTP({ ownerId, code }: OtpDto) {
    let otp: any = await this.redisService.get(ownerId);
    if (otp) otp = JSON.parse(otp);

    if (!(otp && otp.code == code)) {
      throw AuthException.Unauthorized();
    }

    await this.redisService.clear(ownerId);

    return {
      message: 'OTP verified ✅',
      ownerId,
      role: otp.role,
      token: await this.jwtSigIn({
        id: ownerId,
        role: otp.role,
      }),
    };
  }

  async getCountInfo() {
    const poructCount = await this.productModel.count({
      where: { type: 'product' },
    });
    const clientCount = await this.clientModel.count();
    const teacherCount = await this.teacherModel.count();
    const equipmentCount = await this.productModel.count({
      where: { type: 'equipment' },
    });

    return {
      poructCount,
      clientCount,
      teacherCount,
      equipmentCount,
    };
  }

  async generateOTP() {
    const code = `${Math.floor(Math.random() * 9000) + 1000}`;
    return code;
  }

  async jwtSigIn(payload: JwtPayloadDto): Promise<string> {
    const options: JwtSignOptions = {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRE,
    };

    return await this.jwtService.signAsync(payload, options);
  }

  async jwtVerify(token: string): Promise<{
    success: boolean;
    user: JwtPayloadDto;
  }> {
    const options: JwtSignOptions = {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRE,
    };
    try {
      return {
        success: true,
        user: await this.jwtService.verifyAsync(token, options),
      };
    } catch (error) {
      return { success: false, user: null };
    }
  }
}
