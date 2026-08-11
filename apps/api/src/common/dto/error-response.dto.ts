import { ApiProperty } from '@nestjs/swagger';

/**
 * Shape of every error response produced by Nest's built-in exception
 * filter. Documented explicitly so Swagger renders a real schema for
 * 4xx/5xx responses instead of leaving them untyped.
 */
export class ErrorResponseDto {
  @ApiProperty({ example: 400, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({
    description: 'Human-readable error message(s)',
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: ['email must be an email'],
  })
  message: string | string[];

  @ApiProperty({ example: 'Bad Request', required: false })
  error?: string;
}
