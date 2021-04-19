import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetAuthData = createParamDecorator((data, ctx: ExecutionContext): any => {
  const req = ctx.switchToHttp().getRequest();
  switch (data) {
    case 'user':
      return req.user.user;
    case 'profile':
      return req.user.profile;
    case 'company':
      return req.user.company;
    case 'branch':
      return req.user.branch;
    default:
      return req.user;
  }
});
