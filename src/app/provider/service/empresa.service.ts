import { municipios_route } from './../../cadastro/municipio/municipio.routing.module';
import { LoginComponent } from './../../login/login.component';
import { MunicipioVO } from './../../model/municipioVO';
import { ContatoVO } from './../../model/contatoVO';
import { CtdFuncoes } from './../../../ctd-funcoes';
import { DescritorEmpresaVO } from './../../model/descritorEmpresaVO';
import { DescritorService } from './descritor.service';
import { DescritorVO } from './../../model/descritorVO';
import { Observable } from 'rxjs/Observable';
import { EmpresaVO } from './../../model/empresaVO';
import { FirebaseService } from './../database/firebase.service';
import { Injectable, Component } from '@angular/core';
import * as firebase from 'firebase';
import { Promise } from 'firebase';

@Injectable()
export class EmpresaService {

  descritor: DescritorVO;
  municipio: MunicipioVO;
  descritorEmpresa: DescritorEmpresaVO;

  metadata = {
    contentType: 'image/jpeg'
  };  

  constructor(private fbSrv: FirebaseService, private descritorService:DescritorService) {
  }

  getTotalRegistros() {
    let result = 0;
    return firebase.database().ref('/empresa').orderByChild('empr_nm_razaosocial').once('value').then((empresas) => {
      if(empresas.val()) {
        let keys = Object.keys(empresas.val());
        result = keys.length;
      }
      return result;
    })    
  }
  
  getEmpresasNome(nome: string) {
    return firebase.database().ref('/empresa').orderByChild('empr_nm_razaosocial').equalTo(nome).once('value')
      .then(empresas => {
        return empresas;
      })
  }

  getEmpresas() {
    return firebase.database().ref('/empresa').orderByChild('empr_nm_razaosocial').once('value').then((empresas) => {
       return empresas;
    },
    err => {
       throw 'Não existem empresas cadastradas.';
    });
  }

  getEmpresasFiltro(filtro: string) {
    return firebase.database().ref('/empresa').orderByChild('empr_nm_razaosocial').startAt(filtro).endAt(filtro + '\uf8ff').once('value').then((empresas) => {
       return empresas;
    },
    err => {
       throw 'Não existem empresas cadastradas.';
    });
  }  

  getEmpresa(id: string) {
    return firebase.database().ref('/empresa/' + id).once('value').then((empresa) => {
       return empresa;
    },
    err => {
       throw 'Empresas não encontradas.';
    });    
  }

  getEmpresaDescritores(idEmpresa: string) {
    return firebase.database().ref(`/empresa/${idEmpresa}`).child('descritor').once('value')
      .then((descritores) => { 
        return descritores
      },
      err => {
        throw 'Descritores inexistentes!';
      });
  }

  getMunicipioEmpresa(idEmpresa: string) {
    return firebase.database().ref(`/empresa/${idEmpresa}`).child('municipio').once('value')
      .then(municipio => {
        return municipio
      });
  }

  getEmpresaMunicipios(idEmpresa: string) {
    return firebase.database().ref(`/empresa/${idEmpresa}`).child('municipioanuncio').once('value')
      .then((municipios) => { 
        return municipios
      },
      err => {
        throw 'Municipios inexistentes!';
      });
  }

  getEmpresaSmartsite(idEmpresa: string) {
    return firebase.database().ref(`/empresa/${idEmpresa}`).child('smartsite').once('value')
      .then((smartsite) => { 
        return smartsite
      },
      err => {
        throw 'Smartsite inexistente!';
      });
  }

  removendoEmpresa(id: string) {
    var objRef = firebase.database().ref('/empresa/' + id)
    return objRef.remove();
  }

