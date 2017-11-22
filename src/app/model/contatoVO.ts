export class ContatoVO {
    public cont_sq_id: string;
    public cont_nm_nome: string;
    public cont_tx_endereco: string;
    public cont_tx_bairro: string;
    public cont_tx_cidade: string;
    public cont_sg_uf: string;
    public cont_nr_cep: string;    
    public cont_ds_email: string;
    public cont_ds_telefone: string;
    public cont_tx_mensagem: string;
    public cont_in_autorizacao: boolean;

    constructor() {
        this.cont_sq_id = '';
        this.cont_nm_nome = '';
        this.cont_tx_endereco = '';
        this.cont_tx_bairro = '';
        this.cont_tx_cidade = '';
        this.cont_sg_uf = '';
        this.cont_nr_cep = '';    
        this.cont_ds_email = '';
        this.cont_ds_telefone = '';
        this.cont_tx_mensagem = '';
        this.cont_in_autorizacao = true;
    }

}