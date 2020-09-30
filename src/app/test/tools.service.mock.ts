import { SpyObject } from './test.helpers';
import { ProductsService } from '../product/products.service';
import { toolsService } from '../tools/tools.service';

export class MockToolsServices extends SpyObject {
    fakePulsado: String;
    getPulsado$Spy;
    newButtonTypeSpy;
    eliminarButtonTypeSpy;
    activarFocoSpy;

    constructor() {
        super(ProductsService);
        this.fakePulsado = "";
        this.getPulsado$Spy = this.spy('getPulsado$').and.returnValue(this);
        this.newButtonTypeSpy = this.spy('newButtonType').and.callFake(() => {});
        this.eliminarButtonTypeSpy = this.spy('eliminarButtonType').and.callFake(() => {});
        this.activarFocoSpy = this.spy('activarFoco').and.callFake(() => {});
    }

    subscribe(callback) {
        callback(this.fakePulsado);
        return this;
    }

    unsubscribe() {

    }

    setButtonType(pulsado: string) {
        this.fakePulsado = pulsado;
    }

    getProviders(): Array<any> {
        return [{ provide: toolsService, useValue: this }];
      }
}