  atualizarEmpresa(empresa: EmpresaVO, empresaOld: EmpresaVO, tipo: string) {
      let objRef;
      let result;
      let refEmp;
      let refDesc;
      let update = {};
      let modelJSON;
      this.descritor = new DescritorVO();
      this.municipio = new MunicipioVO();
      this.descritorEmpresa = new DescritorEmpresaVO();
      let modelJSONEmpresaEmpresa;
      let modelJSONDescritorEmpresa;
      let modelJSONEmpresaDescritor;

      // Verificando se Indicador de Privado está nulo
      if(empresa.empr_in_mensagem===undefined || empresa.empr_in_mensagem===null) {
        empresa.empr_in_mensagem = false;
      }
      if(empresa.empr_in_parceiro===undefined || empresa.empr_in_parceiro===null) {
        empresa.empr_in_parceiro = false;
      }
      // Verificando se subcategoria está indefinida
      if(empresa.empr_tx_subcategoria===undefined) {
        empresa.empr_tx_subcategoria='';
      }

      if(tipo=='I') {
        refEmp = firebase.database().ref().child('empresa').push().key;
        refDesc = firebase.database().ref().child('descritor').push().key;
        empresa.empr_sq_id = refEmp;
        this.descritor.desc_sq_id = refDesc;
        this.descritor.desc_nm_descritor = empresa.empr_nm_razaosocial;
        this.descritor.desc_nm_pesquisa = (CtdFuncoes.removerAcento(empresa.empr_nm_razaosocial)).toLowerCase();
        this.descritor.desc_in_privado=true;
        empresa.descritor.push(this.descritor);

        // Descritor Empresa
        this.descritorEmpresa.desc_sq_id = refDesc;
        this.descritorEmpresa.desc_nm_descritor = empresa.empr_nm_razaosocial;
        this.descritorEmpresa.desc_nm_pesquisa = (CtdFuncoes.removerAcento(empresa.empr_nm_razaosocial)).toLowerCase();
        this.descritorEmpresa.desc_in_privado = true;
        this.descritorEmpresa.empresa.push(empresa);
        // Criando o modelo JSON do descritor-empresa
        modelJSONDescritorEmpresa = this.criaEstruturaJSONDescritorEmpresa(this.descritorEmpresa);
        // Criando o modelo JSON da empresa
        modelJSON = this.criaEstruturaJSON(empresa);
        update[`/_municipioflt/${empresa.municipio.muni_sq_id}/descritorempresa/${refDesc}`] = modelJSONDescritorEmpresa;
      } else {
        refEmp = empresa.empr_sq_id;
        // --- Retirando os valores anteriormente definidos.
        objRef = firebase.database().ref(`/_municipioflt/${empresaOld.municipio.muni_sq_id}/categoriaempresa/${empresaOld.categoria.cate_sq_id}/empresa/${refEmp}`);
        objRef.remove();
        console.log('Retirando valor antigo de categoria', empresaOld.categoria.cate_nm_categoria);
        if(empresaOld.plano.plan_sq_id) {
          objRef = firebase.database().ref(`/plano/${empresaOld.plano.plan_sq_id}/empresa/${refEmp}`)
          objRef.remove();
          console.log('Retirando valor antigo de plano', empresaOld.plano.plan_nm_plano);
        }
        // Retirando o município atrelado a esta empresa
        if(empresaOld.municipio.muni_sq_id) {
          objRef = firebase.database().ref(`/_municipioflt/${empresaOld.municipio.muni_sq_id}/empresa/${refEmp}`);
          objRef.remove();
          console.log('Retirando valor antigo de municipio', empresaOld.municipio.muni_nm_municipio);
          console.log('Retirando valor antigo de empresa', refEmp);
        }
        // Criando o modelo JSON da empresa
        modelJSON = this.criaEstruturaJSON(empresa);
        // Carrega apenas alguns dados da empresa e atualiza no descritor relacionado.
        modelJSONEmpresaDescritor = this.criaEstruturaJSONEmpresaDescritor(empresa);
        // Identificando os descritores que tem a empresa relacionada para alterar seus dados
        let codDescritor;
        // Removendo os descritores associados ao município anterior.
        if(empresaOld.municipio.muni_sq_id!==empresa.municipio.muni_sq_id) {
          objRef = firebase.database().ref(`/_municipioflt/${empresaOld.municipio.muni_sq_id}/descritorempresa`);
          objRef.remove();          
        }

        for(let i=0; i<empresa.descritor.length; i++)
        {
          // Atualiza a relação do Descritor com a Empresa em um outro nó.
          codDescritor = empresa.descritor[i].desc_sq_id;

          // Descritor Empresa
          this.descritorEmpresa.desc_sq_id = empresa.descritor[i].desc_sq_id;;
          this.descritorEmpresa.desc_nm_descritor = empresa.descritor[i].desc_nm_descritor;
          this.descritorEmpresa.desc_nm_pesquisa = (CtdFuncoes.removerAcento(empresa.descritor[i].desc_nm_descritor)).toLowerCase();
          this.descritorEmpresa.desc_in_privado = empresa.descritor[i].desc_in_privado;
          this.descritorEmpresa.empresa.push(empresa);
          // Criando o modelo JSON do descritor-empresa
          modelJSONDescritorEmpresa = this.criaEstruturaJSONDescritorEmpresa(this.descritorEmpresa);

          update[`/_municipioflt/${empresa.municipio.muni_sq_id}/descritorempresa/${codDescritor}`] = modelJSONDescritorEmpresa;
        }
      }
      
      // Atualizando dados da Empresa
      update[`/empresa/${refEmp}`] = modelJSON;

      if(this.descritor.desc_sq_id) {
        let modelJSONDescritor = this.descritorService.criaEstruturaJSON(this.descritor);
        update[`/descritor/${refDesc}`] = modelJSONDescritor;
      }

      // --- Atualizar Empresa dentro da Empresa selecionada
      modelJSONEmpresaEmpresa = this.criaEstruturaJSONEmpresaEmpresa(empresa);
      update[`/_municipioflt/${empresa.municipio.muni_sq_id}/categoriaempresa/${empresa.categoria.cate_sq_id}/empresa/${refEmp}`] = modelJSONEmpresaEmpresa;
      if(empresa.plano.plan_sq_id) {
        update[`/plano/${empresa.plano.plan_sq_id}/empresa/${refEmp}`] = true;
      }
      // --- Atualizando o nó de _municipioflt com a empresa atualizada
      if(empresa.municipio.muni_sq_id) {
        update[`/_municipioflt/${empresa.municipio.muni_sq_id}/empresa/${refEmp}`] = true;
      }

      console.log('Executando a atualização');
      result =  firebase.database().ref().update(update);
      return result;

  }

