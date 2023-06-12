import { Model } from 'objection';

export class GeoModel extends Model {
  public seq_geo: number;
  public nme_municipio: string;
  public cod_municipio: number;
  public nme_uf: string;
  public cod_uf: number;

  static get idColumn() {
    return ['seq_geo'];
  }

  static get tableName() {
    return 'dwvinhos_pdi.di_geo';
  }
}
