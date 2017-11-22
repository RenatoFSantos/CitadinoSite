import { CtdFuncoes } from './../../../ctd-funcoes';
import { DescritorService } from './descritor.service';
import { DescritorVO } from './../../model/descritorVO';
import { Observable } from 'rxjs/Observable';
import { CategoriaVO } from './../../model/categoriaVO';
import { FirebaseService } from './../database/firebase.service';
import { Injectable, Component } from '@angular/core';
import { EmpresaService } from './empresa.service';
import * as firebase from 'firebase';

@Injectable()
export class CategoriaService {
  
  listaCategorias: string[] = [];
  categoria: any;

  constructor(private fbSrv: FirebaseService, private empresaService: EmpresaService, private descritorService: DescritorService) {
  }

  getTotalRegistros() {
    let result = 0;
    return firebase.database().ref('/categoria').orderByChild('cate_nm_pesquisa').once('value').then((categorias) => {
      if(categorias.val()) {
        let keys = Object.keys(categorias.val());
        result = keys.length;
      }
      return result;
    })    
  }

  getCategorias() {
    return firebase.database().ref('/categoria').orderByChild('cate_nm_pesquisa').once('value').then((categorias) => {
       return categorias;
    },
    err => {
       throw 'Não existem categorias cadastradas.';
    });
  }

  getCategoriasFiltro(filtro: string) {
    return firebase.database().ref('/categoria').orderByChild('cate_nm_pesquisa').startAt(filtro).endAt(filtro + '\uf8ff').once('value').then((categorias) => {
       return categorias;
    },
    err => {
       throw 'Não existem categorias cadastradas.';
    });
  }

  getCategoria(id: string) {
    return firebase.database().ref('/categoria/' + id).once('value').then((categoria) => {
       return categoria;
    },
    err => {
       throw 'Categoria não encontrada!';
    });    

  }

  removendoCategoria(id: string) {
    var objRef = firebase.database().ref('/categoria/' + id)
    return objRef.remove();
  }

  atualizarCategoria(categoria: CategoriaVO, tipo: string):Promise<boolean> {
      return new Promise((resolve) => {
        let refReg;
        let refDesc;
        let descJSON;
        let update = {};
        let objDescritor: DescritorVO = new DescritorVO();
        let obj: CategoriaVO = new CategoriaVO();
        obj.cate_sq_id = categoria.cate_sq_id;
        obj.cate_nm_categoria = categoria.cate_nm_categoria;
        obj.cate_tx_imagem = categoria.cate_tx_imagem;
        if(tipo=='I') {
          refReg = firebase.database().ref().child('categoria').push().key;
          refDesc = firebase.database().ref().child('descritor').push().key;
          objDescritor.desc_sq_id = refDesc;
          objDescritor.desc_nm_descritor= categoria.cate_nm_categoria;
          objDescritor.desc_nm_pesquisa = (CtdFuncoes.removerAcento(categoria.cate_nm_categoria)).toLowerCase();
          objDescritor.desc_in_privado=false;
          console.log('objDescritor=', objDescritor)
          descJSON = this.descritorService.criaEstruturaJSON(objDescritor);
          console.log('Descritor JSON', descJSON);
          update[`/descritor/${refDesc}`] = descJSON;
          categoria.cate_sq_id = refReg;
          update[`/categoria/${refReg}/descritor/${refDesc}`] = true;
        } else {
          refReg = categoria.cate_sq_id;
        }
        // let modelJSON = this.criaEstruturaJSON(this.objCategoria);

        update[`/categoria/${refReg}/cate_sq_id`] = categoria.cate_sq_id;
        update[`/categoria/${refReg}/cate_nm_categoria`] = categoria.cate_nm_categoria;
        update[`/categoria/${refReg}/cate_nm_pesquisa`] = (CtdFuncoes.removerAcento(categoria.cate_nm_categoria)).toLowerCase();
        update[`/categoria/${refReg}/cate_in_tipo`] = categoria.cate_in_tipo;
        update[`/categoria/${refReg}/cate_tx_imagem`] = categoria.cate_tx_imagem;
        // Verificando os objetos que devem ser atualizados
        // EMPRESAS
        firebase.database().ref(`/categoria/${refReg}/empresa`).once('value').then((empresas) => {
          if(empresas.val()) {
            let keys = Object.keys(empresas.val());
            keys.forEach((key) => {
              update[`/empresa/${key}/categoria/${refReg}/cate_nm_categoria`] = obj.cate_nm_categoria;
            })
          }
          // DESCRITORES
          firebase.database().ref(`/categoria/${refReg}/descritor`).once('value').then((descritores) => {
            if(descritores.val()) {
              let keys = Object.keys(descritores.val());
              keys.forEach((key) => {
                objDescritor.desc_sq_id = key;
                objDescritor.desc_nm_descritor= obj.cate_nm_categoria;
                objDescritor.desc_nm_pesquisa = CtdFuncoes.removerAcento(obj.cate_nm_categoria);
                objDescritor.desc_in_privado=false;
                console.log('Categoria alterada=', objDescritor);  
                descJSON = this.descritorService.criaEstruturaJSON(objDescritor);
                console.log('JSON Descritor=', objDescritor);
                update[`/descritor/${key}`] = descJSON;
              })
            }
            firebase.database().ref().update(update);
          },
          err => {
            throw 'Não existem descritores cadastrados.';
          });

        },
        err => {
          throw 'Não existem categorias cadastradas.';
        });
        resolve(true);
      });
  }

