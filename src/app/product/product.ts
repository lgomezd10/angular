export class Producto {
    productId: number;
    name: string;
    price: number;
    type: string;
    stock: number;

    constructor() {
        
        this.productId = 0;
        this.name = "";
        this.price = 0;
        this.type = "";
        this.stock = 0;
        
    }
}