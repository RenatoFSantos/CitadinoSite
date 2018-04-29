import { MensagemVO } from './../../model/mensagemVO';
import { CtdFuncoes } from './../../../ctd-funcoes';
import { EmpresaVO } from 'app/model/empresaVO';
import { FirebaseService } from './../database/firebase.service';
import { UsuarioVO } from './../../model/usuarioVO';
import { TabelaPrecoService } from './tabela-preco.service';
import { PedidoItemVO } from './../../model/pedidoItemVO';
import { TabelaPrecoVO } from './../../model/tabelaPrecoVO';
import { Injectable } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';
import { PedidoVO } from 'app/model/pedidoVO';
import { EnderecoVO } from 'app/model/enderecoVO';
import * as firebase from 'firebase';
import * as moment from 'moment';


@Injectable()
export class PedidoService {

  constructor(private fbSrv: FirebaseService, private tabelaPrecoService: TabelaPrecoService, private ctdFuncoes: CtdFuncoes) {

   }

  carregaPedidosEmpresa(refEmp, dtFiltro) {
    let dataPedido = moment().format('YYYY-MM-DD'); // Pega a data do dia
    dtFiltro= dtFiltro + ' 00:00:00';
    return firebase.database().ref(`/pedido/${refEmp}`).orderByChild('pedi_dt_datapedido').startAt(dtFiltro).once('value').then((pedidos) => {
       return pedidos;
    },
    err => {
       throw 'Não existem itens cadastradas.';
    });
  }

  carregaPedido(idEmpresa, idPedido) {
    return firebase.database().ref(`/pedido/${idEmpresa}/${idPedido}`).once('value').then((pedido) => {
      return pedido;
   },
   err => {
      throw 'Não consigo carregar pedido.';
   });    
  }

  carregaPedidosEmpresaNome(refEmp, refNome) {
    refNome = refNome;
    return firebase.database().ref(`/pedido/${refEmp}`).orderByChild('pedi_nm_pedido').startAt(refNome).endAt(refNome + '\uf8ff').once('value').then((pedidos) => {
      // return firebase.database().ref(`/pedido/${refEmp}`).orderByChild('usuario/usua_nm_usuario').once('value').then((pedidos) => {  
       return pedidos;
    },
    err => {
       throw 'Não existem itens cadastradas.';
    });
  } 

  atualizaItemPedido(item: TabelaPrecoVO, listaItens: Array<PedidoItemVO>, modo: string):Array<PedidoItemVO> {
    let atualizou = false;
    let novoItem: PedidoItemVO;
    let quantidade: number = 1;
    let desconto: number = 0;
    let unitario: number = 0;
    let total: number = 0;
    let chaves: any = [];
    let indice: any = 0;
    if(modo=='excluir') {
      chaves = listaItens.map(function(e) {
          return e.tabelapreco.tapr_sq_id
      })
      atualizou = true;
      indice = chaves.indexOf(item.tapr_sq_id);
      if(indice > -1) {
        listaItens.splice(indice, 1);
      }
    } else {
      listaItens.forEach((itemPedido) => {
        quantidade=itemPedido.peit_vl_quantidade.valueOf();
        desconto=item.tapr_vl_perc_desconto.valueOf();
        unitario=item.tapr_vl_unitario.valueOf()
        if(item.tapr_sq_id==itemPedido.tabelapreco.tapr_sq_id) {
          atualizou = true;
          switch(modo) {
            case 'mais':
              quantidade++;
              break;
            case 'menos':
              if(quantidade>1) {
                quantidade--;
              }
              break;
            default:
          }
          itemPedido.peit_vl_quantidade = quantidade;
          if(desconto>0) {
            itemPedido.peit_vl_desconto = (unitario*quantidade)*(desconto/100);
            itemPedido.peit_vl_subtotal = (unitario*quantidade)-itemPedido.peit_vl_desconto;
          } else {
            itemPedido.peit_vl_desconto = 0;
            itemPedido.peit_vl_subtotal = (unitario*quantidade);
          }
          itemPedido.peit_vl_total = itemPedido.peit_vl_subtotal;
        }
        
      })
    }

    if(!atualizou) {
      desconto=item.tapr_vl_perc_desconto.valueOf();
      unitario=item.tapr_vl_unitario.valueOf()
      novoItem = new PedidoItemVO();
      quantidade=1; // estabelecendo a quantidade fixa de 1
      novoItem.peit_vl_quantidade=quantidade;
      if(desconto>0) {
        novoItem.peit_vl_desconto = (unitario*quantidade)*(desconto/100)
        novoItem.peit_vl_subtotal = (unitario*quantidade)-novoItem.peit_vl_desconto;
      } else {
        novoItem.peit_vl_desconto = 0;
        novoItem.peit_vl_subtotal = unitario*quantidade;
      }
      novoItem.peit_vl_total = novoItem.peit_vl_subtotal;
      novoItem.tabelapreco = this.tabelaPrecoService.carregaObjeto(item);
      novoItem.tabelapreco.tapr_sq_id=item.tapr_sq_id;
      listaItens.push(novoItem);
    }

    return listaItens;
  }

