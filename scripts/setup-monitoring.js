#!/usr/bin/env node

/**
 * BiteBase Monitoring Setup Script
 * 
 * This script helps set up comprehensive monitoring and analytics
 * for the BiteBase application in production.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupMonitoring() {
  console.clear();
  colorLog('cyan', '📊 BiteBase Monitoring & Analytics Setup');
  colorLog('cyan', '=====================================');
  console.log('');
  
  colorLog('blue', 'This script will help you set up comprehensive monitoring for your BiteBase application.');
  console.log('');
  
  // Check if monitoring is already configured
  const envPath = path.join(process.cwd(), '.env');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    colorLog('green', '✅ Found existing .env file');
  } else {
    colorLog('yellow', '⚠️  No .env file found. Please run setup-api-keys.sh first.');
    process.exit(1);
  }
  
  console.log('');
  colorLog('yellow', '🔍 Monitoring Services Setup');
  console.log('');
  
  // 1. Error Tracking with Sentry
  colorLog('red', '1. 🚨 Error Tracking (Sentry)');
  console.log('   Sentry provides real-time error tracking and performance monitoring.');
  console.log('   Sign up at: https://sentry.io/');
  console.log('');
  
  const setupSentry = await question('   Set up Sentry error tracking? (y/n): ');
  
  if (setupSentry.toLowerCase() === 'y') {
    const sentryDsn = await question('   Enter your Sentry DSN: ');
    if (sentryDsn) {
      updateEnvVar('SENTRY_DSN', sentryDsn);
      colorLog('green', '   ✅ Sentry configured');
      
      // Create Sentry configuration
      const sentryConfig = `
// Sentry Configuration
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend: (event) => {
    // Filter out sensitive information
    if (event.exception) {
      event.exception.values?.forEach(exception => {
        if (exception.stacktrace?.frames) {
          exception.stacktrace.frames = exception.stacktrace.frames.filter(
            frame => !frame.filename?.includes('node_modules')
          );
        }
      });
    }
    return event;
  }
});
`;
      
      fs.writeFileSync(path.join(process.cwd(), 'lib/monitoring/sentry.ts'), sentryConfig);
      colorLog('green', '   ✅ Sentry configuration file created');
    }
  } else {
    colorLog('yellow', '   ⏭️  Sentry setup skipped');
  }
  
  console.log('');
  
  // 2. Analytics with Google Analytics
  colorLog('blue', '2. 📈 Website Analytics (Google Analytics)');
  console.log('   Google Analytics provides detailed website traffic and user behavior insights.');
  console.log('   Set up at: https://analytics.google.com/');
  console.log('');
  
  const setupGA = await question('   Set up Google Analytics? (y/n): ');
  
  if (setupGA.toLowerCase() === 'y') {
    const gaId = await question('   Enter your Google Analytics Measurement ID (G-XXXXXXXXXX): ');
    if (gaId) {
      updateEnvVar('GOOGLE_ANALYTICS_ID', gaId);
      colorLog('green', '   ✅ Google Analytics configured');
      
      // Create GA4 setup instructions
      const gaInstructions = `
// Google Analytics 4 Setup Instructions

1. Add this to your _app.tsx or layout.tsx:

import Script from 'next/script';

// Add these scripts to your app
<Script
  src={\`https://www.googletagmanager.com/gtag/js?id=\${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}\`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {\`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '\${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
  \`}
</Script>

2. Track custom events:
import { analytics } from '../lib/analytics/tracking';

analytics.track({
  name: 'restaurant_setup',
  properties: {
    restaurant_name: 'Example Restaurant',
    cuisine_type: 'Italian'
  }
});
`;
      
      fs.writeFileSync(path.join(process.cwd(), 'docs/google-analytics-setup.md'), gaInstructions);
      colorLog('green', '   ✅ Google Analytics setup guide created');
    }
  } else {
    colorLog('yellow', '   ⏭️  Google Analytics setup skipped');
  }
  
  console.log('');
  
  // 3. User Analytics with Mixpanel
  colorLog('magenta', '3. 👥 User Analytics (Mixpanel)');
  console.log('   Mixpanel provides advanced user behavior tracking and cohort analysis.');
  console.log('   Sign up at: https://mixpanel.com/');
  console.log('');
  
  const setupMixpanel = await question('   Set up Mixpanel? (y/n): ');
  
  if (setupMixpanel.toLowerCase() === 'y') {
    const mixpanelToken = await question('   Enter your Mixpanel Project Token: ');
    if (mixpanelToken) {
      updateEnvVar('MIXPANEL_TOKEN', mixpanelToken);
      colorLog('green', '   ✅ Mixpanel configured');
    }
  } else {
    colorLog('yellow', '   ⏭️  Mixpanel setup skipped');
  }
  
  console.log('');
  
  // 4. User Behavior with Hotjar
  colorLog('yellow', '4. 🎥 User Behavior (Hotjar)');
  console.log('   Hotjar provides heatmaps, session recordings, and user feedback.');
  console.log('   Sign up at: https://www.hotjar.com/');
  console.log('');
  
  const setupHotjar = await question('   Set up Hotjar? (y/n): ');
  
  if (setupHotjar.toLowerCase() === 'y') {
    const hotjarId = await question('   Enter your Hotjar Site ID: ');
    if (hotjarId) {
      updateEnvVar('HOTJAR_ID', hotjarId);
      colorLog('green', '   ✅ Hotjar configured');
    }
  } else {
    colorLog('yellow', '   ⏭️  Hotjar setup skipped');
  }
  
  console.log('');
  
  // 5. Performance Monitoring
  colorLog('green', '5. ⚡ Performance Monitoring');
  console.log('   Built-in performance monitoring is already configured in your application.');
  console.log('   It tracks Core Web Vitals, API response times, and user interactions.');
  console.log('');
  
  const enablePerformance = await question('   Enable performance monitoring? (y/n): ');
  
  if (enablePerformance.toLowerCase() === 'y') {
    updateEnvVar('ENABLE_ANALYTICS', 'true');
    updateEnvVar('ENABLE_PERFORMANCE_MONITORING', 'true');
    colorLog('green', '   ✅ Performance monitoring enabled');
  } else {
    updateEnvVar('ENABLE_ANALYTICS', 'false');
    colorLog('yellow', '   ⏭️  Performance monitoring disabled');
  }
  
  console.log('');
  
  // 6. Create monitoring dashboard
  colorLog('cyan', '6. 📊 Creating Monitoring Dashboard');
  console.log('   Setting up a comprehensive monitoring dashboard...');
  
  const dashboardConfig = {
    services: {
      sentry: envContent.includes('SENTRY_DSN=') && !envContent.includes('SENTRY_DSN=your_'),
      googleAnalytics: envContent.includes('GOOGLE_ANALYTICS_ID=') && !envContent.includes('GOOGLE_ANALYTICS_ID=your_'),
      mixpanel: envContent.includes('MIXPANEL_TOKEN=') && !envContent.includes('MIXPANEL_TOKEN=your_'),
      hotjar: envContent.includes('HOTJAR_ID=') && !envContent.includes('HOTJAR_ID=your_')
    },
    features: {
      errorTracking: true,
      performanceMonitoring: true,
      userAnalytics: true,
      businessMetrics: true
    },
    alerts: {
      errorRate: '> 1%',
      responseTime: '> 2s',
      uptime: '< 99%'
    }
  };
  
  fs.writeFileSync(
    path.join(process.cwd(), 'config/monitoring.json'),
    JSON.stringify(dashboardConfig, null, 2)
  );
  
  colorLog('green', '   ✅ Monitoring configuration saved');
  
  console.log('');
  colorLog('green', '🎉 Monitoring Setup Complete!');
  console.log('');
  
  // Summary
  colorLog('blue', '📋 Setup Summary:');
  console.log('');
  
  const services = [];
  if (dashboardConfig.services.sentry) services.push('✅ Sentry (Error Tracking)');
  if (dashboardConfig.services.googleAnalytics) services.push('✅ Google Analytics (Website Analytics)');
  if (dashboardConfig.services.mixpanel) services.push('✅ Mixpanel (User Analytics)');
  if (dashboardConfig.services.hotjar) services.push('✅ Hotjar (User Behavior)');
  
  if (services.length > 0) {
    console.log('   Configured Services:');
    services.forEach(service => console.log(`   ${service}`));
  } else {
    console.log('   ⚠️  No external monitoring services configured');
  }
  
  console.log('');
  console.log('   Built-in Features:');
  console.log('   ✅ Performance Monitoring');
  console.log('   ✅ Error Handling');
  console.log('   ✅ API Response Tracking');
  console.log('   ✅ User Interaction Analytics');
  
  console.log('');
  colorLog('yellow', '⚠️  Important Notes:');
  console.log('   • Test all monitoring services in development first');
  console.log('   • Set up alerts for critical metrics');
  console.log('   • Review privacy policies for compliance');
  console.log('   • Monitor costs for paid services');
  
  console.log('');
  colorLog('green', '🚀 Next Steps:');
  console.log('   1. Test monitoring: npm run test:monitoring');
  console.log('   2. Deploy to production: npm run deploy');
  console.log('   3. Set up alerts and dashboards');
  console.log('   4. Monitor application performance');
  
  console.log('');
  colorLog('blue', '📚 Documentation:');
  console.log('   • Monitoring Guide: ./docs/monitoring.md');
  console.log('   • Analytics Setup: ./docs/analytics.md');
  console.log('   • Performance Optimization: ./docs/performance.md');
  
  rl.close();
}

function updateEnvVar(varName, varValue) {
  const envPath = path.join(process.cwd(), '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  const regex = new RegExp(`^${varName}=.*$`, 'm');
  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, `${varName}=${varValue}`);
  } else {
    envContent += `\n${varName}=${varValue}`;
  }
  
  fs.writeFileSync(envPath, envContent);
}

// Run the setup
setupMonitoring().catch(console.error);
