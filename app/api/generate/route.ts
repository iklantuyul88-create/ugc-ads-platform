import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Menangkap data dari frontend Vercel lo
    const body = await req.json();

    // URL Webhook lo ditaruh di server agar aman
    const webhookUrl = 'https://webhook.site/1fb0f473-97fb-4cbe-9dc8-fb9db4f8d2d8';

    // Meneruskan data ke Webhook secara server-to-server (Bypass CORS)
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      return NextResponse.json({ success: true, message: 'Data tembus ke Webhook!' });
    } else {
      return NextResponse.json({ error: 'Webhook menolak data' }, { status: response.status });
    }
  } catch (error) {
    console.error('Error di backend:', error);
    return NextResponse.json({ error: 'Server Internal Error' }, { status: 500 });
  }
}