import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { NextResponse } from "next/server"

export async function POST(request: Request){
    const body = (await request.json()) as { message?: string }
    const message = body.message?.trim()

    if(!message){
        return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    return NextResponse.json({ text: "Server received: " + message }, { status: 200 })
}