  atualizarEmpresaDescritor(empresa: EmpresaVO, descritor: DescritorVO, tipo: string) {
      console.log('Valor do Descritor enviado:', descritor);
      let result;
      let update = {};
      let refReg;
      let modelJSON = this.criaEstruturaJSONDescritor(descritor);
      let objDescritorEmpresa;
      let modelJSONDescritorEmpresa;
      this.descritorEmpresa = new DescritorEmpresaVO();
      // --- Verifica se descritor já tem alguma outra relação com empresas e carrega resultado
      return new Promise((resolve) => {
          console.log('Entrei no promise');
          this.descritorEmpresa.desc_sq_id = descritor.desc_sq_id;
          this.descritorEmpresa.desc_nm_descritor = descritor.desc_nm_descritor;
          this.descritorEmpresa.desc_nm_pesquisa = descritor.desc_nm_pesquisa;
          this.descritorEmpresa.desc_in_privado = descritor.desc_in_privado;
          firebase.database().ref(`/descritorempresa/${descritor.desc_sq_id}`).once('value')
          .then((elemento) => {
            if (elemento.val()===null) {
              console.log('Elemento vazio, nova inclusão de descritor.');
            } else {
              console.log('Elemento = ', elemento.val());
              let elementKeys = [];
              elementKeys = Object.keys(elemento.val());
              if(elementKeys.length>0) {
                  console.log('Achei elemento');
                  this.descritorEmpresa = this.carregaObjetoDescritorEmpresa(elemento);
              }
            }
            console.log('Inserindo empresa');
            this.descritorEmpresa.empresa.push(empresa);

            console.log('DescritorEmpresa antes do JSON', this.descritorEmpresa);
            modelJSONDescritorEmpresa = this.criaEstruturaJSONDescritorEmpresa(this.descritorEmpresa);
            console.log('DescritorEmpresa depois do JSON', modelJSONDescritorEmpresa);
      
            if(tipo=='I') {
              console.log('Inserindo registro EmpresaDescritor');
              update[`/empresa/${empresa.empr_sq_id}/descritor/${descritor.desc_sq_id}`] = modelJSON;
              console.log('modelJSON final=', modelJSON);
              // Atualiza em Descritores os dados da empresa
              update[`/descritorempresa/${descritor.desc_sq_id}`] = modelJSONDescritorEmpresa;
              console.log('modelJSONDescritorEmpresa final=', modelJSONDescritorEmpresa);
            } else {
              console.log('Excluindo registro EmpresaDescritor');
              update[`/empresa/${empresa.empr_sq_id}/descritor/${descritor.desc_sq_id}`] = null;
              // Atualiza em Descritores os dados da empresa
              update[`/descritorempresa/${descritor.desc_sq_id}/empresa/${empresa.empr_sq_id}`] = null;  
            }
            
            result =  firebase.database().ref().update(update);

          },
          err => {
            throw 'Descritores inexistentes!';
          });

          resolve(result);
      });
  }  

  atualizarEmpresaMunicipio(empresa: EmpresaVO, municipio: MunicipioVO, tipo: string) {
    console.log('Valor do Descritor enviado:', municipio);
    let result;
    let update = {};
    let refReg;
    let modelJSON = this.criaEstruturaJSONMunicipio(municipio);
    return new Promise((resolve) => {
      if(tipo=='I') {
        update[`/empresa/${empresa.empr_sq_id}/municipioanuncio/${municipio.muni_sq_id}`] = modelJSON;
      } else {
        update[`/empresa/${empresa.empr_sq_id}/municipioanuncio/${municipio.muni_sq_id}`] = null;
      }
      result =  firebase.database().ref().update(update);
      resolve(result);
    });
}  

atualizarImagensEmpresa(idEmpresa, txImagem, dir) {

      let update = {};

      switch(dir) {
        case 'logomarca':
          update[`/empresa/${idEmpresa}/empr_tx_logomarca`] = txImagem;
          // Localizar os descritores relacionados para atualização da logomarca
          firebase.database().ref(`empresa/${idEmpresa}`).child('descritor').once('value') 
            .then(snapshot => {
              snapshot.forEach(element => {
                if(element.val().desc_sq_id!=null && element.val().desc_sq_id!=undefined) {
                  console.log('Gravando a logomarca no descritor=', txImagem);
                  update[`/descritorempresa/${element.val().desc_sq_id}/empresa/${idEmpresa}/empr_tx_logomarca`] = txImagem;
                } else {
                  console.log('Não existe descritor para esta empresa=', idEmpresa);
                }
              });
              console.log('Valor do array do update=', update);
              firebase.database().ref().update(update);
            })
          break;
        case 'cartaovisita':
          firebase.database().ref().child(`/empresa/${idEmpresa}`).update({empr_tx_cartaovisita: txImagem});
          break;
        default:
          break;
      }
  }
  
  uploadImagensEmpresa(file, dir, idEmpresa):Promise<string> {
      let result: string = '';
      let metadata = {
          contentType: 'image/png',
          name: '',
          cacheControl: 'no-cache',
      };  
      return new Promise((resolve) => {
        let progress: number = 0;
        let storageRef = firebase.storage().ref();
        let imageRef = storageRef.child(`images/empresa/${idEmpresa}/${dir}/${file.name}`);
        let uploadTask = storageRef.child(`images/empresa/${idEmpresa}/${dir}/${file.name}`).put(file);

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
      firebase.database().ref('/empresa').once('value', snap => {
        return observer.next(snap);
      })
    });
  }

