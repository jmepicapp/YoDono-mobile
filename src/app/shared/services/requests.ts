import { HttpHeaders } from '@angular/common/http';

export class AppSettings {

    public static HEADERS = new HttpHeaders({'Content-Type' : 'application/json'});

    public static URL_AUTH = 'http://localhost:8080/oauth/token';

    public static CREDENCIALES = btoa('yodono' + ':' + 'proyecto.integrado');

    public static URL_ENDPOINT = 'http://localhost:8080/api';
    //public static URL_ENDPOINT = 
} 
