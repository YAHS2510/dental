import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  syncGoogleBusinessReviews,
  updateGoogleConfig,
} from "@/lib/reviews-store";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user && session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Forbidden: Clinic Owner (Admin) privileges are required to sync Google Business reviews.",
        },
        { status: 403 }
      );
    }

    let body = {};
    try {
      body = await req.json();
    } catch {
      // Body optional
    }

    const { placeId, businessName, autoApprove } = body as any;

    if (placeId || businessName || typeof autoApprove === "boolean") {
      updateGoogleConfig({
        ...(placeId ? { placeId } : {}),
        ...(businessName ? { businessName } : {}),
        ...(typeof autoApprove === "boolean"
          ? { autoApproveGoogleReviews: autoApprove }
          : {}),
      });
    }

    const syncResult = await syncGoogleBusinessReviews(placeId);

    return NextResponse.json({
      success: true,
      message: `Google Business reviews sync completed. ${syncResult.syncedCount} review(s) imported.`,
      syncedCount: syncResult.syncedCount,
      newReviews: syncResult.newReviews,
    });
  } catch (error) {
    console.error("Error syncing Google Business reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sync Google Business reviews." },
      { status: 500 }
    );
  }
}
