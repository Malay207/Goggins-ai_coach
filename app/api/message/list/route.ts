import { NextResponse } from "next/server";
import { Message } from "@/app/model/model";

export async function POST(req: Request) {
  const { threadId } = await req.json();

  if (!threadId) {
    return NextResponse.json(
      { error: "threadId is required", success: false },
      { status: 400 }
    );
  }

  try {
    const messages = await Message.find({ threadId })
      .sort({ date: 1 })
      .lean();

    return NextResponse.json(
      { messages, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}
