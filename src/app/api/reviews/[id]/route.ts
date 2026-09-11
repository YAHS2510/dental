import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateReview, deleteReview } from "@/lib/reviews-store";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user && session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Forbidden: Clinic Owner (Admin) privileges are required to manage website reviews.",
        },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await req.json();

    const updated = updateReview(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Review with ID '${id}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Review updated successfully.",
      review: updated,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update review." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user && session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Forbidden: Clinic Owner (Admin) privileges are required to delete reviews.",
        },
        { status: 403 }
      );
    }

    const { id } = params;
    const deleted = deleteReview(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: `Review with ID '${id}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Review '${id}' deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete review." },
      { status: 500 }
    );
  }
}
