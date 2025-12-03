import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { Message } from "@/app/model/model";

const ai = new GoogleGenAI({
    apiKey: "AIzaSyDC3ExHbDyWgbkwSVhnLJbBdFysKa5J6n0",
});
export async function POST(req: Request) {
    const { threadId } = await req.json();

    if (!threadId) {
        return NextResponse.json(
            { success: false, error: "threadId is required" },
            { status: 400 }
        );
    }

    try {
        // 1. Load conversation history from DB
        const history = await Message.find({ threadId }).sort({ date: 1 }).lean();

        // 2. Build contents array for Gemini
        const contents = history.map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: String(m.content) }],
        }));

        // 3. Add system-style instructions at top (Goggins vibe)
        contents.unshift({
            role: "user",
            parts: [
                {
                    text: `
You are "Goggins AI Coach". Speak in an ultra-intense David Goggins style:
- confrontational, no-excuses
- high intensity, "stay hard", "taking souls", etc.
- BUT never encourage unsafe training or ignoring injuries.
- Always push the user but respect safety.
        `.trim(),
                },
            ],
        });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents,
        });

        const text = response.text ?? "";

        if (!text) {
            return NextResponse.json(
                { success: false, error: "Empty response from Gemini" },
                { status: 500 }
            );
        }

        // 4. Save assistant message in DB
        const assistantMsg = await Message.create({
            threadId,
            role: "assistant",
            content: text,
        });

        return NextResponse.json(
            { success: true, message: assistantMsg },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, error: "Gemini error" },
            { status: 500 }
        );
    }
}
