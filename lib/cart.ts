"use client"

import type { CartItem } from "./types"

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return []
  const cart = localStorage.getItem("cart")
  return cart ? JSON.parse(cart) : []
}

export function addToCart(product: { id: string; name: string; price: number; image_url: string }) {
  const cart = getCart()
  const existingItem = cart.find((item) => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
    })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  window.dispatchEvent(new Event("cartUpdated"))
}

export function removeFromCart(productId: string) {
  const cart = getCart()
  const updatedCart = cart.filter((item) => item.id !== productId)
  localStorage.setItem("cart", JSON.stringify(updatedCart))
  window.dispatchEvent(new Event("cartUpdated"))
}

export function updateCartQuantity(productId: string, quantity: number) {
  const cart = getCart()
  const item = cart.find((item) => item.id === productId)

  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      item.quantity = quantity
      localStorage.setItem("cart", JSON.stringify(cart))
      window.dispatchEvent(new Event("cartUpdated"))
    }
  }
}

export function clearCart() {
  localStorage.removeItem("cart")
  window.dispatchEvent(new Event("cartUpdated"))
}

export function getCartTotal(): number {
  const cart = getCart()
  return cart.reduce((total, item) => total + item.price * item.quantity, 0)
}
