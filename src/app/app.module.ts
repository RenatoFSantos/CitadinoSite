import { DatePipe } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { AuthGuard } from './guards/auth-guards';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FirebaseService } from './provider/database/firebase.service';
import { BrowserModule } from '@angular/platform-browser';
import {  
  FormsModule, 
  ReactiveFormsModule
} from '@angular/forms';
import { HttpModule } from '@angular/http';
import * as firebase from 'firebase';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ContratoComponent } from './contrato/contrato.component';
import { SiteComponent } from './site/site.component';
import { AppRoutingModule } from './app.routing.module';
import { HomeComponent } from './home/home.component';
import { ContatoService } from './provider/service/contato.service';
import { AuthService } from './auth.service';
import { SettingsService } from './settings.service';
import { UsuarioGuards } from './guards/usuario-guards';
import { UsuarioModule } from './cadastro/usuario/usuario.module';
import { PlanoModule } from './cadastro/plano/plano.module';
import { EmpresaModule } from './cadastro/empresa/empresa.module';
import { CategoriaModule } from './cadastro/categoria/categoria.module';
import { CategoriaPSModule } from './cadastro/categoria-ps/categoria-ps.module';
import { DescritorModule } from './cadastro/descritor/descritor.module';
import { MunicipioModule } from './cadastro/municipio/municipio.module';
import { TipoAnuncioModule } from './cadastro/tipoanuncio/tipoanuncio.module';
import { AnuncioModule } from './cadastro/anuncio/anuncio.module';
import { AgendaModule } from './cadastro/agenda/agenda.module';
import { VitrineModule } from './cadastro/vitrine/vitrine.module';
import { CtdFuncoes } from './../ctd-funcoes';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  allowZero: true,
  decimal: ",",
  precision: 2,
  prefix: "R$ ",
  suffix: "",
  thousands: "."
};

// **************************
// ******* TESTE    *********
// **************************
// export const firebaseConfig = {
//     apiKey: "AIzaSyByJsiNAYX6741uxiw-TSokabtN64DeTMk",
//     authDomain: "citadino-c0c79.firebaseapp.com",
//     databaseURL: "https://citadino-c0c79.firebaseio.com",
//     storageBucket: "citadino-c0c79.appspot.com",
//     messagingSenderId: "75420061601"    
// };

// **************************
// **** DESENVOLVIMENTO  ****
// **************************
export const firebaseConfig = {
    apiKey: "AIzaSyC0maPdTdMQ7ccxuiXHLcZ1IsgeX7qVD6I",
    authDomain: "citadinodsv.firebaseapp.com",
    databaseURL: "https://citadinodsv.firebaseio.com",
    projectId: "citadinodsv",
    storageBucket: "citadinodsv.appspot.com",
    messagingSenderId: "180769307423"
  };

// **************************
// ****     PRODUÇÃO     ****
// **************************
// export const firebaseConfig = {
//     apiKey: "AIzaSyCuOY5Kt7_Zo08khwYFiLsIQC4kFe5LWwE",
//     authDomain: "citadinoprd-13651.firebaseapp.com",
//     databaseURL: "https://citadinoprd-13651.firebaseio.com",
//     projectId: "citadinoprd-13651",
//     storageBucket: "citadinoprd-13651.appspot.com",
//     messagingSenderId: "960817085241"  
// };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SiteComponent,
    HomeComponent,
    ContratoComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    UsuarioModule,
    EmpresaModule,
    CategoriaModule,
    CategoriaPSModule,
    PlanoModule,
    DescritorModule,
    MunicipioModule,
    AnuncioModule,
    TipoAnuncioModule,
    AgendaModule,
    VitrineModule,
    CtdFuncoes,
    SharedModule,
    CurrencyMaskModule
  ],
  providers: [
    FirebaseService,
    AuthService,
    AuthGuard,
    UsuarioGuards,
    SettingsService,
    ContatoService,
    {
      provide: LOCALE_ID,
      deps: [SettingsService],
      // useFactory: (settingsService) => settingsService.getLocale()
      useValue: 'pt-BR'
    },
    {
      provide: CURRENCY_MASK_CONFIG, 
      useValue: CustomCurrencyMaskConfig  
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  public rootRef: any = null;
  
  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.rootRef = firebase.database().ref('/');
  }

}
