const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TODOS_TABLE;

module.exports.handler = async (event) => {
  try {
    // First get all items with the ID (there should be only one)
    const queryResult = await dynamoDB.query({
      TableName: tableName,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': event.pathParameters.id,
      },
    }).promise();

    if (queryResult.Items.length === 0) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ message: 'Todo not found' }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(queryResult.Items[0]),
    };
  } catch (error) {
    console.error(`Error getting todo: ${error.message}`);
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