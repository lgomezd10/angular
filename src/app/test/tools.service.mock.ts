import { SpyObject } from './test.helpers';
import { ProductsService } from '../product/products.service';
import { ToolsService } from '../tools/tools.service';

export class MockToolsServices extends SpyObject {
    fakePulsado: String;
    getPulsado$Spy;
    newButtonTypeSpy;
    deleteButtonTypeSpy;
    activateFocusSpy;

    constructor() {
        super(ProductsService);
        this.fakePulsado = "";
        this.getPulsado$Spy = this.spy('getPulsado$').and.returnValue(this);
        this.newButtonTypeSpy = this.spy('newButtonType').and.callFake(() => {});
        this.deleteButtonTypeSpy = this.spy('deleteButtonType').and.callFake(() => {});
        this.activateFocusSpy = this.spy('activateFocus').and.callFake(() => {});
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
        return [{ provide: ToolsService, useValue: this }];
      }
}
