/**
 * BiteBase Agent Adapter with Mock Services
 * 
 * This script starts both the mock services and the agent adapter
 * for easier testing in development environments.
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting BiteBase Agent Adapter with Mock Services...');

// Start the mock services
const mockServer = spawn('node', ['mock-server.js'], {
  cwd: __dirname,
  stdio: 'pipe'
});

console.log('⏳ Starting mock services...');

// Handle mock server output
mockServer.stdout.on('data', (data) => {
  const output = data.toString().trim();
  const lines = output.split('\n');
  lines.forEach(line => {
    console.log(`📡 [Mock] ${line}`);
  });
});

mockServer.stderr.on('data', (data) => {
  console.error(`❌ [Mock Error] ${data}`);
});

mockServer.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Mock server process exited with code ${code}`);
  }
});

// Wait for mock services to start
setTimeout(() => {
  // Start the agent adapter
  const adapterProcess = spawn('node', ['agent-adapter.js'], {
    cwd: __dirname,
    stdio: 'pipe',
    env: {
      ...process.env,
      AGENT_FASTAPI_URL: 'http://localhost:8001',
      AGENT_GATEWAY_URL: 'http://localhost:5000'
    }
  });

  console.log('⏳ Starting agent adapter...');

  // Handle adapter output
  adapterProcess.stdout.on('data', (data) => {
    const output = data.toString().trim();
    const lines = output.split('\n');
    lines.forEach(line => {
      console.log(`🔌 [Adapter] ${line}`);
    });
  });

  adapterProcess.stderr.on('data', (data) => {
    console.error(`❌ [Adapter Error] ${data}`);
  });

  adapterProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Agent adapter process exited with code ${code}`);
    }
    // Kill the mock server when adapter exits
    mockServer.kill();
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('👋 Shutting down services...');
    adapterProcess.kill();
    mockServer.kill();
    process.exit(0);
  });

  // Run example client after a delay to allow services to fully start
  setTimeout(() => {
    console.log('🧪 Running test requests...');
    
    const exampleClient = spawn('node', ['example-client.js'], {
      cwd: __dirname,
      stdio: 'pipe'
    });

    exampleClient.stdout.on('data', (data) => {
      const output = data.toString().trim();
      const lines = output.split('\n');
      lines.forEach(line => {
        console.log(`🔍 [Client] ${line}`);
      });
    });

    exampleClient.stderr.on('data', (data) => {
      console.error(`❌ [Client Error] ${data}`);
    });
  }, 2000);

}, 1000);

console.log('ℹ️ Press Ctrl+C to stop all services'); 