  verificaListaCategoria(listaCategorias, categoria):boolean {
    let existe:boolean = false;
    let ind: any = -1;
    let chav = listaCategorias.map(function(e) {
        return e.caps_sq_id
    })
    ind = chav.indexOf(categoria.caps_sq_id);
    if(ind > -1) {
      existe = true;
    }
    return existe;    
  }

  atualizaPedido(listaItens: Array<PedidoItemVO>):PedidoVO {
    let pedido: PedidoVO = new PedidoVO();
    listaItens.forEach((itemPedido) => {
      pedido.pedi_qn_item=pedido.pedi_qn_item+itemPedido.peit_vl_quantidade;
      pedido.pedi_vl_desconto=pedido.pedi_vl_desconto+itemPedido.peit_vl_desconto;
      pedido.pedi_vl_total=pedido.pedi_vl_total+itemPedido.peit_vl_total;
    })
    return pedido;
  }
  
  salvarPedido(objPedido: PedidoVO, vetItens: Array<PedidoItemVO>, objUsuario: UsuarioVO, objEndereco: EnderecoVO, formaPagto: string, idEmpresa: string) {
    let result:any;
    let refReg: string = '';
    let objItem: PedidoItemVO;
    let objMensagem: MensagemVO;
    let refEmp: string = '';
    let refMens: string = '';
    refEmp=idEmpresa;
    refReg = firebase.database().ref().child(`pedido/${refEmp}`).push().key;
    objPedido.pedi_sq_id = refReg;
    objPedido.pedi_in_status = 'P'; // --- PENDENTE
    objPedido.pedi_nm_pedido = objUsuario.usua_nm_usuario;
    objPedido.empr_sq_id = idEmpresa; // --- Guardar o código da empresa
    // --- Criar primeira mensagem para o cliente
    refMens = firebase.database().ref(`pedido/${refEmp}/${refReg}/mensagem`).push().key;
    objMensagem = new MensagemVO();
    objMensagem.mens_sq_id = refMens;
    // objMensagem.mens_dt_datamensagem = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
    objMensagem.mens_in_status = 'P';
    objMensagem.mens_ds_mensagem = 'Aguardando atendimento do pedido.';
    objPedido.mensagem.push(objMensagem);
    vetItens.forEach((item) => {
      objItem = new PedidoItemVO();
      objItem.peit_sq_id = firebase.database().ref(`pedido/${refEmp}/${refReg}/itens`).push().key;
      objItem.peit_vl_desconto = item.peit_vl_desconto;
      objItem.peit_vl_quantidade = item.peit_vl_quantidade;
      objItem.peit_vl_subtotal = item.peit_vl_subtotal;
      objItem.peit_vl_total = item.peit_vl_total;
      objItem.tabelapreco = item.tabelapreco;
      objPedido.itens.push(objItem);
    })
    objPedido.usuario = objUsuario;
    objPedido.endereco = objEndereco;
    objPedido.pedi_in_formapagto = formaPagto;
    let modelJSON = this.criaEstruturaJSON(objPedido);
    let update = {};
   
    update[`/pedido/${refEmp}/${refReg}`] = modelJSON;

    // --- Atualizando pedido no nó de usuário
    let modelJSONUsuarioPedido = this.criaEstruturaJSONUsuarioPedido(objPedido);
    update[`/usuario/${objUsuario.usua_sq_id}/pedido/${objPedido.pedi_sq_id}`] = modelJSONUsuarioPedido;

    result =  firebase.database().ref().update(update);
    return result;      
  }

  novaMensagem(idEmpresa: string, objPedido: PedidoVO, mensagem: string) {
    let refMens = firebase.database().ref().child(`pedido/${idEmpresa}/${objPedido.pedi_sq_id}/mensagem`).push().key;
    let objMensagem: MensagemVO = new MensagemVO();
    objMensagem.mens_sq_id = refMens;
    objMensagem.mens_dt_datamensagem = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
    objMensagem.mens_in_status = objPedido.pedi_in_status;
    objMensagem.mens_ds_mensagem = mensagem;
    objPedido.mensagem.push(objMensagem);
    return objPedido;    
  }

