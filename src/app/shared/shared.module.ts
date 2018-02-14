import { ItemService } from './../provider/service/item.service';
import { ProgressDirective } from './directives/progress.directive';
import { BarComponent } from './components/bar/bar.component';
import { FileUploader } from './components/file-upload/file-uploader.class';
import { FileType } from './components/file-upload/file-type.class';
import { FileSelectDirective } from './components/file-upload/file-select.directive';
import { FileLikeObject } from './components/file-upload/file-like-object.class';
import { FileItem } from './components/file-upload/file-item.class';
import { FileDropDirective } from './components/file-upload/file-drop.directive';
/**
 * Arquivo de configuração do módulo compartilhado.
 *
 * @author Márcio Casale de Souza <contato@kazale.com>
 * @since 0.0.3
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { 
  KzCpfPipe,
  KzCnpjPipe,
  KzCpfValidatorDirective,
  KzCnpjValidatorDirective, 
  KzMaskDirective,
  KzMaskCurrencyDirective,
  KzPaginacaoComponent
} from './';
import { KzCepPipe } from './pipes/kz-cep.pipe';
import { KzTelPipe } from './pipes/kz-tel.pipe';
import { ProgressbarComponent } from './components/progressbar/progressbar.component';
import { DateFormatPipePipe } from './pipes/date-format-pipe.pipe';


@NgModule({
  imports:      [ 
  	CommonModule,
  	FormsModule 
  ],
  declarations: [ 
  	KzCpfPipe,
  	KzCnpjPipe,
  	KzCpfValidatorDirective,
  	KzCnpjValidatorDirective, 
    KzMaskDirective,
    KzMaskCurrencyDirective,
    KzPaginacaoComponent,
    KzCepPipe,
    KzTelPipe,
    FileDropDirective,
    FileSelectDirective,
    BarComponent,
    ProgressDirective,
    ProgressbarComponent,
    DateFormatPipePipe,
  ],
  exports: [ 
  	KzCpfPipe,
  	KzCnpjPipe,
  	KzCpfValidatorDirective,
  	KzCnpjValidatorDirective, 
    KzMaskDirective,
    KzMaskCurrencyDirective,
    KzPaginacaoComponent,
    CommonModule, 
    FormsModule,
    FileDropDirective,
    FileSelectDirective,
    BarComponent,
    ProgressDirective,
    ProgressbarComponent,
    DateFormatPipePipe,
  ],
  providers: [
    ItemService
  ]
})
export class SharedModule {}