import {
  Controller,
  Headers,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './interfaces/user.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  @UsePipes(ValidationPipe)
  async authenticate(@Request() req: any): Promise<User> {
    return req.user;
  }

  @Post('validate')
  async validateToken(
    @Headers('authorization') token: string,
  ): Promise<boolean> {
    return await this.authService.validate(token);
  }
}
