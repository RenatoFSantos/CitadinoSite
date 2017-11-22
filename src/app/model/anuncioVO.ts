import { TipoAnuncioVO } from './tipoAnuncioVO';
import { MunicipioVO } from './municipioVO';
import { EmpresaVO } from './empresaVO';

export class AnuncioVO {
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
    public anun_in_smartsite: boolean;
    public empresa: EmpresaVO;
    public tipoanuncio: TipoAnuncioVO;
    public municipio: MunicipioVO;

    constructor() {
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
        this.anun_in_status = 'I';
        this.anun_in_smartsite = false;
        this.empresa = new EmpresaVO();
        this.tipoanuncio = new TipoAnuncioVO();
        this.municipio = new MunicipioVO();
    }

}