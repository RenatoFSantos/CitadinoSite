import { EmpresaService } from './../../../provider/service/empresa.service';
import { EmpresaVO } from './../../../model/empresaVO';
import { DescritorVO } from './../../../model/descritorVO';
import { DescritorService } from './../../../provider/service/descritor.service';
import { element } from 'protractor';
import { Subscription } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, NgModule } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';


@Component({
  selector: 'app-empresa-descritor',
  templateUrl: './empresa-descritor.component.html',
  styleUrls: ['./empresa-descritor.component.css']
})

export class EmpresaDescritorComponent implements OnInit {
  inscricao: Subscription;
  id: string = '';
  objDescritores: Observable<DescritorVO[]>;
  listaDescritores: Array<DescritorVO> = [];
  listaCadastroDescritores: Array<DescritorVO> = [];
  termosDaBusca: Subject<string> = new Subject<string>(); 
    
  empresa:EmpresaVO = new EmpresaVO();
  model:DescritorVO = new DescritorVO();
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private empresaService: EmpresaService, 
    private descritorService: DescritorService
    ) { }

  ngOnInit() {
    this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.id = params['id'];
        if(this.id != null) {
          this.empresaService.getEmpresa(this.id).then((empresa) => {
            this.empresa = this.empresaService.carregaObjeto(empresa);
          }),
          err => {
            console.log(err);
          }
        } else {
          this.id='';
          console.log('Estou no else com o id=' + this.id);
        }
      }
    )

    // Listar todos os descritores da empresa
    this.carregaDescritoresEmpresa();

    // Listar todos os descritores publicos
    this.descritorService.getDescritoresPublicos()
        .then(snapshot => {
          snapshot.forEach((childSnapshot) => {
            this.listaCadastroDescritores.push(childSnapshot);
        });
    })

    // Descritores com Observables
    this.objDescritores = this.termosDaBusca
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(term => {        
        return term ? this.descritorService.search(term) : this.descritorService.allDescritors();
      })
      .catch(err => {
        console.log(err);
        return Observable.of<DescritorVO[]>([]);
      });

    this.objDescritores.subscribe((objDescritores) => {
          this.listaCadastroDescritores = [];
          objDescritores.forEach((element: any) => {
            this.listaCadastroDescritores.push(element);
          })          
    })      
    
  }

  carregaDescritoresEmpresa() {
    // Listar todos os descritores da empresa
    this.empresaService.getEmpresaDescritores(this.id)
        .then(snap => {
          snap.forEach((childDescritor) => {
            this.listaDescritores.push(childDescritor);
            console.log('Carregando Descritores da Empresa', childDescritor.val().desc_nm_descritor);
        });
    })    
  }

  selecionaDescritor(chv, valor, tipo) {
    let desc:DescritorVO = new DescritorVO();
    let ind;
    desc.desc_sq_id = chv;
    desc.desc_nm_descritor = valor.desc_nm_descritor;
    desc.desc_nm_pesquisa = valor.desc_nm_pesquisa;
    desc.desc_in_privado = false;

    // --- Inserindo/Excluir descritor
    this.empresaService.atualizarEmpresaDescritor(this.empresa, desc, tipo)
        .then(() => {
            this.listaDescritores = [];
            this.carregaDescritoresEmpresa();
        }).catch((err) => {
            throw err;
        });
    
  }   

  buscarDescritorPorNome(term:string) {
      this.termosDaBusca.next(term);
  }

  carregaObjeto(objEmpresa):EmpresaVO {
    console.log('Dentro da função - Empresa: ', objEmpresa.key);
    let objRetorno: EmpresaVO = new EmpresaVO();
    let objValor = objEmpresa.val();
    // --- Converte objeto interno em objeto Javascript
    let obj = JSON.parse(JSON.stringify(objEmpresa.val()));
    let indCategoria = Object.keys(obj.categoria);
    let indPlano = Object.keys(obj.plano);

    objRetorno.empr_sq_id = objEmpresa.key;
    objRetorno.empr_nm_razaosocial = objValor.empr_nm_razaosocial;
    objRetorno.empr_nm_fantasia = objValor.empr_nm_fantasia;
    objRetorno.empr_nr_credito = objValor.empr_nr_credito;
    objRetorno.empr_tx_logomarca = objValor.empr_tx_logomarca;
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
    objRetorno.categoria.cate_sq_id = objValor.categoria[indCategoria[0]].cate_sq_id;
    objRetorno.categoria.cate_nm_categoria = objValor.categoria[indCategoria[0]].cate_nm_categoria;
    objRetorno.plano.plan_sq_id = objValor.plano[indPlano[0]].plan_sq_id;
    objRetorno.plano.plan_nm_plano = objValor.plano[indPlano[0]].plan_nm_plano;

    return objRetorno;
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }
}
