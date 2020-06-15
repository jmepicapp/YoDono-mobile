import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private alertController: AlertController
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        if (error.status === 401) {
          if (this.authService.isAuthenticated()) {
            this.authService.logout();
            this.presentAlert401();
          }
          this.router.navigate(['/empresas']);
        }
        if (error.status === 403) {
          this.presentAlert403();
          this.router.navigate(['/empresas']);
        }
        return throwError(error);
      })
    );
  }

  async presentAlert403() {
    const alert = await this.alertController.create({
      header: 'Acceso denegado',
      message: 'No posees permisos suficientes',
      buttons: ['Aceptar']
      ,
    });

    await alert.present();
  }

  async presentAlert401() {
    const alert = await this.alertController.create({
      header: 'Inicia sesión nuevamente',
      buttons: ['Aceptar']
      ,
    });

    await alert.present();
  }
}
