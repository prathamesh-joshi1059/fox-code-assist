import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy, AuthGuard } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';
import { MsLoginRespDTO } from './dto/ms-login-resp.dto';
import { passportConfig } from './config/auth.config';

@Injectable()
export class AzureADStrategy extends PassportStrategy(BearerStrategy, 'azure-ad') implements CanActivate {
  constructor(private readonly configService: ConfigService) {
    const environment = configService.get<string>('ENV') || 'dev';
    const clientId = this.getClientId(environment);

    const options = {
      identityMetadata: `https://${passportConfig.metadata.authority}/${configService.get<string>('TENANT_ID')}/${passportConfig.metadata.version}/${passportConfig.metadata.discovery}`,
      clientID: clientId,
      audience: `api://${clientId}`,
      issuer: `https://sts.windows.net/${configService.get<string>('TENANT_ID')}/`,
      loggingLevel: passportConfig.settings.loggingLevel,
      loggingNoPII: passportConfig.settings.loggingNoPII,
      validateIssuer: passportConfig.settings.validateIssuer,
      passReqToCallback: passportConfig.settings.passReqToCallback,
      scope: ['access_as_user'],
    };
    super(options);
  }

  private getClientId(environment: string): string {
    switch (environment) {
      case 'dev':
        return this.configService.get<string>('CLIENT_ID_DEV');
      case 'qa':
        return this.configService.get<string>('CLIENT_ID_QA');
      case 'prod':
        return this.configService.get<string>('CLIENT_ID_PROD');
      default:
        return this.configService.get<string>('CLIENT_ID_DEV');
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1] || null;
    const decodedToken = token ? await this.validate(token) : null;
    return !!decodedToken;
  }

  async validate(data: MsLoginRespDTO): Promise<MsLoginRespDTO> {
    return data;
  }
}

export const AzureADGuard = AuthGuard('azure-ad');