  search(term:string):Observable<EmpresaVO[]> {
    return Observable.create((observer) => {
      firebase.database().ref('empresa').orderByChild('empr_nm_razaosocial').startAt(term).endAt(term + '\uf8ff').once('value', snap => {          
        observer.next(snap);
    })
    })
  }

  carregaObjeto(objEmpresa):EmpresaVO {
    let objRetorno: EmpresaVO = new EmpresaVO();
    let objDescritor: DescritorVO;
    let objMunicipio: MunicipioVO;
    let objValor = objEmpresa.val();
    // --- Converte objeto interno em objeto Javascript
    let obj = JSON.parse(JSON.stringify(objEmpresa.val()));
    let indEmpresa = Object.keys(obj.categoria);
    let indPlano = Object.keys(obj.plano);
    let indDescritor = Object.keys(obj.descritor);
    let indMunicipio
    if(obj.municipio!=null) {
      indMunicipio = Object.keys(obj.municipio);
    }
    let indMunicipioAnuncio;
    if(obj.municipioanuncio!=null) {
      indMunicipioAnuncio = Object.keys(obj.municipioanuncio);
    }
    let indUsuario;
    if(obj.usuario!=null) {
      indUsuario = Object.keys(obj.usuario);
    }
    let indSmartsite
    if(obj.smartsite!=null) {
      indSmartsite = Object.keys(obj.smartsite);
    }
    objRetorno.empr_sq_id = objEmpresa.key;
    objRetorno.empr_nm_razaosocial = objValor.empr_nm_razaosocial;
    objRetorno.empr_nm_fantasia = objValor.empr_nm_fantasia;
    objRetorno.empr_nr_credito = objValor.empr_nr_credito;
    objRetorno.empr_tx_logomarca = objValor.empr_tx_logomarca;
    objRetorno.empr_tx_cartaovisita = objValor.empr_tx_cartaovisita;
    objRetorno.empr_tx_endereco = objValor.empr_tx_endereco;
    objRetorno.empr_tx_bairro = objValor.empr_tx_bairro;
    objRetorno.empr_tx_cidade = objValor.empr_tx_cidade;
    objRetorno.empr_sg_uf = objValor.empr_sg_uf;
    objRetorno.empr_nr_cep = objValor.empr_nr_cep;
    objRetorno.empr_tx_telefone_1 = objValor.empr_tx_telefone_1;
    objRetorno.empr_tx_telefone_2 = objValor.empr_tx_telefone_2;
    objRetorno.empr_nm_contato = objValor.empr_nm_contato;
    objRetorno.empr_ds_email = objValor.empr_ds_email;
    objRetorno.empr_nr_documento = objValor.empr_nr_documento;
    objRetorno.empr_nr_inscestadual = objValor.empr_nr_inscestadual;
    objRetorno.empr_nr_inscmunicipal = objValor.empr_nr_inscmunicipal;
    objRetorno.empr_tx_googlemaps = objValor.empr_tx_googlemaps;
    objRetorno.empr_ds_site = objValor.empr_ds_site;
    objRetorno.empr_tx_sobre = objValor.empr_tx_sobre;
    objRetorno.empr_tx_observacao = objValor.empr_tx_observacao;
    objRetorno.empr_nr_reputacao = objValor.empr_nr_reputacao;
    objRetorno.empr_in_mensagem = objValor.empr_in_mensagem;
    objRetorno.empr_in_parceiro = objValor.empr_in_parceiro;
    objRetorno.empr_sg_pessoa = objValor.empr_sg_pessoa;
    objRetorno.empr_tx_subcategoria = objValor.empr_tx_subcategoria;
    objRetorno.categoria.cate_sq_id = objValor.categoria[indEmpresa[0]].cate_sq_id;
    objRetorno.categoria.cate_nm_categoria = objValor.categoria[indEmpresa[0]].cate_nm_categoria;
    objRetorno.plano.plan_sq_id = objValor.plano[indPlano[0]].plan_sq_id;
    objRetorno.plano.plan_nm_plano = objValor.plano[indPlano[0]].plan_nm_plano;
    objRetorno.plano.plan_ds_descricao = objValor.plano[indPlano[0]].plan_ds_descricao;
    objRetorno.plano.plan_tp_valor = objValor.plano[indPlano[0]].plan_tp_valor;
    objRetorno.plano.plan_vl_plano = objValor.plano[indPlano[0]].plan_vl_plano;
    objRetorno.plano.plan_in_smartsite = objValor.plano[indPlano[0]].plan_in_smartsite;
    objRetorno.plano.plan_in_tabpreco = objValor.plano[indPlano[0]].plan_in_tabpreco;
    objRetorno.plano.plan_in_ecommerce = objValor.plano[indPlano[0]].plan_in_ecommerce;
    if(indUsuario!=undefined) {
      objRetorno.usuario = indUsuario[0];
      console.log('Codigo do usuario=', indUsuario[0]);
    } else {
      objRetorno.usuario = '';
    }
    if(indSmartsite!=undefined) {
      objRetorno.smartsite = indSmartsite[0];
      console.log('Codigo do Smartsite=', indSmartsite[0]);
    } else {
      objRetorno.smartsite = '';
    }
    for(var i = 0; i < indDescritor.length; i++) {
      objDescritor = new DescritorVO();
      objDescritor.desc_sq_id = objValor.descritor[indDescritor[i]].desc_sq_id;
      objDescritor.desc_nm_descritor = objValor.descritor[indDescritor[i]].desc_nm_descritor;
      objRetorno.descritor.push(objDescritor);
    }
    if(indMunicipio!=undefined) {
      objMunicipio = new MunicipioVO();
      objMunicipio.muni_sq_id = objValor.municipio[indMunicipio[0]].muni_sq_id;
      objMunicipio.muni_nm_municipio = objValor.municipio[indMunicipio[0]].muni_nm_municipio;
      console.log('Objeto Municipio na carga do objeto empresa=', objMunicipio);
      objRetorno.municipio = objMunicipio;
    }
    if(indMunicipioAnuncio!=undefined) {
      for(var i=0; i < indMunicipioAnuncio.length; i++) {
        objMunicipio = new MunicipioVO();
        objMunicipio.muni_sq_id = objValor.municipioanuncio[indMunicipioAnuncio[i]].muni_sq_id;
        objMunicipio.muni_nm_municipio = objValor.municipioanuncio[indMunicipioAnuncio[i]].muni_nm_municipio;
        console.log('Objeto Municipio Anúncio [' + i + '] na carga do objeto empresa=', objMunicipio);
        objRetorno.municipioanuncio.push(objMunicipio);
      }
    }
    return objRetorno;
  }

