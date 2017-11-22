import { AnuncioVO } from './anuncioVO';
import { CtdFuncoes } from './../../ctd-funcoes';

export class AgendaVO {
    public agen_sq_id: string;
    public agen_dt_inicio: string;
    public agen_dt_termino: string;
    public agen_dt_carga: string;
    public agen_in_status: string;
    public anuncio: AnuncioVO;

    constructor() {
        this.agen_sq_id = '';
        this.agen_dt_inicio = CtdFuncoes.convertDateToStr(new Date(), 1);
        this.agen_dt_termino = CtdFuncoes.convertDateToStr(new Date(), 1);
        this.agen_dt_carga = '';
        this.agen_in_status = "A";
        this.anuncio = new AnuncioVO();
        console.log('Data da agenda=', CtdFuncoes.convertDateToStr(new Date(), 1));
    }

}