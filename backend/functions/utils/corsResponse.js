// functions/utils/corsResponse.js
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Content-Type': 'application/json'
};

module.exports.success = (data, statusCode = 200) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify(data)
});

module.exports.error = (message, statusCode = 500) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify({ error: message })
});

module.exports.handleOptions = () => ({
  statusCode: 200,
  headers: corsHeaders,
  body: ''
});
