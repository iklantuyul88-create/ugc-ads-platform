import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const webhookUrl = 'https://webhook.site/1fb0f473-97fb-4cbe-9dc8-fb9db4f8d2d8';

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      // BAGIAN INI YANG KITA UBAH: Kita tambahkan imageUrl sebagai simulasi balasan
      return NextResponse.json({ 
        success: true, 
        message: 'Data tembus ke Webhook!',
        imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop'
      });
    } else {
      return NextResponse.json({ error: 'Webhook menolak data' }, { status: response.status });
    }
  } catch (error) {
    console.error('Error di backend:', error);
    return NextResponse.json({ error: 'Server Internal Error' }, { status: 500 });
  }
}