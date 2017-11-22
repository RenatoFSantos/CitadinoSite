import { ContatoVO } from './model/contatoVO';
import { UsuarioService } from './provider/service/usuario.service';
import { UsuarioVO } from './model/usuarioVO';
import { Router } from '@angular/router';
import { Injectable, EventEmitter } from '@angular/core';
import { FirebaseService } from './../app/provider/database/firebase.service'
import * as firebase from 'firebase';

import { Observable } from 'rxjs/Rx';
import { Http, HttpModule, RequestOptions, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  public usuarioAutenticado: boolean = false;
  public usuarioAtual: firebase.User;

  mostrarMenuLoginEmitter = new EventEmitter<boolean>();
  exibirUsuario = new EventEmitter();

  constructor(private route: Router, private http: Http) { }

  sendemail(contato: ContatoVO):Observable<ContatoVO> {
      let _headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: _headers });

      return this.http.post('/api/enviaremail', contato, options)
                      .map(this.extractData)
                      .catch(this.handleErrorObservable);
  }

  private extractData(res: Response) {
	    // let body = res.json();
	    let body = JSON.parse(JSON.stringify(res));
      return body.data || {};
  }
 
  private handleErrorObservable (error: Response | any) {
      console.error(error.message || error);
	    return Observable.throw(error.message || error);
  }

  ativarBarraLogin() {
    this.mostrarMenuLoginEmitter.emit(true);
  }

  ativarBarraPrincipal() {
    this.mostrarMenuLoginEmitter.emit(false);
    // this.exibirUsuario.emit(this.usuarioAtual);
  }

  // -- Autenticação do usuário
  autenticarUsuario(usuario: UsuarioVO): Promise<boolean> {
    let result = false;   
    return new Promise((resolve) => { 
      this.signInUserFB(usuario.usua_ds_email, usuario.usua_tx_senha)
      .then((snapUsua) => {
          console.log('snapUsua=', snapUsua);
          if(snapUsua) {
            console.log('Senha válida!');
            this.usuarioAutenticado = true;
            this.usuarioAtual = this.getLoggedInUser();
            this.exibirUsuario.emit(snapUsua);
            this.ativarBarraPrincipal();
            this.route.navigate(['/home']);
            result=true;
          } else {
            console.log('Senha inválida!');
            this.usuarioAutenticado = false;
            result=false;
            this.route.navigate(['/login'],{queryParams: {autenticado: false}});
          };
        resolve(result);        
      })
      .catch(err => {
        console.log('Erro no login', err);
        resolve(false);
      })
    })
  }

  // --- Enviar um email de reinicialização de senha
  enviarSenha(email): Promise<boolean> {
    return new Promise((resolve) => {
      firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          resolve(true)
        }, error => {
          resolve(false)
        })
    })
  }

  // --- Atualizar Profile
  atualizarProfile(userAuth: firebase.User, userLogado: UsuarioVO) {
    console.log('User Auth:', userAuth);
    console.log('User Logado:', userLogado);
    userAuth.updateProfile({
      displayName: userLogado.usua_tx_login==null ? '' : userLogado.usua_tx_login,
      photoURL: userLogado.usua_tx_urlprofile
    }).then(() => console.log('Gravação correta')).catch(() => console.log('Gravacao com erro'))
  }

  // -- Login de Usuário Firebase
  signInUserFB(email: string, password: string) {
    console.log('Autenticando usuário signInUserFB');
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  // -- Cria autenticação do usuário
  registerUser(user: UsuarioVO) {
    return firebase.auth().createUserWithEmailAndPassword(user.usua_ds_email, user.usua_tx_senha);
  }

  // -- Retorna Usuario Autenticado
  getLoggedInUser() {
    console.log('Usuário corrente=', firebase.auth().currentUser);
    return firebase.auth().currentUser;
  }

  // -- Desconecta usuário logado
  signOut() {
    return firebase.auth().signOut();
  }

  // -- Validando autenticação do usuário
  usuarioEstaAutenticado() {
    console.log('Usuário está autenticado? = ', this.usuarioAutenticado);
    return this.usuarioAutenticado;
    // return false;
  }

}
