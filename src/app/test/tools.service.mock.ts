import { SpyObject } from './test.helpers';
import { ProductosService } from '../producto/productos.service';
import { toolsService } from '../tools/tools.service';

export class MockToolsServices extends SpyObject {
    fakePulsado: String;
    getPulsado$Spy;
    nuevoBotonSpy;
    eliminarBotonSpy;
    activarFocoSpy;

    constructor() {
        super(ProductosService);
        this.fakePulsado = "";
        this.getPulsado$Spy = this.spy('getPulsado$').and.returnValue(this);
        this.nuevoBotonSpy = this.spy('nuevoBoton').and.callFake(() => {});
        this.eliminarBotonSpy = this.spy('eliminarBoton').and.callFake(() => {});
        this.activarFocoSpy = this.spy('activarFoco').and.callFake(() => {});
    }

    subscribe(callback) {
        callback(this.fakePulsado);
        return this;
    }

    unsubscribe() {

    }

    setBoton(pulsado: string) {
        this.fakePulsado = pulsado;
    }

    getProviders(): Array<any> {
        return [{ provide: toolsService, useValue: this }];
      }
}
