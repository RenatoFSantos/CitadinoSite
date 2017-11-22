import { CtdFuncoes } from './../../ctd-funcoes';

export class VitrineVO {
    public vitr_sq_id: string;
    public vitr_dt_agendada: string;
    public vitr_sq_ordem: string;
    public anun_sq_id: string;
    public anun_ds_anuncio: string;
    public anun_tx_titulo: string;
    public anun_tx_subtitulo: string;
    public anun_tx_texto: string;
    public anun_tx_urlavatar: string;
    public anun_tx_urlthumbnail: string;
    public anun_tx_urlbanner: string;
    public anun_tx_urlicone: string;
    public anun_tx_urlslide1: string;
    public anun_tx_urlslide2: string;
    public anun_tx_urlslide3: string;
    public anun_tx_urlslide4: string;
    public anun_tx_urlcupomaberto: string;
    public anun_tx_urlcupomfechado: string;
    public anun_nr_totalcupom: number;
    public anun_nr_totalpremio: number;
    public anun_nr_curtidas: number;
    public anun_nr_salvos: number;
    public anun_nr_visitas: number;
    public anun_in_status: string;
    public empr_sq_id: string;
    public muni_sq_id: string;
    public tian_sq_id: string;
    public agen_sq_id: string;

    constructor() {
        this.vitr_sq_id = '';
        this.vitr_dt_agendada = CtdFuncoes.convertDateToStr(new Date(), 1);
        this.vitr_sq_ordem = '';
        this.anun_sq_id = '';
        this.anun_ds_anuncio = '';
        this.anun_tx_titulo = '';
        this.anun_tx_subtitulo = '';
        this.anun_tx_texto = '';
        this.anun_tx_urlavatar = '';
        this.anun_tx_urlthumbnail = '';
        this.anun_tx_urlbanner = '';
        this.anun_tx_urlicone = '';
        this.anun_tx_urlslide1 = '';
        this.anun_tx_urlslide2 = '';
        this.anun_tx_urlslide3 = '';
        this.anun_tx_urlslide4 = '';
        this.anun_tx_urlcupomaberto= '';
        this.anun_tx_urlcupomfechado= '';
        this.anun_nr_totalcupom = 0;
        this.anun_nr_totalpremio = 0;
        this.anun_nr_curtidas = 0;
        this.anun_nr_salvos = 0;
        this.anun_nr_visitas = 0;
        this.empr_sq_id = '';
        this.muni_sq_id = '';
        this.tian_sq_id = '';
        this.agen_sq_id = '';
    }

}