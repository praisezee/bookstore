export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock_quantity: number
  image_url: string
  category_id: string
  category?: Category
  created_at: Date
  updated_at: Date
}

export interface Category {
  id: string
  name: string
  description: string
  created_at: Date
  updated_at: Date
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url: string
}

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  total_amount: number
  status: string
  payment_reference: string
  payment_status: string
  created_at: Date
  updated_at: Date
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product?: Product
}

export interface AdminUser {
  id: string
  username: string
  email: string
  created_at: Date
  updated_at: Date
}
