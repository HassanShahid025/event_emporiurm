export interface IProducts {
  category?: string;
  id?: string;
  imageURL?: string[];
  name?: string;
  city?: string;
  location?:string;
  price?: number;
  desc?: string;
  createdAt?: any;
  editedAt?: any;
  cartQuantiy?: number;
  productID?: string;
}

export interface IProduct {
  products: IProducts[];
  minPrice: null | number;
  maxPrice: null | number;
}

export interface IFilter {
  filteredProducts: IProducts[];
}

export interface ICart {
  cartItems: IProducts[];
  isFavourite:false
}

export type ICard = {
  name: string;
  cardNumber: string;
  expiration: string;
  cvc: string;
  country: string;
  zip: string;
};

export interface IOrderHistory {
  orderHistory: any;
  totalOrderAmount:number
}

export interface IOrder {
  cartItems: IProducts[];
  email: string;
  id: string;
  orderAmount: number;
  orderDate: string;
  orderStatus: string;
  orderTime: string;
  userId: string;
  shippingAddress: any;
  createdAt:any;
  editedAt?:any

}
export interface IReview {
  createdAt: any;
  id: string;
  productID: string;
  rate: number;
  review: string;
  reviewDate: string;
  userId: string;
  userName: string;
}
