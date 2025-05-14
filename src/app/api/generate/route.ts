import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Set this in your environment variables
  baseURL: process.env.OPENAI_BASE_URL, // Set this to your Blackforestlabs endpoint
})

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()
    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 })
    }
    // Call the image generation endpoint
    const response = await openai.images.generate({
      model: 'black-forest-labs/FLUX.1-schnell',
      prompt,
      n: 1,
      size: "512x512",
    })
    const imageUrl = response.data && response.data[0]?.url
    if (!imageUrl) {
      return NextResponse.json({ error: "No image returned" }, { status: 500 })
    }
    return NextResponse.json({ imageUrl })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 })
  }
}
