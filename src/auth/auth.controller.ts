import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

//This shorthand allow to skip all the verbose the classic dependencies injection
// export class AuthController {
//   authService: AuthService;

//   constructor(authService: AuthService) {
//     this.authService = authService;
//   }
// }

@Controller('auth') //Prefixing all roads by passing it in decorator args
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
