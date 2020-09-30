import { SpyObject } from './test.helpers';
import { purchasesService } from '../purchases/purchases.service';

export class MockPurchasesService extends SpyObject {

    guardarpurchasespy;
    purchasesPordateSpy;
    respuesta;


    constructor() {
        super(purchasesService);
        this.respuesta = [];
        this.guardarpurchasespy = this.spy('guardarCompra').and.returnValue(this);
        this.purchasesPordateSpy = this.spy('purchasesPordate').and.returnValue(this);
        
    }

    subscribe(callback) {
        callback(this.respuesta);
    }

    setRespuesta(respuesta) {
        this.respuesta = respuesta;
    }
    
}