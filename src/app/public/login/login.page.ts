import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/shared/models/usuario';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario: Usuario;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private alertController: AlertController
  ) {
    this.usuario = new Usuario();
  }
  ngOnInit() {
  }

  login(): void {
    if (this.usuario.email == null || this.usuario.password == null) {
      this.presentAlert();
    }

    this.authService.login(this.usuario).subscribe(response => {

      this.authService.saveUser(response.access_token);
      this.authService.saveToken(response.access_token);
      this.router.navigate(['/']);
    },
    error => {
      if (error.status === 401){
        this.presentAlert();
      }
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Campos incorrectos',
      message: 'Introduce un email y una contraseña válidos',
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

}