  atualizarImagem(id, txImagem) {
      let update = {};
      let modelJSON = 
      firebase.database().ref().child(`categoria/${id}`).update(
        {
          cate_tx_imagem: txImagem
        }
      )
  }

  uploadImagem(file, id):Promise<string> {
      let result: string = '';
      let metadata = {
          contentType: 'image/png',
          name: '',
          cacheControl: 'no-cache',
      };  
      return new Promise((resolve) => {
        let progress: number = 0;
        let storageRef = firebase.storage().ref();
        console.log('Carregando imagem para a categoria=', id);
        let imageRef = storageRef.child(`images/categoria/${id}/${file.name}`);
        let uploadTask = storageRef.child(`images/categoria/${id}/${file.name}`).put(file);

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
  
  buscar(term: string) {
     return firebase.database().ref('categoria').orderByChild('cate_nm_categoria').startAt(term).endAt(term + '\uf8ff').once('value');
  }

  buscarCategoria(term: string) {
     return firebase.database().ref().child('categoria').orderByChild('cate_nm_categoria').startAt(term).endAt(term + '\uf8ff').once('value', snap => snap.val());
  }

  allCategorias():Observable<CategoriaVO[]> {
    return Observable.create((observer) => {
      firebase.database().ref('/categoria').once('value', snap => {
        return observer.next(snap);
      })
    });
  }

  search(term:string):Observable<CategoriaVO[]> {
    return Observable.create((observer) => {
      firebase.database().ref('categoria').orderByChild('cate_nm_categoria').startAt(term).endAt(term + '\uf8ff').once('value', snap => {          
        observer.next(snap);
    })
    })
  }

  criaEstruturaJSON(model) {
    let json: string;
    json = 
    '{' +
      '"cate_sq_id":"' + model.cate_sq_id + '",' +
      '"cate_nm_categoria":"' + model.cate_nm_categoria + '",' +
      '"cate_nm_pesquisa":"' + model.cate_nm_pesquisa.toLowerCase() + '",' +
      '"cate_in_tipo":"' + model.cate_in_tipo + '",' +
      '"cate_tx_imagem":"' + model.cate_tx_imagem + '"' +
    '}'
    let convertJSON = JSON.parse(json);
    return convertJSON;
  }
  

}