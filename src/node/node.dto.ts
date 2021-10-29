import { ApiProperty, PartialType, PickType } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class NodeDto {
  @ApiProperty()
  id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  @IsUUID(4)
  key: string;
}

export class CreateNodeDto extends PickType(NodeDto, ["name"]) {}

export class UpdateNodeDto extends PartialType(CreateNodeDto) {}
