import { Model } from 'objection';

export class VinhosModel extends Model {
  public seq_vinhos: number;
  public nme_vinho: string;
  public cod_vinho: number;

  static get idColumn() {
    return ['seq_vinhos'];
  }

  static get tableName() {
    return 'dwvinhos_pdi.di_vinhos';
  }
}
