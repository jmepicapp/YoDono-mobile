import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class RolGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private alertController: AlertController
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.authService.isAuthenticated) {
      if (this.isTokenExpired()) {
        this.authService.logout();
        this.router.navigate(['/empresas']);
        return false;
      }
    }
    let rol = next.data['rol'] as string;
    if (this.authService.hasRole(rol)) {
      return true;
    }
    this.presentAlert();
    this.router.navigate(['/empresas']);
    return false;
  }

  isTokenExpired(): boolean {
    let token = this.authService.token;
    let payload = this.authService.decryptToken(token);
    let now = new Date().getTime() / 1000;

    if (payload.exp < now) {
      return true;
    }
    return false;
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Acceso denegado',
      message: 'No posees permisos suficientes',
      buttons: ['Aceptar'],
    });

    await alert.present();
  }
}
