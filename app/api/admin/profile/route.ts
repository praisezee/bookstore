import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminFromToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = await getAdminFromToken(token)
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({
      id: admin.id,
      username: admin.username,
      email: admin.email,
    })
  } catch (error) {
    console.error("Get admin profile error:", error)
    return NextResponse.json({ error: "Failed to get profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = await getAdminFromToken(token)
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { username, email } = await request.json()

    const updatedAdmin = await prisma.admin_users.update({
      where: { id: admin.id },
      data: {
        username,
        email,
      },
    })

    return NextResponse.json({
      id: updatedAdmin.id,
      username: updatedAdmin.username,
      email: updatedAdmin.email,
    })
  } catch (error) {
    console.error("Update admin profile error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
