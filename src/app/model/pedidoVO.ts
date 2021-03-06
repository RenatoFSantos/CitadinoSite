import { MensagemVO } from './mensagemVO';
import { PedidoItemVO } from './pedidoItemVO';
import { UsuarioVO } from "./usuarioVO";
import { EnderecoVO } from "./enderecoVO";

export class PedidoVO {
    public pedi_sq_id: string;
    public pedi_nm_pedido: string;
    public pedi_vl_total: number;
    public pedi_vl_desconto: number;
    public pedi_vl_entrega: number;
    public pedi_in_formapagto: string;
    public pedi_in_status: string;
    public pedi_tx_observacao: string;
    public pedi_dt_datapedido: Date;
    public pedi_dt_horapedido: Date;
    public pedi_md_tempogasto: string;
    public pedi_qn_item: number;
    public empr_sq_id: string;
    public usuario: UsuarioVO;
    public endereco: EnderecoVO;
    public itens: Array<PedidoItemVO>;
    public mensagem: Array<MensagemVO>;

    constructor() {
        this.pedi_sq_id = '';
        this.pedi_nm_pedido = '';
        this.pedi_vl_total= 0;
        this.pedi_vl_desconto= 0;
        this.pedi_vl_entrega= 0;
        this.pedi_in_formapagto = '';
        this.pedi_in_status = '';
        this.pedi_tx_observacao = '';
        this.pedi_dt_datapedido = new Date();
        this.pedi_dt_horapedido = new Date();
        this.pedi_md_tempogasto = '';
        this.pedi_qn_item= 0;
        this.empr_sq_id='';
        this.usuario = new UsuarioVO();
        this.endereco = new EnderecoVO();
        this.itens = [];
        this.mensagem = [];
    }

}