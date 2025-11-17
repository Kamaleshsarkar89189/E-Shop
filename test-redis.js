require('dotenv').config();

console.log('Testing Redis configuration...');
console.log('REDIS_DATABASE_URL exists:', !!process.env.REDIS_DATABASE_URL);
console.log('REDIS_DATABASE_URL value:', process.env.REDIS_DATABASE_URL ? '***REDACTED***' : 'NOT SET');

// Test the redis module
try {
  const redis = require('./packages/libs/redis/index.ts');
  console.log('Redis module loaded successfully');
} catch (error) {
  console.error('Error loading redis module:', error.message);
} 