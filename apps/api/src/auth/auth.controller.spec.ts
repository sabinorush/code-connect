import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<Pick<AuthService, 'login'>>;

  beforeEach(async () => {
    authService = { login: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get(AuthController);
  });

  it('delegates login to AuthService', async () => {
    const dto = { email: 'ada@example.com', password: 'super-secret-1' };
    const session = {
      accessToken: 'signed-token',
      tokenType: 'Bearer',
      expiresIn: 3600,
    };
    authService.login.mockResolvedValue(session);

    const result = await controller.login(dto);

    expect(authService.login).toHaveBeenCalledWith(dto);
    expect(result).toBe(session);
  });
});
