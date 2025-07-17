"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

interface DeleteProductButtonProps {
  productId: string
}

export default function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast.success("Product deleted successfully")
        router.refresh()
      } else {
        toast.error("Failed to delete product")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
