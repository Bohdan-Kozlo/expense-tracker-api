import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { Response, Request } from "express";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { RefreshTokenGuard } from "../auth-guards/refresh-token.guard";
import { AccessTokenGuard } from "../auth-guards/access-token.guard";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  @ApiOperation({
    summary: "Register a new user and get access and refresh tokens",
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: "User registered successfully, tokens issued.",
  })
  @ApiResponse({ status: 400, description: "Invalid user data." })
  @Post("register")
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const tokens = await this.authService.registration(createUserDto);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
    });

    res.status(201).send({ accessToken: tokens.accessToken });
  }

  @Post("login")
  @ApiOperation({
    summary: "Login an existing user and get access and refresh tokens",
  })
  @ApiBody({ type: AuthLoginDto })
  @ApiResponse({
    status: 201,
    description: "User logged in successfully, tokens issued.",
  })
  @ApiResponse({ status: 400, description: "Invalid login credentials." })
  async login(@Body() authLoginDto: AuthLoginDto, @Res() res: Response) {
    const tokens = await this.authService.login(authLoginDto);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
    });

    res.status(201).send({ accessToken: tokens.accessToken });
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  @Post("logout")
  @ApiOperation({ summary: "Logout the user and invalidate the access token" })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: "User logged out successfully." })
  @ApiResponse({ status: 401, description: "Unauthorized request." })
  async logout(@Req() req: Request) {
    const userId = req.user["userId"] as string;
    return this.authService.logout(+userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Post("refresh")
  @ApiOperation({ summary: "Refresh the access token using the refresh token" })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Access token refreshed successfully.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized request." })
  async refresh(@Res() res: Response, @Req() req: Request) {
    const userId = req.user["userId"] as string;
    const tokens = await this.authService.refreshTokens(+userId);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
    });

    return res.send({ accessToken: tokens.accessToken });
  }
}
