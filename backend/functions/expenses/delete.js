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
    const expenseId = event.pathParameters.id;

    await dynamodb.delete({
      TableName: EXPENSES_TABLE,
      Key: {
        userId,
        expenseId
      }
    }).promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Expense deleted' })
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