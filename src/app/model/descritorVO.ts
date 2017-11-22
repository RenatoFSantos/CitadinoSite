export class DescritorVO {
    public desc_sq_id: string;
    public desc_nm_descritor: string;
    public desc_nm_pesquisa: string;
    public desc_in_privado: boolean;

    constructor() {
        this.desc_sq_id = '';
        this.desc_nm_descritor= '';
        this.desc_nm_pesquisa= '';
        this.desc_in_privado=false;
    }

}