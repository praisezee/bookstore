import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const admin = await prisma.admin_users.findUnique({
      where: { username },
    })

    if (!admin || !(await verifyPassword(password, admin.password_hash))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = generateToken(admin.id)

    return NextResponse.json({ token, admin: { id: admin.id, username: admin.username, email: admin.email } })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
