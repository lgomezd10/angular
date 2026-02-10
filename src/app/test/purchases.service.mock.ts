import { vi } from 'vitest';
import { PurchasesService } from '../purchases/purchases.service';
import { Purchase } from '../purchases/purchase';
import { Observable } from 'rxjs';

export class MockPurchasesService {
    guardarPurchaseSpy: any;
    purchasesPorDateSpy: any;
    respuesta: Purchase[] = [];

    constructor() {
        this.respuesta = [];
        this.guardarPurchaseSpy = vi.fn().mockReturnValue(this);
        this.purchasesPorDateSpy = vi.fn().mockReturnValue(this);
    }

    guardarPurchase(purchases: Purchase[]): Observable<Purchase[]> {
        return this.guardarPurchaseSpy(purchases);
    }

    purchasesPorDate(date: Date): Observable<Purchase[]> {
        return this.purchasesPorDateSpy(date);
    }

    subscribe(callback: (respuesta: Purchase[]) => void): void {
        callback(this.respuesta);
    }

    setResponse(respuesta: Purchase[]): void {
        this.respuesta = respuesta;
    }

    getProviders(): Array<any> {
        return [{ provide: PurchasesService, useValue: this }];
    }
}