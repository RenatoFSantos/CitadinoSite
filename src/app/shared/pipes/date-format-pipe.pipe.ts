import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment'
import 'moment/locale/pt-br';

@Pipe({
  name: 'dateFormatPipe'
})
export class DateFormatPipePipe implements PipeTransform {

  // transform(value: string) {
  //   console.log('Valor no Pipe = ', value);
  //   var datePipe = new DatePipe("pt-BR");
  //    value = datePipe.transform(value, 'dd/MM/yyyy');
  //    return value;
  // }

  transform(date: any, args?: any): any {
    moment.locale('pt-BR');
    date = date + " 00:00:00";
    let d = new Date(date)
    return moment(d).format('ll');
  }
}  
