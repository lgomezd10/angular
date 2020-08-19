import { SpyObject } from './test.helpers';
import { ComprasService } from '../compras/compras.service';

export class MockComprasService extends SpyObject {

    guardarCompraSpy;
    comprasPorFechaSpy;
    respuesta;


    constructor() {
        super(ComprasService);
        this.respuesta = [];
        this.guardarCompraSpy = this.spy('guardarCompra').and.returnValue(this);
        this.comprasPorFechaSpy = this.spy('comprasPorFecha').and.returnValue(this);
        
    }

    subscribe(callback) {
        callback(this.respuesta);
    }

    setRespuesta(respuesta) {
        this.respuesta = respuesta;
    }
    
}