  atualizarPedido(objPedido: PedidoVO, idEmpresa: string) {
    let result:any;
    let refReg: string = '';
    let objItem: PedidoItemVO;
    let refEmp: string = '';
    let refPed: string = '';
    refEmp=idEmpresa;
    refPed=objPedido.pedi_sq_id;

    let modelJSON = this.criaEstruturaJSON(objPedido);
    let update = {};
   
    update[`/pedido/${refEmp}/${refPed}`] = modelJSON;
    result =  firebase.database().ref().update(update);
    return result;      
  }

  criaEstruturaJSON(model) {
    let dataPedido: any;
    let horaPedido: any;
    let hrInicio: any;
    let hrFim: any;
    let tempoGasto: any;   
    if(model.pedi_md_tempogasto!='') {
      dataPedido = moment(model.pedi_dt_datapedido).format('YYYY-MM-DD HH:mm:ss');
      horaPedido = moment(model.pedi_dt_horapedido).format('YYYY-MM-DD HH:mm:ss');
      hrInicio = new Date(moment(model.pedi_dt_horapedido).format('YYYY-MM-DD HH:mm:ss'));
    } else {
      dataPedido = moment().format('YYYY-MM-DD HH:mm:ss');
      horaPedido = moment().format('YYYY-MM-DD HH:mm:ss');
      hrInicio  = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
    }
    hrFim = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
    // Diferença entre horários somente se status não for CONCLUÍDO, CANCELADO ou RETORNO

    if(model.pedi_in_status!='C' && model.pedi_in_status!='X' && model.pedi_in_status!='R') {
      var diffMs = (hrFim - hrInicio);
      var diffHrs = Math.floor((diffMs % 86400000) / 3600000);
      var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
      tempoGasto = this.ctdFuncoes.leftPad(diffHrs, 2, 0) + ':' + this.ctdFuncoes.leftPad(diffMins, 2, 0);
    } else {
      tempoGasto = model.pedi_md_tempogasto;
    }
    

    let json: string;
    json = 
    '{' +
      '"pedi_sq_id":"' + model.pedi_sq_id + '",'
      if(model.pedi_vl_total==0) {
        json = json + '"pedi_vl_total":"0",'
      } else {
        json = json + '"pedi_vl_total":"' + (model.pedi_vl_total.toString()).replace(",",".") + '",'
      }
      if(model.pedi_vl_desconto==0) {
        json = json + '"pedi_vl_desconto":"0",'
      } else {
        json = json + '"pedi_vl_desconto":"' + (model.pedi_vl_desconto.toString()).replace(",",".") + '",'
      }
      if(model.pedi_vl_entrega==0) {
        json = json + '"pedi_vl_entrega":"0",'
      } else {
        json = json + '"pedi_vl_entrega":"' + (model.pedi_vl_entrega.toString()).replace(",",".") + '",'
      }
      json = json + '"pedi_in_formapagto":"' + model.pedi_in_formapagto + '",' +
      '"pedi_nm_pedido":"' + model.usuario.usua_nm_usuario.toLowerCase() + '",' +
      '"pedi_in_status":"' + model.pedi_in_status + '",' +
      '"pedi_dt_datapedido":"' + dataPedido + '",' +
      '"pedi_dt_horapedido":"' + horaPedido + '",' +
      '"pedi_md_tempogasto":"' + tempoGasto + '",' +
      '"pedi_qn_item":"' + model.pedi_qn_item + '",' +
      '"empr_sq_id":"' + model.empr_sq_id + '",' +
      '"usuario": {"' + model.usuario.usua_sq_id + '": ' +
        '{' + 
        '"usua_sq_id":"' + model.usuario.usua_sq_id + '",' +
        '"usua_nm_usuario":"' + model.usuario.usua_nm_usuario + '",' +
        '"usua_ds_telefone":"' + model.usuario.usua_ds_telefone + '"' +
        '}},' +
      '"endereco": {"' + model.endereco.ende_sq_id + '": ' +
      '{' + 
      '"ende_sq_id":"' + model.endereco.ende_sq_id + '",' +
      '"ende_cd_endereco":"' + model.endereco.ende_cd_endereco + '",' +
      '"ende_tx_endereco":"' + model.endereco.ende_tx_endereco + '",' +
      '"ende_tx_bairro":"' + model.endereco.ende_tx_bairro + '",' +
      '"ende_tx_cidade":"' + model.endereco.ende_tx_cidade + '",' +
      '"ende_sg_uf":"' + model.endereco.ende_sg_uf + '",' +
      '"ende_nr_cep":"' + model.endereco.ende_nr_cep + '"' + 
      '}},'
      for(var i = 0; i < model.itens.length; i++) {
        if(i==0) {
          json = json + '"itens": {'
        } else {
          json = json + ', '  
        }
        json = json + 
          '"' + model.itens[i].peit_sq_id + '": ' +
            '{' + 
              '"peit_sq_id":"' + model.itens[i].peit_sq_id + '",' +
              '"peit_vl_quantidade":"' + model.itens[i].peit_vl_quantidade + '",' +
              '"peit_vl_subtotal":"' + (model.itens[i].peit_vl_subtotal.toString()).replace(",",".") + '",' +
              '"peit_vl_desconto":"' + (model.itens[i].peit_vl_desconto.toString()).replace(",",".") + '",' +
              '"peit_vl_total":"' + (model.itens[i].peit_vl_total.toString()).replace(",",".") + '"' +
              ',' +
              '"tabelapreco": {"' + model.itens[i].tabelapreco.tapr_sq_id + '": ' +
              '{' + 
                '"tapr_sq_id":"' + model.itens[i].tabelapreco.tapr_sq_id + '",' +
                '"tapr_nm_item":"' + model.itens[i].tabelapreco.tapr_nm_item + '",' +
                '"tapr_ds_item":"' + model.itens[i].tabelapreco.tapr_ds_item + '",' +
                '"tapr_ds_unidade":"' + model.itens[i].tabelapreco.tapr_ds_unidade + '",' +
                '"tapr_tp_item":"' + model.itens[i].tabelapreco.tapr_tp_item + '",' +
                '"tapr_vl_unitario":"' + (model.itens[i].tabelapreco.tapr_vl_unitario.toString()).replace(",",".") + '",' +
                '"tapr_vl_perc_desconto":"' + (model.itens[i].tabelapreco.tapr_vl_perc_desconto.toString()).replace(",",".") + '",' +
                '"tapr_tx_observacao":"' + model.itens[i].tabelapreco.tapr_tx_observacao + '",' +
                '"tapr_tx_imagem":"' + model.itens[i].tabelapreco.tapr_tx_imagem +  '"' +
              '}}}'
      }
      json = json + '},';
      for(var i = 0; i < model.mensagem.length; i++) {
        if(i==0) {
          json = json + '"mensagem": {'
        } else {
          json = json + ', '  
        }
        json = json + 
          '"' + model.mensagem[i].mens_sq_id + '": ' +
            '{' + 
              '"mens_sq_id":"' + model.mensagem[i].mens_sq_id + '",' +
              '"mens_dt_datamensagem":"' + moment().format('YYYY-MM-DD HH:mm:ss') + '",' +
              '"mens_ds_mensagem":"' + model.mensagem[i].mens_ds_mensagem + '",' +
              '"mens_in_status":"' + model.mensagem[i].mens_in_status + '"' +
            '}'
      }
    json = json + '}}';
    let convertJSON = JSON.parse(json);
    return convertJSON;
  }

