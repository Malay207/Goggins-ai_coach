import { NextResponse } from "next/server";
import webPush from "web-push"

webPush.setVapidDetails(
    "mailto:malaydev207@gmail.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
    process.env.VAPID_PRIVATE_KEY as string);
export async function POST(request: Request) {
    const { subscription, message } = await request.json();

    try {
        await webPush.sendNotification(subscription, message);
        return NextResponse.json({ success: true, message: "Message sent successfully" }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Error for sending message" }, { status: 500 });

    }
}