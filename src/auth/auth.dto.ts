import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/entities";

export type JwtPayload = {
  sub: number;
};

export class UserDetails {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  constructor(id: number, username: string) {
    this.id = id;
    this.username = username;
  }

  static from(model: User) {
    return new UserDetails(model.id, model.username);
  }
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
