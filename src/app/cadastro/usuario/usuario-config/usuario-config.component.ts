import { Subject } from 'rxjs/Subject';
import { Subscription, Observable } from 'rxjs/Rx';
import { Component, OnInit, NgModule } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from './../../../auth.service';
import { UsuarioService } from './../../../provider/service/usuario.service';
import { UsuarioVO } from './../../../model/usuarioVO';

declare var jQuery:any;

@Component({
  selector: 'app-usuario-config',
  templateUrl: './usuario-config.component.html',
  styleUrls: ['./usuario-config.component.css']
})

export class UsuarioConfigComponent implements OnInit {
  response: string;
  stsMensagem: string = 'alert alert-dismissible';
  txtMensagem: string = '';
  flagHidden: boolean = true;
  hideLoader: boolean = false;
  idUsuario: string = '';
  listaUploads: Array<File> = [];
  numPerc: number = 0;

  userConected: firebase.User;
  model: UsuarioVO = new UsuarioVO();
  
  constructor(private route: ActivatedRoute, private router: Router, private usuarioService: UsuarioService, private authService: AuthService) {
    
  }

  ngOnInit() {
    console.log('On Init. Carregando Usuário atual');
    this.userConected = this.authService.getLoggedInUser();
    this.model = this.carregaModelo(this.userConected);
  }

  carregaModelo(user: firebase.User) {
    let usuario: UsuarioVO = new UsuarioVO();
    usuario.usua_sq_id = user.uid;
    usuario.usua_ds_email = user.email;
    return usuario;
  }

  onSubmit(form:NgForm) {
    // *******************************************************************
    // - Rotina de Atualização de Registro
    // *******************************************************************
    console.log('Rotina de atualização');
    this.usuarioService.atualizarSenha(this.model)
        .then(() => {
            this.stsMensagem = 'alert alert-dismissible alert-success';
            this.txtMensagem = 'Aguarde...salvando registro!';
            this.flagHidden = false;
            jQuery("#modalUpload").modal("hide");
        }).catch((err) => {
            this.stsMensagem = 'alert alert-dismissible alert-danger';
            this.txtMensagem = 'Não foi possível atualizar o registro. Verifique!';
            this.flagHidden = false;
        });
  }
}
