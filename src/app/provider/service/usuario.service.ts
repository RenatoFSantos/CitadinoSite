import { AuthService } from './../../auth.service';
import { EmpresaVO } from './../../model/empresaVO';
import { Observable } from 'rxjs/Rx';
import { UsuarioVO } from './../../model/usuarioVO';
import { FirebaseService } from './../database/firebase.service';
import { Injectable, Component } from '@angular/core';
import * as firebase from 'firebase';
import { EnderecoVO } from './../../model/enderecoVO';

@Injectable()
export class UsuarioService {

  dataFormatada: string = '';
  dataAtual: Date = new Date();

  constructor(private fbSrv: FirebaseService, private authService: AuthService) {
  }

  getTotalRegistros() {
    let result = 0;
    return firebase.database().ref('/usuario').orderByChild('usua_nm_usuario').once('value').then((usuarios) => {
      if(usuarios.val()) {
        let keys = Object.keys(usuarios.val());
        result = keys.length;
      }
      return result;
    })    
  }

  getUsuarios() {
    return firebase.database().ref('/usuario').orderByChild('usua_nm_usuario').once('value').then((usuarios) => {
       return usuarios;
    },
    err => {
       throw 'Não existem usuários cadastrados.';
    });
  }

  getUsuariosFiltro(filtro: string) {
    return firebase.database().ref('/usuario').orderByChild('usua_nm_usuario').startAt(filtro).endAt(filtro + '\uf8ff').once('value').then((usuarios) => {
       return usuarios;
    },
    err => {
       throw 'Não existem usuários cadastrados.';
    });
  }  

  getUsuario(id: string) {
    return firebase.database().ref('/usuario/' + id).once('value').then((usuario) => {
       return usuario;
    },
    err => {
       throw 'Usuários não encontrado';
    });    

  }

  getUsuarioEmail(usuario: UsuarioVO) {
    console.log('Email informado=',usuario.usua_ds_email);
    return firebase.database().ref('usuario').child('usua_ds_email').orderByChild('usua_ds_email').equalTo(usuario.usua_ds_email).once('value')
      .then(usuario => {
        if(usuario.val()!=null) {
          console.log('usuário do email=',usuario.val());
          return usuario;
        }
      });
  }

  removendoUsuario(id: string) {
    console.log('Entrei na rotina de remover o usuário');
    var objRef = firebase.database().ref('/usuario/' + id)
    console.log(objRef);
    return objRef.remove();
  }

  atualizarUsuario(usuario: UsuarioVO, tipo:string) {
      console.log('parametro Usuario=', usuario);
      let result;
      let refReg;
      let modelJSON;
      let update = {};
      let refEmp:string = usuario.empresa.empr_sq_id;
      // Verificando se Indicador de Privado está nulo
      if(!usuario.usua_in_empresa) {
        usuario.usua_in_empresa = false;
      }
      // Verificando se Indicador de Ajuda está nulo
      if(!usuario.usua_in_ajuda) {
        usuario.usua_in_ajuda = false;
      }
      // Verificando se Perfil está selecionado
      if(usuario.usua_sg_perfil==null || usuario.usua_sg_perfil==undefined) {
        usuario.usua_sg_perfil='USU';
      }
      if(tipo=='I') {
        // --- Grava a autenticação do usuário e utiliza seu UID como identificador do usuário no banco.
        
        return this.authService.registerUser(usuario)
          .then((newUser) => {
            refReg = newUser.uid;
            console.log('código do novo usuario', refReg);
            usuario.usua_sq_id = refReg;

            modelJSON = this.criaEstruturaJSON(usuario);
            console.log('model json', modelJSON);
            update[`/usuario/${refReg}`] = modelJSON;
            if(refEmp!=null && refEmp!=undefined && refEmp!='') {
              console.log('Refemp', refEmp)
              console.log('usuario.empresa', usuario.empresa)
              update[`/empresa/${refEmp}/usuario/${refReg}`] = true;
            }
            result = firebase.database().ref().update(update);
            // result = firebase.database().ref('/usuario/').child(refReg).update(modelJSON);
            console.log('Valor do Result = ', result);
            // return result;
          })
          .catch(err => {
            console.log('Erro na inclusão do usuário', err);
            // return result;
          })
      } else {
        refReg = usuario.usua_sq_id;
        modelJSON = this.criaEstruturaJSON(usuario);
        update[`/usuario/${refReg}`] = modelJSON;
        if(refEmp!=null && refEmp!=undefined && refEmp!='') {
          console.log('Refemp', refEmp)
          console.log('usuario.empresa', usuario.empresa)          
          update[`/empresa/${refEmp}/usuario/${refReg}`] = true;
        }
        result = firebase.database().ref().update(update);
        return result;
      }
  }

