import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export type JwtPayload = {
  sub: number;
};

export class UserDetails {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;
}

export class GetProfileResponse extends UserDetails {}

export class LoginRequest {
  @ApiProperty()
  @IsEmail()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class LoginResponse {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: UserDetails;
}
