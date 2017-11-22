import { UsuarioVO } from './../../../model/usuarioVO';
import { UsuarioService } from './../../../provider/service/usuario.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-usuario-lista',
  templateUrl: './usuario-lista.component.html',
  styleUrls: ['./usuario-lista.component.css']
})

export class UsuarioListaComponent implements OnInit {

  pagina: number = 0;
  qtdPorPagina: number = 200;
  qtdAdjacentes: number = 3;  
  listaUsuarios = [];
  objUsuario = [];
  usuarios = [];
  totalUsuarios = 0;
  totalRegistros: number = 0;
  cargaCompleta:boolean = false;
  inscricao: Subscription;
  // --- MENSAGEM
  stsMensagem: string = '';
  flagHidden: boolean = true;
  txtMensagem: string = '';
  txtFiltro: string = '';  

  constructor(private route: ActivatedRoute, private router: Router, private usuarioService: UsuarioService) {
    console.log('Entrei no construtor');
    this.carregarListaUsuarios();
  }

  carregarListaUsuarios() {
    console.log('Recarregando a Lista de Usuarios');
    if(this.txtFiltro=='' || this.txtFiltro==undefined || this.txtFiltro==null) {
      console.log('getUsuarios');
      this.usuarioService.getUsuarios().then(snapshot => {
        this.usuarios=[];
        let obj = JSON.parse(JSON.stringify(snapshot.val()));
        let indicesCat = Object.keys(obj);
  
        this.totalRegistros = indicesCat.length;
        snapshot.forEach((childSnapshot) => {
          var element = childSnapshot;
          this.usuarios.push(element);
          this.cargaCompleta=true;
        });
        // this.paginar(this.pagina);
        this.carregarUsuarios();
      })    
    } else {
      console.log('getUsuariosFiltro');
      this.usuarioService.getUsuariosFiltro(this.txtFiltro).then(snapshot => {
        console.log('getUsuariosFiltro - v1');
        if(snapshot.val()!=null && snapshot.val()!=undefined) {
          this.usuarios=[];
          let obj = JSON.parse(JSON.stringify(snapshot.val()));
          let indicesCat = Object.keys(obj);

          this.totalRegistros = indicesCat.length;
          snapshot.forEach((childSnapshot) => {
            var element = childSnapshot;
            this.usuarios.push(element);
            this.cargaCompleta=true;
          });
          // this.paginar(this.pagina);
          this.carregarUsuarios();
        } else {
          this.stsMensagem = 'alert alert-dismissible alert-danger';
          this.txtMensagem = 'Nenhum registro filtrado!';
          this.flagHidden = false;
          setTimeout(() => { this.flagHidden = true; }, 3000);
        }
      })
      .catch((err) => {
        this.stsMensagem = 'alert alert-dismissible alert-danger';
        this.txtMensagem = err.message;
        this.flagHidden = false;
        setTimeout(() => { this.flagHidden = true; }, 3000);
      }) 
    }
  }

  carregaTotalUsuarios() {
    this.usuarioService.getTotalRegistros()
    .then(totreg => {
      this.totalRegistros = totreg;
    });    
  }

  ngOnInit() {
  }

  ngOnChange() {
    console.log('onChange disparado');
  }

  onSubmit(form:NgForm) {
    // this.txtFiltro = this.txtFiltro.toLowerCase();
    this.pagina = 0;
    console.log('Filtro=', this.txtFiltro);
    this.carregarListaUsuarios();
  }

	paginar($event: any) {
		this.pagina = $event - 1;
		this.carregarUsuarios();
	}

  carregarUsuarios() {
		this.listaUsuarios = [];
		for (let i = ( this.pagina * this.qtdPorPagina ); i < (this.pagina * this.qtdPorPagina + this.qtdPorPagina); i++) {
			if (i >= this.totalRegistros) {
				break;
			}
      this.listaUsuarios.push(this.usuarios[i]);
		}
  }

}