  carregaObjetoDescritorEmpresa(objDescritorEmpresa):DescritorEmpresaVO {
    console.log('objDescritorEmpresa enviador:', objDescritorEmpresa);
    let objRetorno: DescritorEmpresaVO = new DescritorEmpresaVO();
    let objValor = objDescritorEmpresa.val();
    // --- Converte objeto interno em objeto Javascript
    let obj = JSON.parse(JSON.stringify(objDescritorEmpresa.val()));
    let objEmpresa: EmpresaVO;
    console.log('Antes do Object Key', objDescritorEmpresa.val());
    let indEmpresa = Object.keys(obj.empresa);
    // let indEmpresa = [];
    let indPlano = [];
    console.log('Depois do object key - indEmpresa:', indEmpresa);
    objRetorno.desc_sq_id = objValor.desc_sq_id;
    objRetorno.desc_nm_descritor = objValor.desc_nm_descritor;
    objRetorno.desc_nm_pesquisa = objValor.desc_nm_pesquisa;
    objRetorno.desc_in_privado = objValor.desc_in_privado;
    for(var i = 0; i < indEmpresa.length; i++) {
      objEmpresa = new EmpresaVO();
      objEmpresa.empr_sq_id = objValor.empresa[indEmpresa[i]].empr_sq_id;
      objEmpresa.empr_nm_razaosocial = objValor.empresa[indEmpresa[i]].empr_nm_razaosocial;
      objEmpresa.empr_tx_logomarca = objValor.empresa[indEmpresa[i]].empr_tx_logomarca;
      // objEmpresa.empr_nm_fantasia = objValor.empresa[indEmpresa[i]].empr_nm_fantasia;
      // objEmpresa.empr_nr_credito = objValor.empresa[indEmpresa[i]].empr_nr_credito;
      // objEmpresa.empr_tx_endereco = objValor.empresa[indEmpresa[i]].empr_tx_endereco;
      // objEmpresa.empr_tx_bairro = objValor.empresa[indEmpresa[i]].empr_tx_bairro;
      // objEmpresa.empr_tx_cidade = objValor.empresa[indEmpresa[i]].empr_tx_cidade;
      // objEmpresa.empr_sg_uf = objValor.empresa[indEmpresa[i]].empr_sg_uf;
      // objEmpresa.empr_nr_cep = objValor.empresa[indEmpresa[i]].empr_nr_cep;
      // objEmpresa.empr_tx_telefone_1 = objValor.empresa[indEmpresa[i]].empr_tx_telefone_1;
      // objEmpresa.empr_tx_telefone_2 = objValor.empresa[indEmpresa[i]].empr_tx_telefone_2;
      // objEmpresa.empr_nm_contato = objValor.empresa[indEmpresa[i]].empr_nm_contato;
      // objEmpresa.empr_ds_email = objValor.empresa[indEmpresa[i]].empr_ds_email;
      // objEmpresa.empr_nr_documento = objValor.empresa[indEmpresa[i]].empr_nr_documento;
      // objEmpresa.empr_nr_inscestadual = objValor.empresa[indEmpresa[i]].empr_nr_inscestadual;
      // objEmpresa.empr_nr_inscmunicipal = objValor.empresa[indEmpresa[i]].empr_nr_inscmunicipal;
      // objEmpresa.empr_tx_googlemaps = objValor.empresa[indEmpresa[i]].empr_tx_googlemaps;
      // objEmpresa.empr_ds_site = objValor.empresa[indEmpresa[i]].empr_ds_site;
      // objEmpresa.empr_tx_sobre = objValor.empresa[indEmpresa[i]].empr_tx_sobre;
      // objEmpresa.empr_tx_observacao = objValor.empresa[indEmpresa[i]].empr_tx_observacao;
      // objEmpresa.empr_nr_reputacao = objValor.empresa[indEmpresa[i]].empr_nr_reputacao;
      // objEmpresa.empr_in_mensagem = objValor.empresa[indEmpresa[i]].empr_in_mensagem;
      // objEmpresa.empr_in_parceiro = objValor.empresa[indEmpresa[i]].empr_in_parceiro;
      // objEmpresa.empr_sg_pessoa = objValor.empresa[indEmpresa[i]].empr_sg_pessoa;
      // objEmpresa.empr_tx_subcategoria = objValor.empresa[indEmpresa[i]].empr_tx_subcategoria;
      // indPlano = Object.keys(obj.empresa[indEmpresa[i]].plano);
      // for(var p=0; p<indPlano.length; p++) {
      //   objEmpresa.plano.plan_sq_id = objValor.empresa[indEmpresa[i]].plano[indPlano[p]].plan_sq_id;
      //   objEmpresa.plano.plan_nm_plano = objValor.empresa[indEmpresa[i]].plano[indPlano[p]].plan_nm_plano;
      //   objEmpresa.plano.plan_ds_descricao = objValor.empresa[indEmpresa[i]].plano[indPlano[p]].plan_ds_descricao;
      //   objEmpresa.plano.plan_tp_valor = objValor.empresa[indEmpresa[i]].plano[indPlano[p]].plan_tp_valor;
      //   objEmpresa.plano.plan_vl_plano = objValor.empresa[indEmpresa[i]].plano[indPlano[p]].plan_vl_plano;
      //   objEmpresa.plano.plan_in_smartsite = objValor.empresa[indEmpresa[i]].plano[indPlano[p]].plan_in_smartsite;
      //   objEmpresa.plano.plan_in_tabpreco = objValor.empresa[indEmpresa[i]].plano[indPlano[p]].plan_in_tabpreco;
      //   objEmpresa.plano.plan_in_ecommerce = objValor.empresa[indEmpresa[i]].plano[indPlano[p]].plan_in_ecommerce;
      // }
      // indEmpresa = Object.keys(obj.empresa[indEmpresa[i]].categoria);
      // for(var c=0; c<indEmpresa.length; c++) {
      //   objEmpresa.categoria.cate_sq_id = objValor.empresa[indEmpresa[i]].categoria[indEmpresa[c]].cate_sq_id;
      //   objEmpresa.categoria.cate_nm_categoria = objValor.empresa[indEmpresa[i]].categoria[indEmpresa[c]].cate_nm_categoria;
      // }
      objRetorno.empresa.push(objEmpresa);
    }
    return objRetorno;
  }

