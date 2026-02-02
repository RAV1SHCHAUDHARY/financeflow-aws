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
    const updates = JSON.parse(event.body);
    
    const { name, income, savingsGoal } = updates;

    let updateExpression = 'SET updatedAt = :updatedAt';
    const expressionAttributeValues = {
      ':updatedAt': new Date().toISOString()
    };

    if (name !== undefined) {
      updateExpression += ', #name = :name';
      expressionAttributeValues[':name'] = name;
    }

    if (income !== undefined) {
      updateExpression += ', income = :income';
      expressionAttributeValues[':income'] = parseFloat(income) || 0;
    }

    if (savingsGoal !== undefined) {
      updateExpression += ', savingsGoal = :savingsGoal';
      expressionAttributeValues[':savingsGoal'] = parseFloat(savingsGoal) || 0;
    }

    const params = {
      TableName: USERS_TABLE,
      Key: { email },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    if (name !== undefined) {
      params.ExpressionAttributeNames = { '#name': 'name' };
    }

    const result = await dynamodb.update(params).promise();

    const { passwordHash, ...user } = result.Attributes;

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