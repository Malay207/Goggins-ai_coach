import { User, Challengepreferences, UserMeta } from "@/app/model/model";
import axios from "axios";
import { NextResponse } from "next/server";
import OpenAI from "openai";

interface UserThreadType {
    ThreadId: string,
    UserId: string,
    date: string
}
interface UserMetaType {
    endpoint: string,
    userId: string,
    p256dh: string,
    auth: string,
    date: string
}

interface UserThreadMap {
    [userId: string]: UserThreadType;
}


interface UserMetaMap {
    [userId: string]: UserMetaType;
}

export async function POST(request: Request) {
    // Validation
    const body = await request.json();

    const { ChallengeId, secret } = body;

    if (!ChallengeId || !secret) {
        return NextResponse.json(
            { success: false, message: "Missing required fields" },
            {
                status: 400,
            }
        );
    }

    if (secret !== process.env.APP_SECRET_KEY) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            {
                status: 401,
            }
        );
    }

    // Define work out message prompt
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: `
        Generate an ultra-intense, hard-hitting motivational message, followed by a concise, bullet-pointed, no-equipment-needed workout plan. The time of day provided should be taken into account. This output should strictly contain two parts: first, a motivational message in the style of David Goggins, as depicted in Jesse Itzler's 'Living with a SEAL', but even more extreme. The message must be direct, confrontational, and incorporate Goggins' known phrases like 'poopy pants', 'stay hard', and 'taking souls'. The second part should be a workout list: intense, high-impact exercises that can be done anywhere, designed to be completed within 10 minutes. The output must only include these two components, nothing else.
        
        Here's an example output that you should follow:
        
        Time to get hard! No more excuses, no more poopy pants attitude. You're stronger than you think. Stay hard, take souls, and crush this morning with everything you've got. You have 10 minutes to obliterate this workout. This is your battlefield, and you're the warrior. Let's make every second count!
        
        - 30 Burpees – explode with every jump
        - 40 Jumping Jacks – faster, push your limits
        - 50 Mountain Climbers – relentless pace
        - 60 High Knees – drive them up with fury
        - 2 Minute Plank – solid and unyielding
        `,
        },
        {
            role: "user",
            content: `Generate a new David Goggins workout. Remember, only respond in the format specifed earlier. Nothing else`,
        },
    ];

    //  Use OpenAI to generate work out
    const { data: { message, success }, } = await axios.post<{ message?: string; success: boolean }>(`${process.env.NEXT_PUBLIC_BASE_URL}/api/openai`,
        {
            messages,
            secret: process.env.APP_SECRET_KEY,
        }
    );

    if (!message || !success) {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong with generate openai response",
            },
            {
                status: 500,
            }
        );
    }


    // Grab all challenge preferences
    const challengePreferences = await Challengepreferences.find({ ChallengeId });

    console.log("challengePreferences", challengePreferences);

    const userIds = challengePreferences.map((cp) => cp.UserId);

    // console.log("userIds", userIds);

    //  Grab all user threads
    const userThreads = await User.find({
        UserId: { $in: userIds }
    });

    // console.log("userThreads", userThreads);

    // Grab all user metadata
    const userMetas = await UserMeta.find({
        userId: { $in: userIds },
    });

    // console.log("userMetas", userMetas);

    const userThreadMap: UserThreadMap = userThreads.reduce((map, thread) => {
        map[thread.UserId] = thread;
        return map;
    }, {} as UserThreadMap);

    const userMetaMap = userMetas.reduce((map, meta) => {
        map[meta.userId] = meta;
        return map;
    }, {} as UserMetaMap);

    // Add messages to threads
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const threadAndNotificationsPromises: Promise<any>[] = [];

    try {
        challengePreferences.forEach((cp) => {
            //  FIND THE RESPECTIVE USER
            const userThread = userThreadMap[cp.UserId];

            //  ADD MESSAGE TO THREAD
            if (userThread) {
                // Send Message
                threadAndNotificationsPromises.push(
                    axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/message/create`, {
                        message,
                        threadId: userThread.ThreadId,
                        fromUser: "false",
                    })
                );

                // Send Notification
                if (cp.sendNotifications) {
                    const correspondingUserMeta = userMetaMap[cp.userId];
                    threadAndNotificationsPromises.push(
                        axios.post(
                            `${process.env.NEXT_PUBLIC_BASE_URL}/api/send-notifications`,
                            {
                                subscription: {
                                    endpoint: correspondingUserMeta.endpoint,
                                    keys: {
                                        auth: correspondingUserMeta.auth,
                                        p256dh: correspondingUserMeta.p256dh,
                                    },
                                },
                                message,
                            }
                        )
                    );
                }
            }
        });

        await Promise.all(threadAndNotificationsPromises);

        return NextResponse.json({ message }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Something went wrong" },
            {
                status: 500,
            }
        );
    }
}