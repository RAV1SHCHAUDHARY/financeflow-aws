const AWS = require('aws-sdk');
const { getUserFromToken } = require('../utils/auth');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const EXPENSES_TABLE = process.env.EXPENSES_TABLE;

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
    const { userId } = getUserFromToken(event);

    const result = await dynamodb.query({
      TableName: EXPENSES_TABLE,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, data: { expenses: result.Items } })
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