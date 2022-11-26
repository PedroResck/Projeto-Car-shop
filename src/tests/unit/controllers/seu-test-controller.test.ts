import * as sinon from 'sinon';
import chai from 'chai';
import chaiHttp = require('chai-http');
import server from '../../../server';
import Sinon = require('sinon');
import CarModel, { CarDocument } from '../../../models/Car';
import { ControllerErrors } from '../../../controllers';
import { MESSAGECHARNUMBER } from '../../../controllers/Car';

const model = new CarModel();

const carMock = [{
    _id: "4edd40c86762e0fb12000003",
    model: "Ferrari Maranello",
    year: 1963,
    color: "red",
    buyValue: 3500000,
    seatsQty: 2,
    doorsQty: 2
  }] as (CarDocument & { _id: any } )[];
  
  const newCarMock = {
    model: 'Uno da Escada',
    year: 1966,
    color: 'blue',
    buyValue: 3500,
    seatsQty: 2,
    doorsQty: 2
  };

  const updateCarMock = [{
    _id: "4edd40c86762e0fb12000003",
    model: 'Uno da Escada',
    year: 1966,
    color: 'blue',
    buyValue: 3500,
    seatsQty: 2,
    doorsQty: 2
  }] as (CarDocument & { _id: any } )[];


  chai.use(chaiHttp);

  const { expect } = chai;

  describe('Rota /cars', () => {

    describe('Lista todos os carros', async () => {
        let response: Response;
    
        before(async () => {
          sinon
            .stub(model.modelo, 'find')
            .resolves(carMock);
          response = await chai.request(server.getApp()).get('/cars').then(res => res) as Response;
        });
    
        after(() => {
          (model.modelo.find as sinon.SinonStub).restore();
        })

        it('retorna status e body corretos', () => {
            expect(response.status).to.be.equal(200);
            expect(response.body).to.be.deep.equal(carMock);
          });
        });
      
        describe('Lista o carro pelo id', async () => {
          let response: Response;
      
          before(async () => {
            sinon
              .stub(model.modelo, 'findOne')
              .resolves(carMock[0]);
            response = await chai.request(server.getApp()).get('/cars/4edd40c86762e0fb12000003').then(res => res) as Response;
          });
      
          after(() => {
            (model.modelo.findOne as sinon.SinonStub).restore();
        })

        it('retorna status e body corretos', () => {
          expect(response.status).to.be.equal(200);
          expect(response.body).to.be.deep.equal(carMock[0]);
        });
      });
    
      describe('Erro ao listar o carro pelo id', async () => {
        let response: Response;
    
        before(async () => {
          sinon
            .stub(model.modelo, 'findOne')
            .resolves()
          response = await chai.request(server.getApp()).get('/cars/4edd40c86762e0fb1200ffff').then(res => res) as Response;
        });
    
        after(() => {
          (model.modelo.findOne as sinon.SinonStub).restore();
        })

        it('retorna status e body corretos', () => {
            expect(response.status).to.be.equal(404);
            expect(response.body).to.be.deep.equal({ error: ControllerErrors.notFound });
          });
        });
      
        describe('Erro ao passar o id do carro', async () => {
          let response: Response;
      
          before(async () => {
            response = await chai.request(server.getApp()).get('/cars/4edd40c86762e0fb1200').then(res => res) as Response;
          });
      
          it('retorna status e body corretos', () => {
            expect(response.status).to.be.equal(400);
            expect(response.body).to.be.deep.equal({ error: MESSAGECHARNUMBER });
          });
        });
      
        describe('Cadastra um novo carro', async () => {
          let response: Response;
      
          before(async () => {
            sinon
              .stub(model.modelo, 'create')
              .resolves(newCarMock);
            response = await chai.request(server.getApp()).post('/cars').send(newCarMock).then(res => res) as Response;
          });
      
          after(() => {
            (model.modelo.create as sinon.SinonStub).restore();
          })
      
          it('retorna status e body corretos', () => {
            expect(response.status).to.be.equal(201);
            expect(response.body).to.be.deep.equal(newCarMock);
          });
        });
      
        describe('Erro ao cadastrar um novo carro', async () => {
          let response: Response;
      
          before(async () => {
            sinon
              .stub(model.modelo, 'create')
              .resolves(newCarMock);
            response = await chai.request(server.getApp()).post('/cars').send({}).then(res => res) as Response;
          });
      
          after(() => {
            (model.modelo.create as sinon.SinonStub).restore();
          })
      
          it('retorna status e body corretos', () => {
            expect(response.status).to.be.equal(400);
          });
        });
      
        describe('Atualiza um carro', async () => {
          let response: Response;
      
          before(async () => {
            sinon
              .stub(model.modelo, 'findOneAndUpdate')
              .resolves(updateCarMock[0]);
            response = await chai.request(server.getApp()).put('/cars/4edd40c86762e0fb12000003').send(newCarMock).then(res => res) as Response;
          });
      
          after(() => {
            (model.modelo.findOneAndUpdate as sinon.SinonStub).restore();
          })
      
          it('retorna status e body corretos', () => {
            expect(response.status).to.be.equal(200);
            expect(response.body).to.be.deep.equal(updateCarMock[0]);
          });
        });
      
        describe('Erro ao atualizar um carro', async () => {
          let response: Response;
      
          before(async () => {
            sinon
              .stub(model.modelo, 'findOneAndUpdate')
              .resolves(updateCarMock[0]);
            response = await chai.request(server.getApp()).put('/cars/4edd40c86762e0fb12').send(newCarMock).then(res => res) as Response;
          });
      
          after(() => {
            (model.modelo.findOneAndUpdate as sinon.SinonStub).restore();
          })
      
          it('retorna status e body corretos', () => {
            expect(response.status).to.be.equal(400);
            expect(response.body).to.be.deep.equal({ error: MESSAGECHARNUMBER });
          });
        });
      
        describe('Deleta um carro', async () => {
          let response: Response;
      
          before(async () => {
            sinon
              .stub(model.modelo, 'findOneAndDelete')
              .resolves(carMock[0]);
            response = await chai.request(server.getApp()).delete('/cars/4edd40c86762e0fb12000003').then(res => res) as Response;
          });
      
          after(() => {
            (model.modelo.findOneAndDelete as sinon.SinonStub).restore();
          })
      
          it('retorna status e body corretos', () => {
            expect(response.status).to.be.equal(204);
            expect(response.body).to.be.deep.equal({});
          });
        });
      
        describe('Não consegue deletar um carro', async () => {
          let response: Response;
      
          before(async () => {
            sinon
              .stub(model.modelo, 'findOneAndDelete')
              .resolves();
            response = await chai.request(server.getApp()).delete('/cars/4edd40c86762e0fb12').then(res => res) as Response;
          });
      
          after(() => {
            (model.modelo.findOneAndDelete as sinon.SinonStub).restore();
          })
      
          it('retorna status e body corretos', () => {
            expect(response.status).to.be.equal(400);
            expect(response.body).to.be.deep.equal({ error: MESSAGECHARNUMBER });
          });
        });
      
      });