export class TipoAnuncioVO {
    public tian_sq_id: string;
    public tian_nm_tipoanuncio: string;
    public tian_nr_creditos: number;
    public tian_nr_dias: number;
    public tian_in_tipo: string;

    constructor() {
        this.tian_sq_id = '';
        this.tian_nm_tipoanuncio= '';
        this.tian_nr_creditos=0;
        this.tian_nr_dias=0;
        this.tian_in_tipo="P"; // --- (P)ublicidade ou (V)ale-Brinde
    }

}