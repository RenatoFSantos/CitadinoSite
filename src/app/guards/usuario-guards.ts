import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class UsuarioGuards implements CanActivateChild {

  canActivateChild (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
      console.log('Guardas de rotas filhas');
    return true;
  }


}