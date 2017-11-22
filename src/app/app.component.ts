import { UsuarioVO } from './model/usuarioVO';
import { UsuarioService } from './provider/service/usuario.service';
import './rxjs-extensions';

import { AuthService } from './auth.service';
import { Component, NgModule, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  mostrarBarraLogin: boolean = false;
  inscricao: Subscription;
  inscUser: Subscription;
  userConected: UsuarioVO = new UsuarioVO();
  userLogado: firebase.User;
  nomeUsuario: string = 'Visitante';
  perfil: string = 'USU' // Perfil padrão
  
  constructor(private authService: AuthService, private usuarioService: UsuarioService) {
 
  }

  ngOnInit() {
    console.log('ngOnInit do app');
    this.inscricao = this.authService.mostrarMenuLoginEmitter.subscribe(
      mostra => this.mostrarBarraLogin = mostra
    );

    this.inscUser = this.authService.exibirUsuario.subscribe(usua => {
      this.userLogado = usua
      this.usuarioService.getUsuario(usua.uid)
        .then(usuario => {
          this.userConected = usuario.val();
          this.authService.atualizarProfile(usua, this.userConected);
          this.nomeUsuario = this.userConected.usua_tx_login;
          this.perfil = this.userConected.usua_sg_perfil;
        });
    });
    
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
    this.inscUser.unsubscribe();
  }

}
