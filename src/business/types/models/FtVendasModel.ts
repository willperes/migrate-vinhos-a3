import { Model } from 'objection';

export class FtVendasModel extends Model {
  public seq_loja: number;
  public seq_tempo: number;
  public seq_vinhos: number;
  public seq_geo: number;
  public nro_caixas_vendidas: number;
  public valor_venda: number;
  public valor_caixa: number;

  static get idColumn() {
    return ['seq_loja', 'seq_tempo', 'seq_vinhos', 'seq_geo'];
  }

  static get tableName() {
    return 'dwvinhos_pdi.ft_vendas';
  }
}
