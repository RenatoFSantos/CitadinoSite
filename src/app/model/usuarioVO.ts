import { MunicipioVO } from './municipioVO';
import { CtdFuncoes } from './../../ctd-funcoes';
import { EmpresaVO } from './empresaVO';
import { EnderecoVO } from './enderecoVO';

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
    public municipio: MunicipioVO;
    public endereco: Array<EnderecoVO>;

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
        this.municipio = new MunicipioVO();
        this.endereco = [];
        this.usua_dt_inclusao = CtdFuncoes.convertDateToStr(new Date(), 1);
    }

}