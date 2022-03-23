import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  // data is optionnal, so if asked for a particular data, it is served, but unspecified it serves all datas
  const request: Express.Request = ctx.switchToHttp().getRequest();
  if (data) {
    return request.user[data];
  }
  return request.user;
});
