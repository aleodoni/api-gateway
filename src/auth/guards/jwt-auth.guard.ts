import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('CANACTIVATE');
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    // console.log(`JwtAuthGuard: ${JSON.stringify(context)}`);
    // console.log(context.getHandler());
    // console.log(context.getClass());
    // console.log(context.switchToHttp().getResponse().req.headers);

    return super.canActivate(context);
  }

  handleRequest(err, user, info, context, status) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    console.log('HANDLEREQUEST');
    console.log(user);
    console.log(context.args[0].headers);
    console.log(status);
    return user;
  }
}
