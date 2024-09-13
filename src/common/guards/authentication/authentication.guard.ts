import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy, AuthGuard } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';
import { MsLoginRespDTO } from './dto/ms-login-resp.dto';
import { passportConfig } from './config/auth.config';

@Injectable()
export class AzureADStrategy
  extends PassportStrategy(BearerStrategy, 'azure-ad')
  implements CanActivate
{
  constructor(private readonly configService: ConfigService) {
    const environment = configService.get('ENV');
    let clientId: string;

    switch (environment) {
      case 'dev':
        clientId = configService.get('CLIENT_ID_DEV');
        break;
      case 'qa':
        clientId = configService.get('CLIENT_ID_QA');
        break;
      case 'prod':
        clientId = configService.get('CLIENT_ID_PROD');
        break;
      default:
        clientId = configService.get('CLIENT_ID_DEV');
    }

    const options = {
      identityMetadata: `https://${passportConfig.metadata.authority}/${configService.get('TENANT_ID')}/${passportConfig.metadata.version}/${passportConfig.metadata.discovery}`,
      clientID: clientId,
      audience: `api://${clientId}`,
      issuer: `https://sts.windows.net/${configService.get('TENANT_ID')}/`,
      loggingLevel: passportConfig.settings.loggingLevel,
      loggingNoPII: passportConfig.settings.loggingNoPII,
      validateIssuer: passportConfig.settings.validateIssuer,
      passReqToCallback: passportConfig.settings.passReqToCallback,
      scope: ['access_as_user'],
    };
    super(options);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    const decodedToken = await this.validate(token);
    return !!decodedToken;
  }

  // Validates the token using the BearerStrategy
  async validate(data: MsLoginRespDTO): Promise<MsLoginRespDTO> {
    return data;
  }
}

export const AzureADGuard = AuthGuard('azure-ad');
