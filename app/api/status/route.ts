import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { taskId } = await req.json();

    // Bertanya ke Runway mengenai status Task ID ini
    const response = await fetch(`https://api.dev.runwayml.com/v1/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.RUNWAYML_API_SECRET}`,
        'X-Runway-Version': '2024-11-06'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Gagal mengecek status' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data); // Bakal berisi status: "PENDING", "RUNNING", atau "SUCCEEDED"

  } catch (error) {
    console.error('Error Cek Status:', error);
    return NextResponse.json({ error: 'Server Internal Error' }, { status: 500 });
  }
}