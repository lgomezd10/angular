import { SpyObject } from './test.helpers';
import { PurchasesService } from '../purchases/purchases.service';

export class MockPurchasesService extends SpyObject {

    guardarpurchasespy;
    purchasesPordateSpy;
    respuesta;


    constructor() {
        super(PurchasesService);
        this.respuesta = [];
        this.guardarpurchasespy = this.spy('guardarPurchase').and.returnValue(this);
        this.purchasesPordateSpy = this.spy('purchasesPordate').and.returnValue(this);
        
    }

    subscribe(callback) {
        callback(this.respuesta);
    }

    setResponse(respuesta) {
        this.respuesta = respuesta;
    }
    
}