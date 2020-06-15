import { Rol } from './rol';

export class Usuario {
    id?: number;
    email: string;
    password?: string;
    activo: boolean;
    rol: Rol;
}