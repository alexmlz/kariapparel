import { ShoppingCart } from './shopping-cart';

export class Order {
    datePlaced: number;
    items: any[];
    payed = false;

    constructor(public userId, public shipping: any, shoppingCart: ShoppingCart, public paymentDetails: any) {
      if (paymentDetails !== null) {
        this.payed = true;
      }
      this.datePlaced = new Date().getTime();

      this.items = shoppingCart.items.map( i => {
            return {
              product: {
                title: i.title,
                imageUrl: i.imageUrl,
                price: i.price,
                description: i.description
              },
              quantity: i.quantity,
              totalPrice: i.totalPrice
            };
          });
    }
}
