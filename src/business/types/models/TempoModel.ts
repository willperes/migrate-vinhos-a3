import { Model } from 'objection';

export class TempoModel extends Model {
  public seq_tempo: number;
  public mes: number;
  public ano: number;
  public trimestre: number;
  public semestre: number;

  static get idColumn() {
    return ['seq_tempo'];
  }

  static get tableName() {
    return 'dwvinhos_pdi.di_tempo';
  }
}
