import { db } from "@/services/firebase";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const courseId = searchParams.get("cid");
    const session = await getServerSession(authOptions);

    if (!courseId) {
      return NextResponse.json(new ApiError(400, "Course ID is required"), {
        status: 400,
      });
    }

    const docRef = doc(db, "courses", courseId);
    const course = await getDoc(docRef);

    if (!course.exists()) {
      return NextResponse.json(new ApiError(404, "Course not found"), {
        status: 404,
      });
    }

    const data = {
      ...course.data(),
      id: course.id,
      isPurchased: false,
    };

    // check if course already bought
    const purchaseRef = collection(db, "purchases");

    const purchases = await getDocs(
      query(
        purchaseRef,
        where("purchasedBy", "==", session?.user.id),
        where("courseId", "==", courseId)
      )
    );

    if (purchases.docs.length > 0) {
      data.isPurchased = true;
    }

    return NextResponse.json(new ApiSuccess(200, "Course found", data), {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(new ApiError(500, "Internal Server Error"), {
      status: 500,
    });
  }
}
