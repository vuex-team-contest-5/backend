import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { BaseDtoGroup } from '../../base/base.dto';

export class OtpDtoGroup extends BaseDtoGroup {
  static readonly OTP = 'Otp';
}

export class OtpDto {
  @ApiProperty({
    description: 'The ID of the owner to verify.',
    type: 'string',
    example: '12345678',
  })
  @IsUUID(4, { groups: [OtpDtoGroup.OTP] })
  ownerId: string;

  @ApiProperty({
    description: 'The OTP code to verify.',
    type: 'string',
    example: '1234',
  })
  @IsString({ groups: [OtpDtoGroup.OTP] })
  @MinLength(4)
  @MaxLength(4)
  code: string;
}
