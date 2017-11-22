import { UsuarioTO } from './usuarioTO';
export class EnderecoVO {
    public ende_sq_id: string;
    public ende_cd_endereco: string;
    public ende_tx_endereco: string;
    public ende_tx_bairro: string;
    public ende_tx_cidade: string;
    public ende_sg_uf: string;
    public ende_nr_cep: string;
    public usuario: UsuarioTO;

    constructor() {
        this.ende_sq_id = '';
        this.ende_cd_endereco= '';
        this.ende_tx_endereco= '';
        this.ende_tx_bairro= '';
        this.ende_tx_cidade= '';
        this.ende_sg_uf= '';
        this.ende_nr_cep= '';
        this.usuario = new UsuarioTO();
    }

}