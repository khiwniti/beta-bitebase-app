import { NextRequest, NextResponse } from 'next/server';

const AI_AGENT_URL = 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the request to the AI agent
    const response = await fetch(`${AI_AGENT_URL}/api/market/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`AI Agent responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('AI Agent proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to AI agent' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Health check proxy
    const response = await fetch(`${AI_AGENT_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`AI Agent health check failed: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('AI Agent health check error:', error);
    return NextResponse.json(
      { error: 'AI agent unavailable' },
      { status: 503 }
    );
  }
}