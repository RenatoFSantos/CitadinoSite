import { FILE_UPLOAD_DIRECTIVES } from './../ng2-file-upload';
import { UsuarioVO } from './model/usuarioVO';
import { UsuarioService } from './provider/service/usuario.service';
import './rxjs-extensions';

import { AuthService } from './auth.service';
import { Component, NgModule, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import * as firebase from 'firebase';
import { EmpresaVO } from 'app/model/empresaVO';

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
  objEmpresa: EmpresaVO = new EmpresaVO();
  indEmpresa: any = [];
  
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
          if(this.userConected.empresa!=null && this.userConected.empresa!=undefined) {
            this.indEmpresa = Object.keys(this.userConected.empresa);
          }
          this.authService.atualizarProfile(usua, this.userConected);
          this.nomeUsuario = this.userConected.usua_tx_login;
          this.perfil = this.userConected.usua_sg_perfil;
          if(this.indEmpresa.length>0) {
            this.objEmpresa.empr_sq_id = this.userConected.empresa[this.indEmpresa[0]].empr_sq_id;
          }
        });
    });
    
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
    this.inscUser.unsubscribe();
  }

}
