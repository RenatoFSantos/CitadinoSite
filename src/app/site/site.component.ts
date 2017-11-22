import { ContatoService } from './../provider/service/contato.service';
import { Observable } from 'rxjs/Rx';
import { ContatoVO } from './../model/contatoVO';
import { AuthService } from './../auth.service';
import { Router } from '@angular/router';
import { Component, OnInit, NgModule } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Http, HttpModule, RequestOptions } from '@angular/http';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {

  model: ContatoVO = new ContatoVO();
  stsMensagem: string = 'alert alert-dismissible';
  txtMensagem: string = '';
  flagHidden: boolean = true;
  mostraCadastro: boolean = false;

  constructor(private route: Router, private authService: AuthService, private http: Http, private contatoService: ContatoService) { }

  ngOnInit() {
    this.authService.ativarBarraLogin();
    this.authService.signOut();
  }

  telaLogin() {
    this.route.navigate(['/login'], {queryParams: {autenticado: false}});
  }

  divulgarDados() {
    this.mostraCadastro = true;
  }

  fazerContato() {
    this.mostraCadastro = false;
  }

  onSubmit(form:NgForm) {
    if(form.value.meunome=='cadastro') {
      console.log('Entrei no formulário de cadastro');
      let resetForm = <HTMLFormElement>document.getElementById('formCadastro');
      this.contatoService.atualizarCadastro(this.model)
          .then(() => {
        // --- Limpar formulário
              this.stsMensagem = 'alert alert-dismissible alert-success';
              this.txtMensagem = 'Dados enviados com sucesso!';
              this.flagHidden = false;
              // --- Enviando email
              this.authService.sendemail(form.value).subscribe(res => {
                setInterval(() => { 
                  this.flagHidden = true; 
                }, 3000);
              this.mostraCadastro=false; // --- escondendo a seção novamente
              resetForm.reset();
              },
                error => {
                  this.stsMensagem = 'alert alert-dismissible alert-danger';
                  this.txtMensagem = 'Ops! Problemas no envio do email! Tente novamente mais tarde ou envie diretamente pelo link ao lado da imagem do Googlemaps.';
                  this.flagHidden = false;
                  setInterval(() => { this.flagHidden = true; }, 5000);
                  resetForm.reset();
              })
          }).catch((err) => {
              this.stsMensagem = 'alert alert-dismissible alert-danger';
              this.txtMensagem = 'Ops! Problemas no envio do cadastro! Tente novamente mais tarde ou entre em contato pelo formulário acima.';
              this.flagHidden = false;
              setInterval(() => { 
                this.flagHidden = true; 
                this.mostraCadastro=false; // --- escondendo a seção novamente
              }, 5000);
              resetForm.reset();
          });      
    } else {
      console.log('Entrei no formulário de contato', form.value.meunome);  
      
      let resetForm = <HTMLFormElement>document.getElementById('formContato');
      
      // *******************************************************************    
      // *** Enviando mensagem 
      // *******************************************************************

      this.authService.sendemail(form.value).subscribe(res => {
        // --- Limpar formulário
        resetForm.reset();
        this.stsMensagem = 'alert alert-dismissible alert-success';
        this.txtMensagem = 'Mensagem enviada com sucesso!';
        this.flagHidden = false;
        setInterval(() => { this.flagHidden = true; }, 3000);
      },
        error => {
          this.stsMensagem = 'alert alert-dismissible alert-danger';
          this.txtMensagem = 'Ops! Problemas no envio do email! Tente novamente mais tarde ou envie diretamente pelo link ao lado da imagem do Googlemaps.';
          this.flagHidden = false;
          setInterval(() => { this.flagHidden = true; }, 5000);
          resetForm.reset();
      })

    }


  }

}
