import Knex from 'knex';
import { dbSettings } from './../knexfile';
import { Model, transaction } from 'objection';
import { TabelaDadosLegadosModel } from './business/types/models/TabelaDadosLegadosModel';
import { LojaModel } from './business/types/models/LojaModel';
import { Loja } from './business/types/Loja';
import { TempoModel } from './business/types/models/TempoModel';
import { Tempo } from './business/types/Tempo';
import { getQuarter } from 'date-fns';
import { VinhosModel } from './business/types/models/VinhosModel';
import { Vinho } from './business/types/Vinho';
import { GeoModel } from './business/types/models/GeoModel';
import { Geo } from './business/types/Geo';
import { FtVendasModel } from './business/types/models/FtVendasModel';
import { Venda } from './business/types/Venda';

const knex = Knex(dbSettings);

async function main() {
  console.log('Starting...');

  // Bind knex instance to objection.
  Model.knex(knex);

  console.log('Retrieving legacy data from the table tabela_dados_legados');
  const legacyData = await TabelaDadosLegadosModel.query();

  await transaction(knex, async trx => {
    try {
      for (const item of legacyData) {
        let seq_loja: number;
        let seq_tempo: number;
        let seq_vinhos: number;
        let seq_geo: number;

        // Handling store
        const { comprador, tipo_de_estabelecimento } = item;
        const storeData = await LojaModel.query(trx).findOne({
          nme_loja: comprador,
          tpo_estabelecimento: tipo_de_estabelecimento
        });

        if (storeData) {
          console.log('Registro de loja já existe, ignorando...');
          seq_loja = storeData.seq_loja;
        } else {
          const place = await LojaModel.query(trx).findOne({
            tpo_estabelecimento: tipo_de_estabelecimento
          });

          if (place) {
            const data: Omit<Loja, 'seq_loja' | 'cod_loja'> = {
              nme_loja: comprador,
              tpo_estabelecimento: tipo_de_estabelecimento,
              cod_establecimento: place.cod_establecimento
            };

            console.log('Inserindo loja...');
            await LojaModel.query(trx)
              .insertAndFetch(data)
              .then(res => {
                seq_loja = res.seq_loja;
              });
          } else {
            const data: Omit<Loja, 'seq_loja' | 'cod_loja' | 'cod_establecimento'> = {
              nme_loja: comprador,
              tpo_estabelecimento: tipo_de_estabelecimento
            };

            console.log('Inserindo loja...');
            await LojaModel.query(trx)
              .insertAndFetch(data)
              .then(res => {
                seq_loja = res.seq_loja;
              });
          }
        }

        // Handle tempo
        const { mes, ano } = item;
        const tempoData = await TempoModel.query(trx).findOne({ mes, ano });

        if (tempoData) {
          console.log('Registro de tempo já existe, ignorando...');
          seq_tempo = tempoData.seq_tempo;
        } else {
          const data: Omit<Tempo, 'seq_tempo'> = {
            mes,
            ano,
            trimestre: getQuarter(mes),
            semestre: mes <= 6 ? 1 : 2
          };

          console.log('Inserindo tempo...');
          await TempoModel.query(trx)
            .insertAndFetch(data)
            .then(res => {
              seq_tempo = res.seq_tempo;
            });
        }

        // Handle vinhos
        const { vinho } = item;
        const vinhoData = await VinhosModel.query(trx).findOne({ nme_vinho: vinho });

        if (vinhoData) {
          console.log('Registro de vinho já existe, ignorando...');
          seq_vinhos = vinhoData.seq_vinhos;
        } else {
          const data: Omit<Vinho, 'seq_vinhos' | 'cod_vinho'> = {
            nme_vinho: vinho
          };

          console.log('Inserindo vinho...');
          await VinhosModel.query(trx)
            .insertAndFetch(data)
            .then(res => {
              seq_vinhos = res.seq_vinhos;
            });
        }

        // Handle geo
        const { municipio, uf } = item;
        const geoData = await GeoModel.query(trx).findOne({ nme_municipio: municipio, nme_uf: uf });

        if (geoData) {
          console.log('Registro de geo já existe, ignorando...');
          seq_geo = geoData.seq_geo;
        } else {
          const ufData = await GeoModel.query(trx).findOne({ nme_uf: uf });

          if (ufData) {
            const data: Omit<Geo, 'seq_geo' | 'cod_municipio'> = {
              nme_municipio: municipio,
              nme_uf: ufData.nme_uf,
              cod_uf: ufData.cod_uf
            };

            console.log('Inserindo geo...');
            await GeoModel.query(trx)
              .insertAndFetch(data)
              .then(res => {
                seq_geo = res.seq_geo;
              });
          } else {
            const data: Omit<Geo, 'seq_geo' | 'cod_municipio' | 'cod_uf'> = {
              nme_municipio: municipio,
              nme_uf: ufData.nme_uf
            };

            console.log('Inserindo geo...');
            await GeoModel.query(trx)
              .insertAndFetch(data)
              .then(res => {
                seq_geo = res.seq_geo;
              });
          }
        }

        const vendaData = await FtVendasModel.query(trx).findOne({ seq_loja, seq_geo, seq_tempo, seq_vinhos });
        if (vendaData) {
          console.log('Registro de venda já existe, ignorando...');
        } else {
          const data: Venda = {
            seq_loja,
            seq_geo,
            seq_tempo,
            seq_vinhos,
            nro_caixas_vendidas: item.quant_caixas,
            valor_venda: item.valor_venda,
            valor_caixa: item.preco_por_caixa
          };

          console.log('Inserindo venda...');
          await FtVendasModel.query(trx).insert(data);
        }
      }

      trx.commit();
    } catch (err) {
      console.log('An error occurred with the transaction, a rollback will be made');
      trx.rollback();
    }
  });

  console.log('Concluído com sucesso, o serviço pode ser fechado com sucesso');
}

main();
