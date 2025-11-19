// CORS Test Script
// Run this with: node test-cors.js

console.log('\n🔍 CORS Configuration Diagnostics\n');
console.log('=' .repeat(50));

// Check environment variables
console.log('\n📋 Environment Variables:');
console.log(`   PORT: ${process.env.PORT || '5000 (default)'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'undefined (will use development mode)'}`);
console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL || 'not set'}`);
console.log(`   CORS_ORIGIN: ${process.env.CORS_ORIGIN || 'not set'}`);
console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Not set'}`);
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '⚠️  Using default (not secure for production)'}`);

// Check if production mode
const isProduction = process.env.NODE_ENV === 'production';
console.log(`\n🔒 Mode: ${isProduction ? '🔴 PRODUCTION' : '🟢 DEVELOPMENT'}`);

// Show what origins will be allowed
console.log('\n✅ Allowed Origins:');
if (!isProduction) {
  console.log('   • All http://localhost:* origins');
  console.log('   • All http://127.0.0.1:* origins');
  console.log('   • http://localhost:5173 (explicit)');
  console.log('   • http://localhost:5174 (explicit)');
  console.log('   • http://localhost:3000 (explicit)');
} else {
  console.log('   • http://localhost:5173');
  console.log('   • http://localhost:5174');
  console.log('   • http://localhost:3000');
  if (process.env.FRONTEND_URL) {
    console.log(`   • ${process.env.FRONTEND_URL}`);
  }
  if (process.env.CORS_ORIGIN) {
    console.log(`   • ${process.env.CORS_ORIGIN}`);
  }
  if (!process.env.FRONTEND_URL && !process.env.CORS_ORIGIN) {
    console.log('   ⚠️  No production origins configured!');
  }
}

// Test CORS function
console.log('\n🧪 Testing CORS Function:');
const testOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://example.com'
];

testOrigins.forEach(origin => {
  // Simulate the CORS logic
  let allowed = false;
  
  if (!isProduction) {
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      allowed = true;
    }
  }
  
  const allowedList = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGIN
  ].filter(Boolean);
  
  if (allowedList.includes(origin)) {
    allowed = true;
  }
  
  console.log(`   ${allowed ? '✅' : '❌'} ${origin}`);
});

// Recommendations
console.log('\n💡 Recommendations:');
if (!process.env.DATABASE_URL) {
  console.log('   ⚠️  Set DATABASE_URL in your .env file');
}
if (isProduction && !process.env.FRONTEND_URL) {
  console.log('   ⚠️  Set FRONTEND_URL for production deployment');
}
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key-change-in-production') {
  console.log('   ⚠️  Set a strong JWT_SECRET in production');
}

console.log('\n✅ To fix CORS issues:');
console.log('   1. Make sure .env file exists with NODE_ENV=development');
console.log('   2. Restart your backend server');
console.log('   3. Check frontend is running on http://localhost:5173');
console.log('   4. Check browser console for specific CORS error');

console.log('\n' + '='.repeat(50) + '\n');

