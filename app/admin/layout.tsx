"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("adminToken")

    if (!token && pathname !== "/admin/login") {
      router.push("/admin/login")
      return
    }

    if (token) {
      // Verify token
      fetch("/api/admin/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            setIsAuthenticated(true)
          } else {
            localStorage.removeItem("adminToken")
            router.push("/admin/login")
          }
        })
        .catch(() => {
          localStorage.removeItem("adminToken")
          router.push("/admin/login")
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [router, pathname])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
