import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { NotFoundError } from "@mikro-orm/core";

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const isProduction = process.env.NODE_ENV === "production";
    const isLoginRoute = context.getHandler().name === "login";

    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof NotFoundError) {
          return throwError(() => new NotFoundException(!isProduction && error.message));
        } else {
          return throwError(() => error);
        }
      }),
      map((data) => (isLoginRoute ? data : { data })),
    );
  }
}
