import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export function Serialize(dto: ClassConstructor<unknown>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor<unknown>) {}
  intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Observable<unknown> {
    // that code runs before request is handled
    return handler.handle().pipe(
      map((data: unknown) => {
        // that code runs before response is sent
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