  criaEstruturaJSON(model) {
    console.log('total de descritores JSON=', model.descritor.length);
    console.log('Valor do usuario dentro do JSON = ', model.usuario);

    let json: string;
    json = 
    '{' +
      '"empr_sq_id":"' + model.empr_sq_id + '",' +
      '"empr_nm_razaosocial":"' + model.empr_nm_razaosocial + '",' +
      '"empr_sg_alfabetica":"' + model.empr_nm_razaosocial.slice(0,1) + '",' +
      '"empr_nm_fantasia":"' + model.empr_nm_fantasia + '",' +
      '"empr_nr_credito":"' + model.empr_nr_credito + '",' +
      '"empr_tx_logomarca":"' + model.empr_tx_logomarca + '",' +
      '"empr_tx_cartaovisita":"' + model.empr_tx_cartaovisita + '",' +
      '"empr_tx_endereco":"' + model.empr_tx_endereco + '",' +
      '"empr_tx_bairro":"' + model.empr_tx_bairro + '",' +
      '"empr_tx_cidade":"' + model.empr_tx_cidade + '",' +
      '"empr_sg_uf":"' + model.empr_sg_uf + '",' +
      '"empr_nr_cep":"' + model.empr_nr_cep + '",' +
      '"empr_tx_telefone_1":"' + model.empr_tx_telefone_1 + '",' +
      '"empr_tx_telefone_2":"' + model.empr_tx_telefone_2 + '",' +
      '"empr_nm_contato":"' + model.empr_nm_contato + '",' +
      '"empr_ds_email":"' + model.empr_ds_email + '",' +
      '"empr_nr_documento":"' + model.empr_nr_documento + '",' +
      '"empr_nr_inscestadual":"' + model.empr_nr_inscestadual + '",' +
      '"empr_nr_inscmunicipal":"' + model.empr_nr_inscmunicipal + '",' +
      '"empr_tx_googlemaps":"' + model.empr_tx_googlemaps + '",' +
      '"empr_ds_site":"' + model.empr_ds_site + '",' +
      '"empr_tx_sobre":"' + model.empr_tx_sobre + '",' +
      '"empr_tx_observacao":"' + model.empr_tx_observacao + '",' +
      '"empr_nr_reputacao":"' + model.empr_nr_reputacao + '",' +
      '"empr_in_mensagem":' + model.empr_in_mensagem + ',' +
      '"empr_in_parceiro":' + model.empr_in_parceiro + ',' +
      '"empr_sg_pessoa":"' + model.empr_sg_pessoa + '",' +
      '"empr_tx_subcategoria":"' + model.empr_tx_subcategoria + '",' +
      '"categoria": {"' + model.categoria.cate_sq_id + '": ' +
        '{' + 
        '"cate_sq_id":"' + model.categoria.cate_sq_id + '",' +
        '"cate_nm_categoria":"' + model.categoria.cate_nm_categoria + '"' +
        '}},' +
      '"plano": {"' + model.plano.plan_sq_id + '": ' +
        '{' + 
        '"plan_sq_id":"' + model.plano.plan_sq_id + '",' +
        '"plan_nm_plano":"' + model.plano.plan_nm_plano + '",' +
        '"plan_ds_descricao":"' + model.plano.plan_ds_descricao + '",' +
        '"plan_vl_plano":"' + model.plano.plan_vl_plano + '",' +
        '"plan_tp_valor":"' + model.plano.plan_tp_valor + '",' +
        '"plan_in_smartsite":' + model.plano.plan_in_smartsite + ',' +
        '"plan_in_tabpreco":' + model.plano.plan_in_tabpreco + ',' +
        '"plan_in_ecommerce":' + model.plano.plan_in_ecommerce + 
        '}},' +
      '"municipio": {"' + model.municipio.muni_sq_id + '": ' +
        '{' + 
        '"muni_sq_id":"' + model.municipio.muni_sq_id + '",' +
        '"muni_nm_municipio":"' + model.municipio.muni_nm_municipio + '"' +
        '}}'        
        if(model.usuario!='' && model.usuario!=undefined) {
          json = json + ', "usuario": {"' + model.usuario + '": true}';
        }
        if(model.smartsite!='') {
          json = json + ', "smartsite": {"' + model.smartsite + '": true}';
        }
        // --- MUNICÍPIO ANÚNCIO
        if(model.municipioanuncio!='' && model.municipioanuncio!=undefined) {
          for(var i = 0; i < model.municipioanuncio.length; i++) {
            if(i==0) {
              json = json + ', "municipioanuncio": {'
            } else {
              json = json + ', '  
            }
            json = json + 
              '"' + model.municipioanuncio[i].muni_sq_id + '": ' +
                '{' + 
                '"muni_sq_id":"' + model.municipioanuncio[i].muni_sq_id + '",' +
                '"muni_nm_municipio":"' + model.municipioanuncio[i].muni_nm_municipio + '"' +
                '}'
          }
          json = json + '}';
        }
        // --- DESCRITOR
        for(var i = 0; i < model.descritor.length; i++) {
              console.log('Criando descritor ', i);
              if(i==0) {
                json = json + ', "descritor": {'
              } else {
                json = json + ', '  
              }
              json = json + 
                '"' + model.descritor[i].desc_sq_id + '": ' +
                  '{' + 
                  '"desc_sq_id":"' + model.descritor[i].desc_sq_id + '",' +
                  '"desc_nm_descritor":"' + model.descritor[i].desc_nm_descritor + '"' +
                  '}'
        }
      json = json + '}';

    json = json + '}';
    console.log('JSON criado da empresa=', json);

    let convertJSON = JSON.parse(json);
    return convertJSON;
  }

