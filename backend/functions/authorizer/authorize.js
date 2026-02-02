// backend/functions/authorizer/authorize.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Lambda Authorizer Function
 * Validates JWT tokens for protected endpoints
 */
exports.handler = async (event) => {
  try {
    // Get token from Authorization header
    const token = event.authorizationToken?.replace('Bearer ', '');

    if (!token) {
      throw new Error('No token provided');
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // Return allow policy with user context
    return generatePolicy(decoded.userId, 'Allow', event.methodArn, {
      userId: decoded.userId,
      email: decoded.email
    });

  } catch (error) {
    console.error('Authorization failed:', error.message);
    throw new Error('Unauthorized'); // This will return 401
  }
};

/**
 * Generate IAM policy for API Gateway
 */
function generatePolicy(principalId, effect, resource, context = {}) {
  const authResponse = {
    principalId
  };

  if (effect && resource) {
    authResponse.policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    };
  }

  // Pass user info to Lambda functions
  authResponse.context = context;

  return authResponse;
}