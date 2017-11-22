import { UsuarioService } from './../provider/service/usuario.service';
import { NgForm, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { AuthService } from './../auth.service';
import { UsuarioVO } from './../model/usuarioVO';
import { Component, OnInit, NgModule, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: UsuarioVO = new UsuarioVO();
  stsMensagem: string = 'alert alert-dismissible';
  txtMensagem: string = '';
  flagHidden: boolean = true;
  tela: string = 'login'; // --- login ou senha (esqueceu a senha)

  //mostrarBarraPrincipal: boolean =false;

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private usuarioService: UsuarioService) { }

  ngOnInit() {
    console.log('onInit');
    this.route
      .queryParams
      .subscribe(params => {
        this.flagHidden = params['autenticado'];
        console.log('Autenticado=', this.flagHidden);
      });
  }

  onSubmit(form:NgForm) {
    console.log('onSubmit');
    this.flagHidden = false;
    if(this.tela=='login') {
      console.log('Entrei no login do usuario');
      this.authService.autenticarUsuario(this.model)
        .then(retorno => {
          console.log('Retorno=', retorno);
          if(!retorno) {
            console.log('Retorno foi falso', retorno);
            this.stsMensagem = 'alert alert-dismissible alert-danger';
            this.txtMensagem = 'Login inválido!';
            this.flagHidden = false;
            setInterval(() => { this.flagHidden = true; }, 3000);
          } else {
            this.flagHidden = true;
          }
        })
    } else {
      console.log('Entrei na recuperação da senha do usuario');
      // Validar email e enviar senha recuperada.
      this.usuarioService.validarEmail(this.model)
        .then(retorno => {
          if(retorno) {
            console.log('Retorno foi verdadeiro', retorno);
            // --- Enviar email de reinicializacao
            this.authService.enviarSenha(this.model.usua_ds_email)
              .then((flag) => {
                if(flag) {
                  this.stsMensagem = 'alert alert-dismissible alert-success';
                  this.txtMensagem = 'A senha foi enviada para seu email!';
                  this.flagHidden = false;
                  setInterval(() => { this.flagHidden = true; }, 3000);
                } else {
                  this.stsMensagem = 'alert alert-dismissible alert-danger';
                  this.txtMensagem = 'Não foi possível enviar a senha para o email solicitado. Favor entrar em contato com o suporte pelo email: contato@citadino.com.br';
                  this.flagHidden = false;
                  setInterval(() => { this.flagHidden = true; }, 3000);
                }
              })
          } else {
            console.log('Retorno foi falso', retorno);
            this.stsMensagem = 'alert alert-dismissible alert-danger';
            this.txtMensagem = 'Não identificamos este email em nosso cadastro. Verifique!';
            this.flagHidden = false;
            setInterval(() => { this.flagHidden = true; }, 3000);
          }
          // --- Retornando a tela de login
          this.tela='login';            
        })
    }
    console.log('Fim do onSubmit');
  }

  recuperarSenha() {
    this.tela='senha';
  }

}
