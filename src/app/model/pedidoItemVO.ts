import { TabelaPrecoVO } from './tabelaPrecoVO';

export class PedidoItemVO {
    public peit_sq_id: string;
    public peit_vl_quantidade: number;
    public peit_vl_subtotal: number;
    public peit_vl_desconto: number;
    public peit_vl_total: number;
    public tabelapreco: TabelaPrecoVO;

    constructor() {
        this.peit_sq_id = '';
        this.peit_vl_quantidade = 0;
        this.peit_vl_subtotal = 0;
        this.peit_vl_desconto = 0;
        this.peit_vl_total = 0;
        this.tabelapreco = new TabelaPrecoVO();
    }

}