  atualizarImagem(idUsuario, txImagem) {

      let update = {};
      let modelJSON = 
      firebase.database().ref().child(`usuario/${idUsuario}`).update(
        {
          usua_tx_urlprofile: txImagem
        }
      )
  }

  atualizarSenha(usuario: UsuarioVO) {
    let user = this.authService.getLoggedInUser();
    return new Promise((resolve) => {
      // Atualiza a senha no Authetication
      user.updatePassword(usuario.usua_tx_senha)
        .then(() => {
          // Atualiza a senha no cadastro
          firebase.database().ref().child(`usuario/${usuario.usua_sq_id}`).update(
          {
            usua_tx_senha: usuario.usua_tx_senha
          })
        })
      resolve(true);
    })
  }

  // -- Valida email do usuário e recuperar senha
  validarEmail(usuario: UsuarioVO): Promise<boolean> {
    return new Promise((resolve) => {
      this.getUsuarioEmail(usuario)
        .then(snap => {
          resolve(true)
        })
        .catch(err => {
          resolve(false)
        });
    })
  }  

  uploadImagem(file, idUsuario):Promise<string> {
      let result: string = '';
      let metadata = {
          contentType: 'image/png',
          name: '',
          cacheControl: 'no-cache',
      };  
      return new Promise((resolve) => {
        let progress: number = 0;
        let storageRef = firebase.storage().ref();
        let imageRef = storageRef.child(`images/usuario/${idUsuario}/${file.name}`);
        let uploadTask = storageRef.child(`images/usuario/${idUsuario}/${file.name}`).put(file);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function(snapshot) {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }          
          }, function(error) {
            switch (error.name) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;

              case 'storage/canceled':
                // User canceled the upload
                break;

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;

            }
        }, function() {
          // Upload completed successfully, now we can get the download URL
          let downloadURL = uploadTask.snapshot.downloadURL;
          result =  downloadURL;
          resolve(result);
        });
      })

  }

  allEmpresas():Observable<EmpresaVO[]> {
    return Observable.create((observer) => {
      firebase.database().ref('/plano').once('value', snap => {
        return observer.next(snap);
      })
    });
  }

  search(term:string):Observable<EmpresaVO[]> {
    return Observable.create((observer) => {
      firebase.database().ref('empresa').orderByChild('empr_nm_razaosocial').startAt(term).endAt(term + '\uf8ff').once('value', snap => {          
        observer.next(snap);
    })
    });
  }  

  criaEstruturaJSON(model) {
    let json: string;
    console.log('Empresa selecionada:', model.empresa)
    if(model.empresa!=null && model.empresa.empr_sq_id!=null && model.empresa.empr_sq_id!='') {
      console.log('Vou inserir usuário com empresa');
      json = 
      '{' +
        '"usua_sq_id":"' + model.usua_sq_id + '",' +
        '"usua_nm_usuario":"' + model.usua_nm_usuario + '",' +
        '"usua_tx_login":"' + model.usua_tx_login + '",' +
        '"usua_tx_senha":"' + model.usua_tx_senha + '",' +
        '"usua_ds_sexo":"' + model.usua_ds_sexo + '",' +
        '"usua_dt_inclusao":"' + model.usua_dt_inclusao + '",' +
        '"usua_ds_telefone":"' + model.usua_ds_telefone + '",' +
        '"usua_ds_email":"' + model.usua_ds_email + '",' +
        '"usua_nr_reputacao":"' + model.usua_nr_reputacao + '",' +
        '"usua_tx_urlprofile":"' + model.usua_tx_urlprofile + '",' +
        '"usua_tx_observacao":"' + model.usua_tx_observacao + '",' +
        '"usua_sg_perfil":"' + model.usua_sg_perfil + '",' +
        '"usua_in_empresa":' + model.usua_in_empresa + ',' +
        '"usua_in_ajuda":' + model.usua_in_ajuda + ',' +
        '"empresa": {"' + model.empresa.empr_sq_id + '": ' +
          '{' + 
          '"empr_sq_id":"' + model.empresa.empr_sq_id + '",' +
          '"empr_nm_razaosocial":"' + model.empresa.empr_nm_razaosocial + '"' +
          '}},' +
        '"municipio": {"' + model.municipio.muni_sq_id + '": ' +
          '{' + 
          '"muni_sq_id":"' + model.municipio.muni_sq_id + '",' +
          '"muni_nm_municipio":"' + model.municipio.muni_nm_municipio + '"' +
          '}}' +
      '}'
    } else {
      console.log('Vou inserir usuário sem empresa');
      json = 
      '{' +
        '"usua_sq_id":"' + model.usua_sq_id + '",' +
        '"usua_nm_usuario":"' + model.usua_nm_usuario + '",' +
        '"usua_tx_login":"' + model.usua_tx_login + '",' +
        '"usua_tx_senha":"' + model.usua_tx_senha + '",' +
        '"usua_ds_sexo":"' + model.usua_ds_sexo + '",' +
        '"usua_dt_inclusao":"' + model.usua_dt_inclusao + '",' +
        '"usua_ds_telefone":"' + model.usua_ds_telefone + '",' +
        '"usua_ds_email":"' + model.usua_ds_email + '",' +
        '"usua_nr_reputacao":"' + model.usua_nr_reputacao + '",' +
        '"usua_tx_urlprofile":"' + model.usua_tx_urlprofile + '",' +
        '"usua_tx_observacao":"' + model.usua_tx_observacao + '",' +
        '"usua_sg_perfil":"' + model.usua_sg_perfil + '",' +
        '"usua_in_empresa":' + model.usua_in_empresa + ',' +
        '"usua_in_ajuda":' + model.usua_in_ajuda + ',' +
        '"municipio": {"' + model.municipio.muni_sq_id + '": ' +
          '{' + 
          '"muni_sq_id":"' + model.municipio.muni_sq_id + '",' +
          '"muni_nm_municipio":"' + model.municipio.muni_nm_municipio + '"' +
          '}}' +        
      '}'      
    }
    let convertJSON = JSON.parse(json);
    console.log('Json do Usuario=', convertJSON);
    return convertJSON;
  }

  carregaObjeto(objUsuario):UsuarioVO {
    // - Formatando a data do dia
    let dia = this.dataAtual.getDate().toString();
    if (dia.length == 1) {
        dia = '0' + dia;
    }
    let mes = this.dataAtual.getMonth().toString();
    if (mes.length == 1) { 
        mes = '0' + mes;
    }
    let ano = this.dataAtual.getFullYear()
    this.dataFormatada = ano + '-' + mes + '-' + dia  

    console.log('Dentro da função - Usuario: ', objUsuario.key);
    let objRetorno: UsuarioVO = new UsuarioVO();
    let objValor = objUsuario.val();
    let objEndereco: EnderecoVO;
    // --- Converte objeto interno em objeto Javascript
    let obj = JSON.parse(JSON.stringify(objUsuario.val()));
    let indEmpresa = [];
    let indMunicipio = [];
    let indEndereco = [];
    if (obj.empresa!=null) {
       indEmpresa = Object.keys(obj.empresa);
    }
    if (obj.municipio!=null) {
      indMunicipio = Object.keys(obj.municipio);
    }
    if (obj.endereco!=null) {
      indEndereco = Object.keys(obj.endereco);
    }
    objRetorno.usua_sq_id = objUsuario.key;
    objRetorno.usua_nm_usuario = objValor.usua_nm_usuario;
    objRetorno.usua_tx_login = objValor.usua_tx_login;
    objRetorno.usua_tx_senha = objValor.usua_tx_senha;
    objRetorno.usua_ds_sexo = objValor.usua_ds_sexo;
    objRetorno.usua_dt_inclusao = (objValor.usua_dt_inclusao=='' || objValor.usua_dt_inclusao==null || objValor.usua_dt_inclusao==undefined  ? this.dataFormatada : objValor.usua_dt_inclusao);
    objRetorno.usua_ds_telefone = objValor.usua_ds_telefone;
    objRetorno.usua_ds_email = objValor.usua_ds_email;
    objRetorno.usua_nr_reputacao = objValor.usua_nr_reputacao;
    objRetorno.usua_tx_urlprofile = objValor.usua_tx_urlprofile;
    objRetorno.usua_tx_observacao = objValor.usua_tx_observacao;
    objRetorno.usua_sg_perfil = objValor.usua_sg_perfil;
    objRetorno.usua_in_empresa = (objValor.usua_in_empresa==undefined || objValor.usua_in_empresa==null ? false : objValor.usua_in_empresa);
    objRetorno.usua_in_ajuda = (objValor.usua_in_ajuda==undefined || objValor.usua_in_ajuda==null ? false : objValor.usua_in_ajuda);
    if(indEmpresa.length>0) {
      objRetorno.empresa.empr_sq_id = objValor.empresa[indEmpresa[0]].empr_sq_id;
      objRetorno.empresa.empr_nm_razaosocial = objValor.empresa[indEmpresa[0]].empr_nm_razaosocial;
    }
    if(indMunicipio.length>0) {
      objRetorno.municipio.muni_sq_id = objValor.municipio[indMunicipio[0]].muni_sq_id;
      objRetorno.municipio.muni_nm_municipio = objValor.municipio[indMunicipio[0]].muni_nm_municipio;
    }
    for(var i = 0; i < indEndereco.length; i++) {
      objEndereco = new EnderecoVO();
      objEndereco.ende_sq_id = objValor.endereco[indEndereco[i]].ende_sq_id;
      objEndereco.ende_cd_endereco = objValor.endereco[indEndereco[i]].ende_cd_endereco;
      objRetorno.endereco.push(objEndereco);
    }   
    return objRetorno;
  }
  
}