  criaEstruturaJSONDescritor(model) {
    let json: string;
    json = 
    '{' +
        '"desc_sq_id":"' + model.desc_sq_id + '",' +
        '"desc_nm_descritor":"' + model.desc_nm_descritor + '"' + 
    '}'
    let convertJSON = JSON.parse(json);
    return convertJSON;
  }

  criaEstruturaJSONMunicipio(model) {
    let json: string;
    json = 
    '{' +
        '"muni_sq_id":"' + model.muni_sq_id + '",' +
        '"muni_nm_municipio":"' + model.muni_nm_municipio + '"' + 
    '}'
    let convertJSON = JSON.parse(json);
    return convertJSON;
  }

  criaEstruturaJSONDescritorEmpresa(model) {
    let json: string;
    json = 
    '{' +
      '"desc_sq_id":"' + model.desc_sq_id + '",' +
      '"desc_nm_descritor":"' + model.desc_nm_descritor + '",' +
      '"desc_nm_pesquisa":"' + model.desc_nm_pesquisa + '",' +
      '"desc_in_privado":"' + model.desc_in_privado + '",'
      for(var i = 0; i < model.empresa.length; i++) {
            if(i==0) {
              json = json + ' "empresa": {'
            } else {
              json = json + ', '  
            }
            json = json + 
              '"' + model.empresa[i].empr_sq_id + '": {' +
                '"empr_sq_id":"' + model.empresa[i].empr_sq_id + '",' +
                '"empr_nm_razaosocial":"' + model.empresa[i].empr_nm_razaosocial + '",' +
                '"empr_tx_logomarca":"' + model.empresa[i].empr_tx_logomarca + '"' +
              '}'
      }
    json = json + '}}';
    console.log('JSON criado da descritorempresa=', json);

    let convertJSON = JSON.parse(json);
    return convertJSON;
  }

