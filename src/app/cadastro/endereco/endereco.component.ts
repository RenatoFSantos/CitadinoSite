import { EnderecoVO } from './../../model/enderecoVO';
import { UsuarioVO } from './../../model/usuarioVO';
import { UsuarioService } from './../../provider/service/usuario.service';
import { EnderecoService } from './../../provider/service/endereco.service';
import { Subscription, Observable } from 'rxjs/Rx';
import { Component, OnInit, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';


@Component({
  selector: 'app-endereco',
  templateUrl: './endereco.component.html',
  styleUrls: ['./endereco.component.css']
})
export class EnderecoComponent implements OnInit {

  stsMensagem: string = 'alert alert-dismissible';
  txtMensagem: string = '';
  flagHidden: boolean = true;
  inscricao: Subscription;
  inscricaoQuery: Subscription;
  idUsua: string = '';
  idEnd: string = '';
  modo: string = '';

  usuario: UsuarioVO = new UsuarioVO();
  model: EnderecoVO = new EnderecoVO();

  constructor(private route: ActivatedRoute, private router: Router, private enderecoService: EnderecoService, private usuarioService: UsuarioService) { }

  ngOnInit() {
    console.log('Carregando ngOnInit de Endereços');
    this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.idUsua = params['idusua'];
        this.idEnd = params['idend'];
        console.log('Valor do idUsua: ' + this.idUsua);
        // Carrega Usuário
        if(this.idUsua != null) {
          this.usuarioService.getUsuario(this.idUsua).then((usuario) => {
            this.usuario = this.usuarioService.carregaObjeto(usuario);
            // Atualiza o usuário carregado com o usuário
            this.model.usuario.usua_sq_id = this.usuario.usua_sq_id;
            this.model.usuario.usua_nm_usuario = this.usuario.usua_nm_usuario;              
            console.log('Usuário carregado=', this.usuario);
          }),
          err => {
            console.log(err);
          }
        } else {
          this.idUsua='';
        }
        // Carrega Endereço
        if(this.idEnd != null) {
          console.log('Carregando ENDEREÇO');
          this.enderecoService.getEnderecoUsuario(this.idUsua, this.idEnd).then((endereco) => {
            this.model = this.enderecoService.carregaObjeto(endereco);

            console.log('Endereco carregado=', this.model);
          }),
          err => {
            console.log(err);
          }
        } else {
          this.idEnd='';
        }
      }
    )

    this.inscricaoQuery = this.route.queryParams.subscribe(
      (queryParams: any) => {
        this.modo = queryParams['modo'];
        console.log('Modo selecionado=', this.modo);
      }
    )

  }

  onSubmit(form:NgForm) {
    if(this.idEnd === undefined || this.idEnd == '' || this.idEnd == null) {
      // *******************************************************************
      // - Rotina de Inclusão de Registro
      // *******************************************************************
      console.log('Rotina de inclusão');
      this.enderecoService.atualizarEndereco(this.model, "I")
          .then(() => {
              this.stsMensagem = 'alert alert-dismissible alert-success';
              this.txtMensagem = 'Aguarde...salvando registro!';
              this.flagHidden = false;
              setInterval(() => { this.flagHidden = true; }, 3000);
          }).catch((err) => {
              this.stsMensagem = 'alert alert-dismissible alert-danger';
              this.txtMensagem = 'Não foi possível salvar o registro. Verifique!';
              this.flagHidden = false;
              setInterval(() => { this.flagHidden = true; }, 3000);
          });
    } else {
      // *******************************************************************
      // - Rotina de Atualização de Registro
      // *******************************************************************
      console.log('Rotina de atualização');
      this.enderecoService.atualizarEndereco(this.model, "A")
          .then(() => {
              this.stsMensagem = 'alert alert-dismissible alert-success';
              this.txtMensagem = 'Aguarde...salvando registro!';
              this.flagHidden = false;
              setInterval(() => { this.flagHidden = true; }, 3000);
          }).catch((err) => {
              this.stsMensagem = 'alert alert-dismissible alert-danger';
              this.txtMensagem = 'Não foi possível atualizar o registro. Verifique!';
              this.flagHidden = false;
              setInterval(() => { this.flagHidden = true; }, 3000);
          });

    }    
    let resetForm = <HTMLFormElement>document.getElementById('formEndereco');
    resetForm.reset();
    this.novoRegistro(); // abrindo um novo registro.
    console.log('Redirecionando para novo registro');
    //this.router.navigate(['/usuario', this.idUsua, 'endereco', 'novo'], {queryParams: {modo: "editar"}});
    this.router.navigate(['/usuario', this.idUsua, 'endereco']);
  }

  excluirEndereco() {
    console.log('Entrei no excluir Usuário');
    this.enderecoService.removendoEndereco(this.idUsua, this.idEnd)
    .then(() => {
        this.router.navigate(['usuario', this.idUsua, 'endereco']);
    }).catch(function(error) {
        this.stsMensagem = 'alert alert-dismissible alert-danger';
        this.txtMensagem = 'Não foi possível excluir o registro. Verifique!';
        this.flagHidden = false;
        setInterval(() => { this.flagHidden = true; }, 3000);
    });
  }

  novoRegistro() {
    // --- limpa objeto
    this.idEnd='';
    this.model = new EnderecoVO();
    // Atualiza o usuário carregado com o usuário
    this.model.usuario.usua_sq_id = this.usuario.usua_sq_id;
    this.model.usuario.usua_nm_usuario = this.usuario.usua_nm_usuario;
    
  }


  ngOnDestroy() {
    this.inscricao.unsubscribe();
    this.inscricaoQuery.unsubscribe();
  }

}
