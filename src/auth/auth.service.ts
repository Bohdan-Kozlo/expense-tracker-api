import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { CreateUserDto } from "../users/dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { AuthLoginDto } from "./dto/auth-login.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registration(createUserDto: CreateUserDto) {
    const existsUser = await this.usersService.findUserByEmail(
      createUserDto.email,
    );
    if (existsUser) {
      throw new BadRequestException("Password or email wrong");
    }

    const hashPassword = await bcrypt.hash(createUserDto.password, 12);
    const user = await this.usersService.createUser({
      ...createUserDto,
      password: hashPassword,
    });

    const tokens = await this.createTokens(user.id);
    await this.usersService.updateUserRefreshToken(
      user.id,
      tokens.refreshToken,
    );
    return tokens;
  }

  async login(authUserDto: AuthLoginDto) {
    const user = await this.usersService.findUserByEmail(authUserDto.email);
    if (!user) {
      throw new BadRequestException("Password or email wrong");
    }

    const isValidPassword = await bcrypt.compare(
      authUserDto.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new BadRequestException("Password or email wrong");
    }

    const tokens = await this.createTokens(user.id);
    await this.usersService.updateUserRefreshToken(
      user.id,
      tokens.refreshToken,
    );
    return tokens;
  }

  async refreshTokens(userId: number) {
    const user = await this.usersService.findUserById(+userId);
    console.log(userId);
    if (!user) {
      throw new BadRequestException("User not found");
    }

    const tokens = await this.createTokens(user.id);
    await this.usersService.updateUserRefreshToken(
      user.id,
      tokens.refreshToken,
    );
    return tokens;
  }

  async logout(userId: number) {
    await this.usersService.updateUserRefreshToken(userId, null);
  }

  async createTokens(userId: number) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ sub: userId }),
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: jwtConstants.refreshTokenSecret,
          expiresIn: "7d",
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
