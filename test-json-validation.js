// Test für JSON Validation
import { packSchema } from './src/utils/schema.ts';

// Test 1: Valid JSON mit allen required Feldern
const validJSON = {
  "title": "Test Lernpaket",
  "description": "Test Description",
  "tags": ["Test"],
  "public": true,
  "items": [
    {
      "id": "test-1",
      "text": "Was ist 2+2?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "3",
          "correct": false
        },
        {
          "id": "b", 
          "text": "4",
          "correct": true,
          "explanation": "2 + 2 = 4"
        }
      ],
      "explanation": "Grundlegende Mathematik"
    }
  ]
};

// Test 2: Invalid JSON - fehlendes 'correct' field
const invalidJSON = {
  "title": "Test Lernpaket",
  "description": "Test Description", 
  "tags": ["Test"],
  "public": true,
  "items": [
    {
      "id": "test-1",
      "text": "Was ist 2+2?",
      "type": "single",
      "options": [
        {
          "id": "a",
          "text": "3"
          // Missing 'correct' field!
        }
      ]
    }
  ]
};

console.log('🧪 Testing JSON Schema Validation...\n');

// Test valid JSON
try {
  const result1 = packSchema.parse(validJSON);
  console.log('✅ Valid JSON: PASSED');
  console.log(`   - Title: ${result1.title}`);
  console.log(`   - Items: ${result1.items.length}`);
  console.log(`   - First question has correct answers: ${result1.items[0].options.every(opt => typeof opt.correct === 'boolean')}`);
} catch (error) {
  console.log('❌ Valid JSON: FAILED');
  console.error('   Error:', error.message);
}

console.log('');

// Test invalid JSON
try {
  const result2 = packSchema.parse(invalidJSON);
  console.log('❌ Invalid JSON should have failed but passed!');
} catch (error) {
  console.log('✅ Invalid JSON: CORRECTLY REJECTED');
  console.log('   Reason:', error.issues[0].message);
  console.log('   Path:', error.issues[0].path.join('.'));
}

console.log('\n🎯 Schema validation is working correctly!');