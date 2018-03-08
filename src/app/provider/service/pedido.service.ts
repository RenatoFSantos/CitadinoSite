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

  constructor(private fbSrv: FirebaseService, private tabelaPrecoService: TabelaPrecoService) {

   }

  carregaPedidosEmpresa(refEmp) {
    let dataPedido = moment().format('YYYY-MM-DD'); // Pega a data do dia
    return firebase.database().ref(`/pedido/${refEmp}`).orderByChild('pedi_dt_datapedido').equalTo(dataPedido).once('value').then((pedidos) => {
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
      console.log('Item antes=', item);
      novoItem.tabelapreco = this.tabelaPrecoService.carregaObjeto(item);
      console.log('Novo Item depois=', novoItem);
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
    let refEmp: string = '';
    refEmp=idEmpresa;
    console.log('Id Empresa=', idEmpresa);
    refReg = firebase.database().ref().child(`pedido/${refEmp}`).push().key;
    console.log('Código do Pedido=', refReg);
    objPedido.pedi_sq_id = refReg;
    objPedido.pedi_in_status = 'P'; // --- PENDENTE
    vetItens.forEach((item) => {
      objItem = new PedidoItemVO();
      console.log('Vou pegar o código do item');
      objItem.peit_sq_id = firebase.database().ref(`pedido/${refEmp}/${refReg}/itens`).push().key;
      console.log('Código do Item do Pedido=', objItem.peit_sq_id);
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
    console.log('Pedido concluido antes do JSON=', objPedido);
    let modelJSON = this.criaEstruturaJSON(objPedido);
    let update = {};
   
    update[`/pedido/${refEmp}/${refReg}`] = modelJSON;
    result =  firebase.database().ref().update(update);
    return result;      
  }

  criaEstruturaJSON(model) {
    console.log('Entrei na conversão do JSON para o Pedido');
    console.log('Data atual=', new Date());    
    let dataPedido = moment().format('YYYY-MM-DD');
    console.log('Data convertida moment.js=', dataPedido);
    let horaPedido = moment(new Date().toLocaleTimeString(), "HH:mm:ss").format("HH:mm:ss");
    console.log('Hora convertida moment.js=', horaPedido);
    // Diferença entre horários
    let hrInicio  = new Date().toLocaleDateString();
    let hrFim = new Date().toLocaleDateString();
    let tempoGasto;
  
    var ms = moment(hrInicio,"DD/MM/YYYY HH:mm:ss").diff(moment(hrFim,"DD/MM/YYYY HH:mm:ss"));
    var d = moment.duration(ms);
    tempoGasto = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");

    console.log('Tempo Gastos moment.js=', tempoGasto);

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
      '"pedi_in_status":"' + model.pedi_in_status + '",' +
      '"pedi_dt_datapedido":"' + dataPedido + '",' +
      '"pedi_dt_horapedido":"' + horaPedido + '",' +
      '"pedi_md_tempogasto":"' + tempoGasto + '",' +
      '"pedi_qn_item":"' + model.pedi_qn_item + '",' +
      '"usuario": {"' + model.usuario.usua_sq_id + '": ' +
        '{' + 
        '"usua_sq_id":"' + model.usuario.usua_sq_id + '",' +
        '"usua_nm_usuario":"' + model.usuario.usua_nm_usuario + '"' +
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
              '"pedi_sq_id":"' + model.itens[i].peit_sq_id + '",' +
              '"peit_vl_quantidade":"' + model.itens[i].peit_vl_quantidade + '",' +
              '"peit_vl_subtotal":"' + (model.itens[i].peit_vl_subtotal.toString()).replace(",",".") + '",' +
              '"peit_vl_desconto":"' + (model.itens[i].peit_vl_desconto.toString()).replace(",",".") + '",' +
              '"peit_vl_total":"' + (model.itens[i].peit_vl_total.toString()).replace(",",".") + '"' +
              ',' +
              '"tabelapreco": {"' + model.itens[i].tabelapreco.tapr_sq_id + '": ' +
              '{' + 
                '"tapr_sq_id":"' + model.itens[i].tabelapreco.tapr_sq_id + '",' +
                '"tapr_ds_item":"' + model.itens[i].tabelapreco.tapr_ds_item + '",' +
                '"tapr_ds_unidade":"' + model.itens[i].tabelapreco.tapr_ds_unidade + '",' +
                '"tapr_tp_item":"' + model.itens[i].tabelapreco.tapr_tp_item + '",' +
                '"tapr_vl_unitario":"' + (model.itens[i].tabelapreco.tapr_vl_unitario.toString()).replace(",",".") + '",' +
                '"tapr_vl_perc_desconto":"' + (model.itens[i].tabelapreco.tapr_vl_perc_desconto.toString()).replace(",",".") + '",' +
                '"tapr_tx_observacao":"' + model.itens[i].tabelapreco.tapr_tx_observacao + '",' +
                '"tapr_tx_imagem":"' + model.itens[i].tabelapreco.tapr_tx_imagem +  '"' +
              '}}}'
      }
    json = json + '}}';
    console.log('Valor do JSON do Pedido=', json);
    let convertJSON = JSON.parse(json);
    return convertJSON;
  }

}
