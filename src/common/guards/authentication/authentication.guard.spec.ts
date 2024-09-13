import { Test, TestingModule } from '@nestjs/testing';
import { AzureADStrategy, AzureADGuard } from './authentication.guard';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { MsLoginRespDTO } from './dto/ms-login-resp.dto';
import { passportConfig } from './config/auth.config';

describe('AzureADStrategy', () => {
  let azureADStrategy: AzureADStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AzureADStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'TENENT_ID') return 'your-tenant-id';
              if (key === 'CLIENT_ID') return 'your-client-id';
            }),
          },
        },
      ],
    }).compile();

    azureADStrategy = module.get<AzureADStrategy>(AzureADStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(azureADStrategy).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true when a valid token is provided', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      };
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      };
      const validateSpy = jest
        .spyOn(azureADStrategy, 'validate')
        .mockResolvedValue({} as MsLoginRespDTO);

      const result = await azureADStrategy.canActivate(
        mockContext as unknown as ExecutionContext,
      );

      expect(result).toBe(true);
      expect(validateSpy).toHaveBeenCalledWith('valid-token');
    });

    it('should return false when an invalid token is provided', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer invalid-token',
        },
      };
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      };
      const validateSpy = jest
        .spyOn(azureADStrategy, 'validate')
        .mockResolvedValue(null);

      const result = await azureADStrategy.canActivate(
        mockContext as unknown as ExecutionContext,
      );

      expect(result).toBe(false);
      expect(validateSpy).toHaveBeenCalledWith('invalid-token');
    });
  });

  describe('validate', () => {
    it('should return the decoded token', async () => {
      const mockToken: MsLoginRespDTO = {
        aud: 'audience',
        iss: 'issuer',
        iat: 1234567890,
        nbf: 1234567890,
        exp: 1234567890,
        name: 'John Doe',
        nonce: 'nonce',
        oid: 'object-id',
        preferred_username: 'john.doe@example.com',
        rh: 'refresh-token',
        sub: 'subject',
        tid: 'tenant-id',
        uti: 'unique-token-identifier',
        ver: '1.0',
      };

      const result: MsLoginRespDTO = await azureADStrategy.validate(mockToken);

      expect(result).toEqual(mockToken);
    });
  });
});
