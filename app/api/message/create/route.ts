import { NextResponse } from "next/server";
import { Message } from "@/app/model/model";

export async function POST(req: Request) {
  const { message, threadId, fromUser = "false" } = await req.json();

  console.log("from user", { message, threadId });

  if (!threadId || !message) {
    return NextResponse.json(
      { error: "threadId and message are required", success: false },
      { status: 400 }
    );
  }

  try {
    const newMessage = await Message.create({
      threadId,
      role: fromUser === "true" ? "user" : "assistant",
      content: message,
    });

    return NextResponse.json(
      { message: newMessage, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}
