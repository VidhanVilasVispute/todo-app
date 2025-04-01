const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TODOS_TABLE;

module.exports.handler = async (event) => {
  try {
    const todoId = event.pathParameters.id;
    
    // First query to get the createdAt timestamp for the composite key
    const queryResult = await dynamoDB.query({
      TableName: tableName,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': todoId,
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

    const todo = queryResult.Items[0];
    
    // Delete the todo item
    await dynamoDB.delete({
      TableName: tableName,
      Key: {
        id: todoId,
        createdAt: todo.createdAt,
      },
    }).promise();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Todo deleted successfully' }),
    };
  } catch (error) {
    console.error(`Error deleting todo: ${error.message}`);
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