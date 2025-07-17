import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminFromToken, verifyPassword, hashPassword } from "@/lib/auth"

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

    const { currentPassword, newPassword } = await request.json()

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword, admin.password_hash)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword)

    // Update password
    await prisma.admin_users.update({
      where: { id: admin.id },
      data: {
        password_hash: hashedNewPassword,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update password error:", error)
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
  }
}
