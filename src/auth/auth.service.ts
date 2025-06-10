import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async signin(data: {
    username: string;
    password: string;
  }): Promise<{ access_token: string }> {
    const { username, password } = data;

    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid username');
    }

    const isValidPassword = user.password === password;

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signup(data: { username: string; password: string }) {
    const { username, password } = data;
    const user = await this.userService.findByUsername(username);
    if (user) {
      throw new UnauthorizedException('Username already exists');
    }
    const newUser = await this.userService.create({ username, password });
    return {
      access_token: await this.jwtService.signAsync({
        sub: newUser.id,
        username: newUser.username,
      }),
    };
  }
}
