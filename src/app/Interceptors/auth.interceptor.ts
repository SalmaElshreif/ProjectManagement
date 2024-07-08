import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private authToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMDEwNTA2MDg2MDciLCJqdGkiOiJmNDBhNzFhYS04YmFjLTQ4NTAtOTA4YS1hNWU0MzFkOTE0MTMiLCJ1aWQiOiIyZDc3MjhlZS02ODRiLTQ0NzEtODE2ZC03MjU4OTYwM2E0YmIiLCJCcmFuc2giOiI4NTI0NzU5My03MThiLTRhNzEtMmMwMi0wOGRjOGM3ZTA1YTkiLCJUZW5hbnRJZCI6IjlmY2ViZGZmLTQ5ZmUtNGJmZC1iM2M1LTk4YjEzYTZhYzdlMiIsIkNvbXBhbnlJRCI6IjQzOTAwOWMzLTA1YjEtNDEwOC02MzVmLTA4ZGM4YzdlMDU5YyIsIlVzZXJOYW1lIjoiMDEwNTA2MDg2MDciLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjJkNzcyOGVlLTY4NGItNDQ3MS04MTZkLTcyNTg5NjAzYTRiYiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjoxNzIwNDM0NjE0LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjQyMDAifQ.BuWmk_8RupMDfGOjARRtUM3mvOzKo6Jm13xG5s-d_RI';

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authToken}`
      }
    });

    return next.handle(request);
  }
}
