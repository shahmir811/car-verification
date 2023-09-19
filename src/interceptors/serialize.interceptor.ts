import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ClassContructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassContructor) {
  return UseInterceptors(new SerializerInterceptor(dto));
}

export class SerializerInterceptor implements NestInterceptor {
  constructor(private dto: ClassContructor) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Run something here before the request is handled by the request handler (controller)

    return next.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
