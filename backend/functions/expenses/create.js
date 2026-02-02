const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
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
    const { description, amount, category, date } = JSON.parse(event.body);

    if (!description || !amount || !category || !date) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'All fields required' })
      };
    }

    const expense = {
      userId,
      expenseId: `exp_${uuidv4()}`,
      description,
      amount: parseFloat(amount),
      category,
      date,
      createdAt: new Date().toISOString()
    };

    await dynamodb.put({
      TableName: EXPENSES_TABLE,
      Item: expense
    }).promise();

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ success: true, data: expense })
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