const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TODOS_TABLE;

module.exports.handler = async (event) => {
  try {
    const todoId = event.pathParameters.id;
    const timestamp = new Date().toISOString();
    const data = JSON.parse(event.body);
    
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
    
    // Update the todo item
    const updateParams = {
      TableName: tableName,
      Key: {
        id: todoId,
        createdAt: todo.createdAt,
      },
      UpdateExpression: 'set #task = :task, completed = :completed, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#task': 'task',
      },
      ExpressionAttributeValues: {
        ':task': data.task || todo.task,
        ':completed': typeof data.completed === 'boolean' ? data.completed : todo.completed,
        ':updatedAt': timestamp,
      },
      ReturnValues: 'ALL_NEW',
    };

    const updateResult = await dynamoDB.update(updateParams).promise();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(updateResult.Attributes),
    };
  } catch (error) {
    console.error(`Error updating todo: ${error.message}`);
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