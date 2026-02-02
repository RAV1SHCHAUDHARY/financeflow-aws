const AWS = require('aws-sdk');
const { getUserFromToken } = require('../utils/auth');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE;

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
    const { email } = getUserFromToken(event);

    const result = await dynamodb.get({
      TableName: USERS_TABLE,
      Key: { email }
    }).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ success: false, error: 'User not found' })
      };
    }

    const { passwordHash, ...user } = result.Item;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, data: user })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.message === 'Invalid token' ? 401 : 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};