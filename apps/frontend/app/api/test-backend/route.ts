import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test backend health endpoint
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:12001';
    
    console.log(`Testing backend connection to: ${backendUrl}`);
    
    const healthResponse = await fetch(`${backendUrl}/health`);
    const healthData = await healthResponse.json();
    
    const restaurantsResponse = await fetch(`${backendUrl}/api/restaurants`);
    const restaurantsData = await restaurantsResponse.json();
    
    const analysesResponse = await fetch(`${backendUrl}/api/market-analyses`);
    const analysesData = await analysesResponse.json();
    
    return NextResponse.json({
      success: true,
      backend_url: backendUrl,
      health: healthData,
      restaurants_count: restaurantsData.restaurants?.length || 0,
      analyses_count: analysesData.analyses?.length || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}