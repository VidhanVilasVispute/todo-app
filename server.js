const express = require("express");
const { DynamoDBClient, PutItemCommand, ScanCommand, UpdateItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configure AWS DynamoDB
const client = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });

const TABLE_NAME = "todos";

// ✅ Create a Todo (POST)
app.post("/todo", async (req, res) => {
    const { title, description } = req.body;
    const id = uuidv4();

    const params = {
        TableName: TABLE_NAME,
        Item: {
            id: { S: id }, 
            title: { S: title }, 
            description: { S: description }, 
            completed: { BOOL: false }
        },
    };

    try {
        await client.send(new PutItemCommand(params));
        res.json({ message: "Todo added", id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get All Todos (GET)
app.get("/todos", async (req, res) => {
    const params = { TableName: TABLE_NAME };

    try {
        const data = await client.send(new ScanCommand(params));
        const todos = data.Items.map(item => ({
            id: item.id.S,
            title: item.title.S,
            description: item.description.S,
            completed: item.completed.BOOL
        }));
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Update Todo (PUT)
app.put("/todo/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const params = {
        TableName: TABLE_NAME,
        Key: { id: { S: id } }, 
        UpdateExpression: "SET title = :title, description = :description, completed = :completed",
        ExpressionAttributeValues: {
            ":title": { S: title },
            ":description": { S: description },
            ":completed": { BOOL: completed }
        },
        ReturnValues: "ALL_NEW"
    };

    try {
        const data = await client.send(new UpdateItemCommand(params));
        res.json({ message: "Todo updated", updatedTodo: data.Attributes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Delete Todo (DELETE)
app.delete("/todo/:id", async (req, res) => {
    const { id } = req.params;

    const params = {
        TableName: TABLE_NAME,
        Key: { id: { S: id } }
    };

    try {
        await client.send(new DeleteItemCommand(params));
        res.json({ message: "Todo deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Export the app for AWS Lambda or Local Testing
module.exports = app;

// ✅ If running locally
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}
