import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from './requests';
import { Usuario } from '../models/usuario';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private _usuario: Usuario;
  private _token: string;

  urlEndPoint = AppSettings.URL_AUTH;
  headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + AppSettings.CREDENCIALES
  });

  constructor(private http: HttpClient, private storage: Storage) { }

  public get usuario(): Usuario {
    if(this._usuario != null){
      return this._usuario;
    }else if(this._usuario == null && this.storage.get('usuario') != null){
      this.storage.get('usuario').then(val =>{
        this._usuario = JSON.parse(val) as Usuario;
      });
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if(this._token != null){
      return this._token;
    }else if(this._token == null && this.storage.get('token') != null){
      this.storage.get('token').then(val =>{
        this._token = val as string;
      });
      return this._token;
    }
    return null;
  }

  login(usuario: Usuario): Observable<any>{
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.email);
    params.set('password', usuario.password);
    return this.http.post<any>(this.urlEndPoint, params.toString(), {headers: this.headers});
  }

  logout():void {
    this._token = null;
    this._usuario = null;
    this.storage.clear();
  }

  saveUser(accessToken: string): void {
    let payload = this.decryptToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.email = payload.user_name;
    this._usuario.password = payload.password;
    this._usuario.rol = payload.authorities;
    this.storage.set('usuario', JSON.stringify(this._usuario));
  }

  saveToken(accessToken: string): void {
    this._token = accessToken;
    this.storage.set('token', this._token);
  }

  decryptToken(accessToken: string): any {
    if(accessToken != null){
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  isAuthenticated(): boolean {
    let payload = this.decryptToken(this.token);
    if(payload != null && payload.user_name && payload.user_name.length > 0){
      return true;
    }
    return false;
  }

  hasRole(role: string): boolean {
    if(this.usuario.rol != null){
      if(this.usuario.rol[0] === role){
        return true;
      }
      return false;
    }
    return false;
  }

}
