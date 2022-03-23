import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

//This shorthand allow to skip the verbose classic dependencies injection
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

  @HttpCode(200) //Modified because this Post request doesn't create anything
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
