import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image_character, prompt_direction } = body;

    // --- 1. FASE SUTRADARA (GEMINI PRO) ---
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    // Rahasia dapur: Memaksa Gemini membuat prompt tingkat industri
    const systemPrompt = `You are an elite cinematographer. Turn this raw idea into a highly detailed, professional prompt for an AI video generator. Focus on locking the facial identity from the reference image. The scene must look like it was shot on an ARRI Alexa LF with an 85mm lens, shallow depth of field, natural soft daylight, and earthy tones color grading. Raw idea: "${prompt_direction}". ONLY output the final English prompt text, no explanations.`;

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }]
      })
    });
    
    const geminiData = await geminiRes.json();
    const enhancedPrompt = geminiData.candidates[0].content.parts[0].text.trim();

    // --- 2. FASE RENDER (RUNWAY API) ---
    // Menggunakan model Gen-3 Alpha untuk image-to-video
    const runwayRes = await fetch('https://api.dev.runwayml.com/v1/image_to_video', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RUNWAYML_API_SECRET}`,
        'X-Runway-Version': '2024-11-06',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        promptImage: image_character, // Foto wajah dikunci sebagai base frame
        promptText: enhancedPrompt,
        model: 'gen3a_turbo' // Mesin tercepat dan terbaik saat ini
      })
    });

    if (!runwayRes.ok) {
      const errorText = await runwayRes.text();
      console.error("Runway Error:", errorText);
      return NextResponse.json({ error: 'Gagal komunikasi dengan mesin render' }, { status: 500 });
    }

    const runwayData = await runwayRes.json();

    // Kita berhasil dapat resi (Task ID) dari Runway!
    return NextResponse.json({ 
      success: true, 
      taskId: runwayData.id,
      finalPrompt: enhancedPrompt
    });

  } catch (error) {
    console.error('Error Backend Utama:', error);
    return NextResponse.json({ error: 'Server Internal Error' }, { status: 500 });
  }
}