    import { NgModule } from '@angular/core';
    import * as enums from './app/model/dominio/enum';

    @NgModule()
    export class CtdFuncoes {
    
        private static formatDateBR = new Intl.DateTimeFormat('pt-BR', {
            year: "numeric", month: "2-digit", day: "2-digit"
        });

        public static convertDateToStr(value: Date, dtFormat: number): string {
            var result: string = "";
            
            if (dtFormat == enums.DateFormat.ptBR) {
                result = this.formatDateBR.format(value);
            }
            else {
                var dt = this.formatDateBR.format(value);
                //result = value.getFullYear() + '-' + value.getMonth()+1 + '-' + value.getDate();
                result = dt.substring(6,10) + '-' + dt.substring(3,5) + '-' +  dt.substring(0,2);
            }

            return result;
        }

        public static removerAcento(palavra) {
            var palavraSemAcento = '';
            var caracterComAcento = 'áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ';
            var caracterSemAcento = 'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC';

            for (var i = 0; i < palavra.length; i++)
            {
            var char = palavra.substr(i, 1);
            var indexAcento = caracterComAcento.indexOf(char);
            if (indexAcento != -1) {
                palavraSemAcento += caracterSemAcento.substr(indexAcento, 1);
            } else {
                palavraSemAcento += char;
            }
            }

            return palavraSemAcento;
        }

        public static convertUTCDateToLocalDate(date) {
    
            var newTime = new Date(date).getTime();
            var newTimeZone = new Date().getTimezoneOffset()*60*1000;
            var newDate = new Date(newTime + newTimeZone);
            var offset = new Date().getTimezoneOffset() / 60;
            var hours = new Date().getHours();
            // newDate.setHours(hours - offset);
            return newDate;
        }

    } 
