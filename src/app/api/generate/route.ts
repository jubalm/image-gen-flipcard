import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(req: NextRequest) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL,
    })
    // defaults model to 'black-forest-labs/FLUX.1-schnell' if not provided
    const { prompt, size } = await req.json()
    if (!prompt || !size) {
      return NextResponse.json({ error: "Missing prompt, model, or size" }, { status: 400 })
    }
    // Call the image generation endpoint
    let response
    try {
      const config: Parameters<typeof openai.images.generate>[0] = {
        model: 'black-forest-labs/FLUX.1-schnell',
        prompt,
        n: 1,
        size,
        response_format: "b64_json"
      }

      response = await openai.images.generate(config)
    } catch (apiError) {
      console.error('Image generation API error:', apiError)
      return NextResponse.json({ error: 'Image generation API error', details: apiError instanceof Error ? apiError.message : apiError }, { status: 500 })
    }
    const imageUrl = response.data && response.data[0]?.b64_json
    if (!imageUrl) {
      return NextResponse.json({ error: "No image returned", details: response }, { status: 500 })
    }
    return NextResponse.json({ imageUrl })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 })
  }
}
