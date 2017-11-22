import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kzTel'
})
export class KzTelPipe implements PipeTransform {

  transform(tel: string): string {
    if(!tel) {
      return '';
    }

    tel=tel.replace(/\D/g,"");             //Remove tudo o que não é dígito

    tel=tel.replace(/^(\d{2})(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    tel=tel.replace(/(\d)(\d{4})$/,"$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
    return tel;    

  }

}

