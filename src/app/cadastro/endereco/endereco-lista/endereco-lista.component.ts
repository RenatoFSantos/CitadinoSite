import { UsuarioVO } from './../../../model/usuarioVO';
import { UsuarioService } from './../../../provider/service/usuario.service';
import { UsuarioTO } from './../../../model/usuarioTO';
import { EnderecoVO } from './../../../model/enderecoVO';
import { EnderecoService } from './../../../provider/service/endereco.service';
import { Subscription } from 'rxjs/Rx';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-endereco-lista',
  templateUrl: './endereco-lista.component.html',
  styleUrls: ['./endereco-lista.component.css']
})
export class EnderecoListaComponent implements OnInit {

  inscricao: Subscription;
  idUsuario: string;
  listaEnderecos: string[] = [];
  model: EnderecoVO = new EnderecoVO();
  usuario: UsuarioVO = new UsuarioVO();

  constructor(private route: ActivatedRoute, private router: Router, private enderecoService: EnderecoService, private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.idUsuario = params['idusua'];
        console.log('Código do Usuário: ', this.idUsuario);
        if(this.idUsuario != null) {
          // -- Carregando o Usuário Selecionado
          this.usuarioService.getUsuario(this.idUsuario).then((usuario) => {
            this.usuario = this.carregaObjeto(usuario);
            console.log('Usuário carregado = ', this.usuario);
          });
          // -- Carregando os endereços deste usuario
          this.enderecoService.getEnderecosUsuario(this.idUsuario).then(snapshot => {
            snapshot.forEach((childSnapshot) => {
            var element = childSnapshot;
            this.listaEnderecos.push(element);
            }),
            err => {
              console.log(err);
            }
          });
        } else {
          this.idUsuario='';
          console.log('Estou no else com o id=' + this.idUsuario);
        }
      }
    )       
  }

  carregaObjeto(objUsuario):UsuarioVO {
    console.log('Dentro da função - Usuario: ', objUsuario.key);
    let objRetorno: UsuarioVO = new UsuarioVO();
    let objValor = objUsuario.val();
    // --- Converte objeto interno em objeto Javascript
    let obj = JSON.parse(JSON.stringify(objUsuario.val()));
    let indEmpresa = Object.keys(obj.empresa);

    objRetorno.usua_sq_id = objUsuario.key;
    objRetorno.usua_nm_usuario = objValor.usua_nm_usuario;

    return objRetorno;
  }  

}
