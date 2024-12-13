import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants, bcryptConstants } from './constants';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { AuthResolver } from './auth.resolver';

if (jwtConstants.secret === undefined) {
  throw new Error('JWT_SECRET is not defined, please set it in .env file');
}
if (bcryptConstants.saltOrRounds === undefined) {
  throw new Error(
    'BCRYPT_SALT_OR_ROUNDS is not defined, please set it in .env file',
  );
}

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1w' }, // TODO: change to needs
    }),
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthResolver,
  ],
  exports: [AuthService],
})
export class AuthModule {}
