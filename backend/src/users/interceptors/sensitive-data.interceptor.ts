import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ResponseResult } from '@types';
import { User } from '@users/entities/user.entity';
import { Observable, map } from 'rxjs';

const clearData = (data: User | User[] | ResponseResult<User>) => {
  if (Array.isArray(data)) {
    return data.map((elem) => {
      delete elem['password'];
      return elem;
    });
  } else if (typeof data === 'object' && data['data']) {
    return {
      ...data,
      data: (data as ResponseResult<User>).data.map((elem) => {
        delete elem['password'];
        return elem;
      }),
    };
  } else {
    delete data['password'];
    return data;
  }
};

@Injectable()
export class SensitiveDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return clearData(data);
      }),
    );
  }
}
