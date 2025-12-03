import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import database_connect from "@/app/db";
import { User } from "@/app/model/model";

export async function GET() {
  const current_user = await currentUser();
  if (!current_user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized user" },
      { status: 401 }
    );
  }

  try {
    await database_connect();

    // 1. Find existing thread belonging to this user
    let user_thread = await User.findOne({ UserId: current_user.id });

    // 2. If no thread exists → create one
    if (!user_thread) {
      user_thread = new User({
        UserId: current_user.id,
        ThreadId: crypto.randomUUID(), // replace OpenAI thread with your own ID
      });

      await user_thread.save();
      return NextResponse.json(
        { userThread: user_thread, success: true },
        { status: 201 }
      );
    }

    // 3. Return the existing one
    return NextResponse.json(
      { userThread: user_thread, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
