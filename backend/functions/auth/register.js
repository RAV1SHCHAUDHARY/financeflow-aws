const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE;
const JWT_SECRET = process.env.JWT_SECRET;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { name, email, password } = JSON.parse(event.body);

    if (!name || !email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'All fields required' })
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `usr_${uuidv4()}`;
    
    const user = {
      email: email.toLowerCase(),
      userId,
      name,
      passwordHash,
      income: 0,          // ADD THIS
      savingsGoal: 0,     // ADD THIS
      createdAt: new Date().toISOString()
    };

    await dynamodb.put({
      TableName: USERS_TABLE,
      Item: user
    }).promise();

    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          token,
          user: { userId, email, name }
        }
      })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};