  criaEstruturaJSONUsuarioPedido(model) {
    let json: string;
    json = 
    '{' +
      '"empr_sq_id":"' + model.empr_sq_id + '",' +
      '"pedi_sq_id":"' + model.pedi_sq_id + '"' +
    '}';
    let convertJSON = JSON.parse(json);
    return convertJSON;    
  }  

  carregaObjeto(valor):PedidoVO {
    let objRetorno: PedidoVO = new PedidoVO();
    let objValor = valor.val();
    let objEndereco: EnderecoVO;
    let objPedidoItem: PedidoItemVO;
    let objUsuario: UsuarioVO;
    let objTabelaPreco: TabelaPrecoVO;
    let objMensagem: MensagemVO;

    // --- Converte objeto interno em objeto Javascript
    let obj = JSON.parse(JSON.stringify(valor.val()));
    let indEndereco = Object.keys(obj.endereco);
    let indItem = Object.keys(obj.itens);
    let indUsuario = Object.keys(obj.usuario);
    let indMensagem = Object.keys(obj.mensagem);

    objRetorno.pedi_sq_id = valor.key;
    objRetorno.pedi_nm_pedido = objValor.pedi_nm_pedido;
    objRetorno.pedi_vl_total = parseFloat(objValor.pedi_vl_total);
    objRetorno.pedi_vl_desconto = parseFloat(objValor.pedi_vl_desconto);
    objRetorno.pedi_vl_entrega = parseFloat(objValor.pedi_vl_entrega);
    objRetorno.pedi_in_formapagto = objValor.pedi_in_formapagto;
    objRetorno.pedi_in_status = objValor.pedi_in_status;
    objRetorno.pedi_tx_observacao = objValor.pedi_tx_observacao;
    objRetorno.pedi_dt_datapedido = objValor.pedi_dt_datapedido;
    objRetorno.pedi_dt_horapedido = new Date(objValor.pedi_dt_horapedido);
    objRetorno.pedi_md_tempogasto = objValor.pedi_md_tempogasto;
    objRetorno.pedi_qn_item = objValor.pedi_qn_item;
    objRetorno.empr_sq_id = objValor.empr_sq_id;
    objRetorno.usuario.usua_sq_id = objValor.usuario[indUsuario[0]].usua_sq_id;
    objRetorno.usuario.usua_nm_usuario = objValor.usuario[indUsuario[0]].usua_nm_usuario;
    objRetorno.endereco.ende_cd_endereco = objValor.endereco[indEndereco[0]].ende_cd_endereco;
    objRetorno.endereco.ende_nr_cep = objValor.endereco[indEndereco[0]].ende_nr_cep;
    objRetorno.endereco.ende_sg_uf = objValor.endereco[indEndereco[0]].ende_sg_uf;
    objRetorno.endereco.ende_sq_id = objValor.endereco[indEndereco[0]].ende_sq_id;
    objRetorno.endereco.ende_tx_bairro = objValor.endereco[indEndereco[0]].ende_tx_bairro;
    objRetorno.endereco.ende_tx_cidade = objValor.endereco[indEndereco[0]].ende_tx_cidade;
    objRetorno.endereco.ende_tx_endereco = objValor.endereco[indEndereco[0]].ende_tx_endereco;

    objRetorno.itens = [];
    let indTabelaPreco;
    for(var i = 0; i < indItem.length; i++) {
      objPedidoItem = new PedidoItemVO();
      objPedidoItem.peit_sq_id = objValor.itens[indItem[i]].peit_sq_id;
      objPedidoItem.peit_vl_quantidade = parseFloat(objValor.itens[indItem[i]].peit_vl_quantidade);
      objPedidoItem.peit_vl_subtotal = parseFloat(objValor.itens[indItem[i]].peit_vl_subtotal);
      objPedidoItem.peit_vl_desconto = parseFloat(objValor.itens[indItem[i]].peit_vl_desconto);
      objPedidoItem.peit_vl_total = parseFloat(objValor.itens[indItem[i]].peit_vl_total);
      // Carregando tabela de preço do produto
      indTabelaPreco = Object.keys(objValor.itens[indItem[i]].tabelapreco);
      objPedidoItem.tabelapreco.tapr_nm_item = objValor.itens[indItem[i]].tabelapreco[indTabelaPreco[0]].tapr_nm_item;
      objPedidoItem.tabelapreco.tapr_ds_item = objValor.itens[indItem[i]].tabelapreco[indTabelaPreco[0]].tapr_ds_item;
      objPedidoItem.tabelapreco.tapr_ds_unidade = objValor.itens[indItem[i]].tabelapreco[indTabelaPreco[0]].tapr_ds_unidade;
      objPedidoItem.tabelapreco.tapr_sq_id = objValor.itens[indItem[i]].tabelapreco[indTabelaPreco[0]].tapr_sq_id;
      objPedidoItem.tabelapreco.tapr_tp_item = objValor.itens[indItem[i]].tabelapreco[indTabelaPreco[0]].tapr_tp_item;
      objPedidoItem.tabelapreco.tapr_tx_observacao = objValor.itens[indItem[i]].tabelapreco[indTabelaPreco[0]].tapr_tx_observacao;
      objPedidoItem.tabelapreco.tapr_vl_perc_desconto = objValor.itens[indItem[i]].tabelapreco[indTabelaPreco[0]].tapr_vl_perc_desconto;
      objPedidoItem.tabelapreco.tapr_vl_unitario = parseFloat(objValor.itens[indItem[i]].tabelapreco[indTabelaPreco[0]].tapr_vl_unitario);
      objRetorno.itens.push(objPedidoItem);
    }

    objRetorno.mensagem = [];
    for(var i = 0; i < indMensagem.length; i++) {
      objMensagem = new MensagemVO();
      objMensagem.mens_sq_id = objValor.mensagem[indMensagem[i]].mens_sq_id;
      objMensagem.mens_dt_datamensagem = objValor.mensagem[indMensagem[i]].mens_dt_datamensagem;
      objMensagem.mens_ds_mensagem = objValor.mensagem[indMensagem[i]].mens_ds_mensagem;
      objMensagem.mens_in_status = objValor.mensagem[indMensagem[i]].mens_in_status;
      objRetorno.mensagem.push(objMensagem);
    }

    return objRetorno;
  }


}
