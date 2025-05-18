import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export const TokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {

  let token = localStorage.getItem('token');

  console.log('Interceptor running. Token:', token);

  if (token) {
    // Add the 'Bearer ' prefix only if it's not already present
    if (!token.startsWith('Bearer ')) {
      token = 'Bearer ' + token;
    }

    const clonedReq = req.clone({
      setHeaders: {
        Authorization: token,
      },
    });
    console.log('Request with auth header:', clonedReq);
    return next(clonedReq);
  }

  console.log('No token found, sending original request.');
  return next(req);
};
