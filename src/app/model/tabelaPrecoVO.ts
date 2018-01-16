import { CategoriaPSVO } from './categoriapsVO';
import { EmpresaVO } from 'app/model/empresaVO';

export class TabelaPrecoVO {
    public tapr_sq_id: string;
    public tapr_nm_item: string;
    public tapr_ds_item: string;
    public tapr_ds_unidade: string;
    public tapr_tp_item: string;
    public tapr_vl_unitario: number;
    public tapr_vl_perc_desconto: number;
    public tapr_in_sobconsulta: boolean;
    public tapr_tx_observacao: string;
    public tapr_tx_imagem: string;
    public empresa: EmpresaVO;
    public categoriaps: CategoriaPSVO;

    constructor() {
        this.tapr_sq_id = '';
        this.tapr_nm_item= '';
        this.tapr_ds_item= '';
        this.tapr_ds_unidade= '';
        this.tapr_tp_item= '';
        this.tapr_vl_unitario = 0;
        this.tapr_vl_perc_desconto = 0;
        this.tapr_in_sobconsulta= false;
        this.tapr_tx_observacao= '';
        this.tapr_tx_imagem= '';
        this.empresa = new EmpresaVO();
        this.categoriaps = new CategoriaPSVO();
    }

}