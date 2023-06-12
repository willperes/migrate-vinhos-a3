import { Model } from 'objection';

export class LojaModel extends Model {
  public seq_loja: number;
  public nme_loja: string;
  public tpo_estabelecimento: string;
  public cod_loja: number;
  public cod_establecimento: number;

  static get idColumn() {
    return ['seq_loja'];
  }

  static get tableName() {
    return 'dwvinhos_pdi.di_loja';
  }
}