  criaEstruturaJSONEmpresaDescritor(model) {
    let json: string;
    json = 
    '{' +
      '"empr_sq_id":"' + model.empr_sq_id + '",' +
      '"empr_nm_razaosocial":"' + model.empr_nm_razaosocial + '",' +
      '"empr_tx_logomarca":"' + model.empr_tx_logomarca + '"' +
    '}'
    console.log('JSON criado da empresa de um descritor=', json);

    let convertJSON = JSON.parse(json);
    return convertJSON;
  }  

  criaEstruturaJSONEmpresaEmpresa(model) {
    let json: string;
    json = 
    '{' +
      '"empr_sq_id":"' + model.empr_sq_id + '",' +
      '"empr_nm_razaosocial":"' + model.empr_nm_razaosocial + '"' +
    '}';
    let convertJSON = JSON.parse(json);
    return convertJSON;    
  }

  // --- Estrutura Original da função que gravava toda a estrutura de empresa junto com o descritor
  // --- e foi substituida pela função acima criaEstruturaJSONDescritorEmpresa e mantida aqui apenas
  // --- por segurança, caso alguma necessidade seja lembrada e tenhamos que voltar com ela.
  criaEstruturaJSONDescritorEmpresa_Original(model) {
    let json: string;
    json = 
    '{' +
      '"desc_sq_id":"' + model.desc_sq_id + '",' +
      '"desc_nm_descritor":"' + model.desc_nm_descritor + '",' +
      '"desc_in_privado":"' + model.desc_in_privado + '",'
      for(var i = 0; i < model.empresa.length; i++) {
            if(i==0) {
              json = json + ' "empresa": {'
            } else {
              json = json + ', '  
            }
            json = json + 
              '"' + model.empresa[i].empr_sq_id + '": ' +
                '{' + 
                  '"empr_sq_id":"' + model.empresa[i].empr_sq_id + '",' +
                  '"empr_nm_razaosocial":"' + model.empresa[i].empr_nm_razaosocial + '",' +
                  '"empr_sg_alfabetica":"' + model.empresa[i].empr_nm_razaosocial.slice(0,1) + '",' +
                  '"empr_tx_logomarca":"' + model.empresa[i].empr_tx_logomarca + '",' +
                  '"empr_tx_endereco":"' + model.empresa[i].empr_tx_endereco + '",' +
                  '"empr_tx_bairro":"' + model.empresa[i].empr_tx_bairro + '",' +
                  '"empr_tx_cidade":"' + model.empresa[i].empr_tx_cidade + '",' +
                  '"empr_sg_uf":"' + model.empresa[i].empr_sg_uf + '",' +
                  '"empr_nr_cep":"' + model.empresa[i].empr_nr_cep + '",' +
                  '"empr_tx_telefone_1":"' + model.empresa[i].empr_tx_telefone_1 + '",' +
                  '"empr_tx_telefone_2":"' + model.empresa[i].empr_tx_telefone_2 + '",' +
                  '"empr_nm_contato":"' + model.empresa[i].empr_nm_contato + '",' +
                  '"empr_ds_email":"' + model.empresa[i].empr_ds_email + '",' +
                  '"empr_ds_site":"' + model.empresa[i].empr_ds_site + '",' +
                  '"empr_tx_sobre":"' + model.empresa[i].empr_tx_sobre + '",' +
                  '"empr_nr_reputacao":"' + model.empresa[i].empr_nr_reputacao + '",' +
                  '"empr_in_mensagem":' + model.empresa[i].empr_in_mensagem + ',' +
                  '"empr_in_parceiro":' + model.empresa[i].empr_in_parceiro + ',' +
                  '"empr_sg_pessoa":"' + model.empresa[i].empr_sg_pessoa + '",' +
                  '"empr_tx_subcategoria":"' + model.empresa[i].empr_tx_subcategoria + '",' +
                  '"categoria": {"' + model.empresa[i].categoria.cate_sq_id + '": ' +
                    '{' + 
                    '"cate_sq_id":"' + model.empresa[i].categoria.cate_sq_id + '",' +
                    '"cate_nm_categoria":"' + model.empresa[i].categoria.cate_nm_categoria + '"' +
                    '}},' +
                  '"plano": {"' + model.empresa[i].plano.plan_sq_id + '": ' +
                    '{' + 
                      '"plan_sq_id":"' + model.empresa[i].plano.plan_sq_id + '",' +
                      '"plan_nm_plano":"' + model.empresa[i].plano.plan_nm_plano + '",' +
                      '"plan_ds_descricao":"' + model.empresa[i].plano.plan_ds_descricao + '",' +
                      '"plan_vl_plano":"' + model.empresa[i].plano.plan_vl_plano + '",' +
                      '"plan_tp_valor":"' + model.empresa[i].plano.plan_tp_valor + '",' +
                      '"plan_in_smartsite":' + model.empresa[i].plano.plan_in_smartsite + ',' +
                      '"plan_in_tabpreco":' + model.empresa[i].plano.plan_in_tabpreco + ',' +
                      '"plan_in_ecommerce":' + model.empresa[i].plano.plan_in_ecommerce + 
                    '}}' +
                '}'
      }
    json = json + '}}';
    console.log('JSON criado da descritorempresa=', json);

    let convertJSON = JSON.parse(json);
    return convertJSON;
  }
  
}