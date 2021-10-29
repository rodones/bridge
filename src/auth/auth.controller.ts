import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOAuth2, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Public } from "./auth.decorator";
import { GetProfileResponse, LoginRequest, LoginResponse } from "./auth.dto";
import { LocalAuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";

@ApiTags("auth")
@ApiOAuth2([])
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: "Get token" })
  @ApiBody({ type: LoginRequest })
  @ApiResponse({
    status: 200,
    description: "Token and basic user information",
    type: LoginResponse,
  })
  async login(@Req() req): Promise<LoginResponse> {
    return await this.authService.getToken(req.user);
  }

  @Get("profile")
  @ApiOperation({
    summary: "Get user's basic informations",
  })
  @ApiResponse({
    status: 200,
    description: "User information",
    type: GetProfileResponse,
  })
  async getProfile(@Req() req) {
    return await this.authService.getUserById(req.user.id);
  }
}
