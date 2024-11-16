import { Challengepreferences } from "@/app/model/model";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const user = currentUser();
    if (!user) {
        return NextResponse.json({ success: false, message: "Unothorised user" }, { status: 401 });
    }
    const { _Id, ChallengeId, pushnotifications } = await request.json();
    if (pushnotifications === undefined || !_Id || !ChallengeId) {
        return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    }
    try {
        const data = await Challengepreferences.findByIdAndUpdate(_Id, {
            $set: { pushnotifications: pushnotifications, ChallengeId: ChallengeId },
        }, { new: true });
        return NextResponse.json({ success: true, data }, { status: 200 });


    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });

    }
}