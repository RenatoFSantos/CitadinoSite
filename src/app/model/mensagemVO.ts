
export class MensagemVO {
    public mens_sq_id: string;
    public mens_dt_datamensagem: Date;
    public mens_ds_mensagem: string;
    public mens_in_status: string;


    constructor() {
        this.mens_sq_id = '';
        this.mens_dt_datamensagem = new Date();
        this.mens_ds_mensagem = '';
        this.mens_in_status = '';
    }

}