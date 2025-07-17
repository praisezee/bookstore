"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { addToCart } from "@/lib/cart"
import type { Product } from "@/lib/types"
import { toast } from "sonner"

interface AddToCartButtonProps {
  product: Product
  className?: string
}

export default function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const handleAddToCart = () => {
    if (product.stock_quantity <= 0) {
      toast.error("Product is out of stock")
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    })

    toast.success("Added to cart!")
  }

  return (
    <Button onClick={handleAddToCart} disabled={product.stock_quantity <= 0} className={`w-full ${className}`}>
      <ShoppingCart className="h-4 w-4 mr-2" />
      Add to Cart
    </Button>
  )
}
