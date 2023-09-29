import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MyValidationPipe } from '../common/validators/validation.pipe';
import { RegisterDto, RegisterDtoGroup } from './dto/register.dto';
import { LoginDto, LoginDtoGroup } from './dto/login.dto';
import { OtpDto, OtpDtoGroup } from './dto/otp.dto';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth('admin_auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/register')
  async registerAdmin(
    @Body(new MyValidationPipe([RegisterDtoGroup.REGISTER])) data: RegisterDto,
  ) {
    return this.authService.registerAdmin(data);
  }

  @Post('admin/login')
  async loginAdminWithPhoneNumber(
    @Body(new MyValidationPipe([LoginDtoGroup.LOGIN])) data: LoginDto,
  ) {
    return this.authService.loginAdminWithPhoneNumber(data);
  }

  @Post('client/login')
  async loginClientWithPhoneNumber(
    @Body(new MyValidationPipe([LoginDtoGroup.LOGIN])) data: LoginDto,
  ) {
    return this.authService.loginClientWithPhoneNumber(data);
  }

  @Post('otp/verify')
  async verifyOTP(@Body(new MyValidationPipe([OtpDtoGroup.OTP])) data: OtpDto) {
    return this.authService.verifyOTP(data);
  }
}
