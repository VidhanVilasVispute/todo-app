const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TODOS_TABLE;

module.exports.handler = async (event) => {
  try {
    const timestamp = new Date().toISOString();
    const data = JSON.parse(event.body);
    
    if (!data.task) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ message: 'Task content is required' }),
      };
    }

    const todoItem = {
      id: uuidv4(),
      task: data.task,
      completed: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await dynamoDB.put({
      TableName: tableName,
      Item: todoItem,
    }).promise();

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(todoItem),
    };
  } catch (error) {
    console.error(`Error creating todo: ${error.message}`);
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