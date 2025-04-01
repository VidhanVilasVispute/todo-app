const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TODOS_TABLE;

module.exports.handler = async (event) => {
  try {
    const result = await dynamoDB.scan({
      TableName: tableName,
    }).promise();

    // Sort todos by createdAt (newest first)
    const todos = result.Items.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(todos),
    };
  } catch (error) {
    console.error(`Error listing todos: ${error.message}`);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};