import { CtdFuncoes } from './../../ctd-funcoes';
import { EmpresaVO } from './empresaVO';

export class UsuarioVO {
    public usua_sq_id: string;
    public usua_nm_usuario: string;
    public usua_tx_login: string;
    public usua_tx_senha: string;
    public usua_ds_sexo: string;
    public usua_dt_inclusao: string;
    public usua_ds_telefone: string;
    public usua_ds_email: string;
    public usua_nr_reputacao: number;
    public usua_tx_observacao: string;
    public usua_tx_urlprofile: string;
    public usua_in_empresa: boolean;
    public usua_in_ajuda: boolean;
    public usua_sg_perfil: string;
    public empresa: EmpresaVO;

    constructor() {
        this.usua_sq_id = '';
        this.usua_nm_usuario = '';
        this.usua_tx_login = '';
        this.usua_tx_senha = '';
        this.usua_ds_sexo = '';
        this.usua_dt_inclusao = (new Date()).toLocaleString('pt-BR');
        this.usua_ds_telefone = '';
        this.usua_ds_email = '';
        this.usua_nr_reputacao = 0;
        this.usua_tx_observacao = '';
        this.usua_tx_urlprofile = '';
        this.usua_in_empresa = false;
        this.usua_in_ajuda = false;
        this.usua_sg_perfil = 'USU'; // USU(Usuario comum)-ADM(Administrador)-PAR(Parceiro)-COL(Colunista)
        this.empresa = new EmpresaVO();
        // --- Formatando a data
        console.log('Data anterior = ', this.usua_dt_inclusao);
        console.log((new Date()).toLocaleString('pt-BR'));
        
        this.usua_dt_inclusao = CtdFuncoes.convertDateToStr(new Date(), 1);
        // this.usua_dt_inclusao.substring(6,10)+'-'+this.usua_dt_inclusao.substring(3,5)+'-'+this.usua_dt_inclusao.substring(0,2)
        console.log('Data atualizada = '+this.usua_dt_inclusao);
    }

}