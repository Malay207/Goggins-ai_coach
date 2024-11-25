import database_connect from "@/app/db";
import { UserMeta } from "@/app/model/model";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await database_connect();
    const user = await currentUser();
    if (!user) {
        return NextResponse.json({
            success: false,
            message: "Unothorized user"
        }, { status: 401 });
    }
    const { endpoint, keys } = await request.json();
    if (!endpoint || !keys) {
        return NextResponse.json({
            success: false,
            message: "Invalid request"
        }, { status: 400 });
    }
    const existinguser = await UserMeta.findOne({ userId: user.id });
    try {
        if (existinguser) {
            await UserMeta.findByIdAndUpdate({ userId: user.id }, {
                endpoint: endpoint,
                auth: keys.auth,
                p256dh: keys.p256dh
            }, { new: true })
        }
        else {
            await UserMeta.create({
                userId: user.id,
                endpoint: endpoint,
                auth: keys.auth,
                p256dh: keys.p256dh
            });
            return NextResponse.json({
                success: true,
            }, { status: 200 });
        }

    } catch (error) {
        console.error(error);

        return await NextResponse.json({
            success: false,
            message: "Failed to save user meta"
        }, { status: 500 })
    }
}