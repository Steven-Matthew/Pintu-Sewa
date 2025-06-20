import { ErrorSchema } from "./errorSchema";
  
export interface CartResponseProps {
    error_schema: ErrorSchema;
    output_schema:{
      shops: ShopCartProps[];
      total_product_cart: number;
    } 
  }

export interface CartItemProps {
    cart_id: string;
    product_id: string;
    product_name: string;
    price: number;
    start_rent_date: string;
    end_rent_date: string;
    rent_duration: string;
    quantity: number;
    available_to_rent: boolean;
    image: string;
    stock: number;
    min_rented: number;
    min_duration: string;
    daily_price: number;
    weekly_price: number;
    monthly_price: number;
    date_error:boolean;
  }
  
  export interface ShopCartProps {
    shop_id: string;
    shop_name: string;
    carts: CartItemProps[];
  }
  

  