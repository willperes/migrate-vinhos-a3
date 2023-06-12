import { Model } from 'objection';

export class TabelaDadosLegadosModel extends Model {
  public vinho: string;
  public quant_caixas: number;
  public preco_por_caixa: number;
  public valor_venda: number;
  public mes: number;
  public ano: number;
  public comprador: string;
  public tipo_de_estabelecimento: string;
  public municipio: string;
  public uf: string;

  static get tableName() {
    return 'relacional_vinhos.tabela_dados_legados';
  }
}
