import { vi } from 'vitest';
import { ProductsService } from '../product/products.service';
import { Product } from '../product/product';
import { BehaviorSubject, Observable } from 'rxjs';

export class MockProductsService {
    fakeProducts: Product[] = [];
    fakeProducts$: BehaviorSubject<Product[]>;
    fakeProduct: Product;
    getProductsSpy: any;
    getProduct$Spy: any;
    loadProductsSpy: any;
    getProductSpy: any;
    postEditProductSpy: any;
    getProductByNameSpy: any;
    postNewProductSpy: any;

    constructor() {
        this.fakeProducts$ = new BehaviorSubject<Product[]>([]);
        this.fakeProducts = [];
        this.fakeProduct = new Product();
        this.fakeProduct.id = 1;

        this.getProduct$Spy = vi.fn().mockReturnValue(this.fakeProducts$);
        this.getProductsSpy = vi.fn().mockReturnValue(this.fakeProducts);
        this.getProductSpy = vi.fn().mockReturnValue(this.fakeProduct);
        this.postEditProductSpy = vi.fn().mockReturnValue(this);
        this.getProductByNameSpy = vi.fn().mockImplementation((name: string) => {
            const product = new Product();
            product.name = name;
            return product;
        });
        this.postNewProductSpy = vi.fn().mockReturnValue(new Observable());
    }

    getProducts$(): Observable<Product[]> {
        return this.getProduct$Spy();
    }

    getProducts(): Product[] {
        return this.getProductsSpy();
    }

    getProduct(id: number): Product {
        return this.getProductSpy(id);
    }

    postEditProduct(product: Product): Observable<Product> {
        return this.postEditProductSpy(product);
    }

    getProductByName(name: string): Product | undefined {
        return this.getProductByNameSpy(name);
    }

    postNewProduct(product: Product): Observable<Product> {
        return this.postNewProductSpy(product);
    }

    subscribe(callback: (product: Product) => void) {
        callback(this.fakeProduct);
    }

    setProducts(products: Product[]): void {
        this.fakeProducts = products;
        this.fakeProducts$.next(this.fakeProducts);
    }

    setProduct(product: Product): void {
        this.fakeProduct = product;
    }

    getProviders(): Array<any> {
        return [{ provide: ProductsService, useValue: this }];
    }
}