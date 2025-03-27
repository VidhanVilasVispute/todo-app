# Todo App

## Overview
This is a simple **Todo App** built with **Node.js, Express, and AWS DynamoDB**. The application allows users to **add, view, edit, and delete todos**.

## Features
- ✅ Add new todos
- 📜 View all todos
- ✏ Edit existing todos
- ❌ Delete todos
- 🌍 REST API integration
- 🛢 Data stored in **AWS DynamoDB**

---

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript (Fetch API)
- **Backend**: Node.js, Express.js
- **Database**: AWS DynamoDB
- **Hosting**: AWS Lambda (Deployment later)

---

## Project Setup
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/VidhanVilasVispute/todo-app.git
cd todo-app
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Environment Variables
Create a **.env** file and add the following:
```env
AWS_REGION=us-east-1
PORT=3000
```

### 4️⃣ Run the App Locally
```sh
node server.js
```
The server will start on **http://localhost:3000**.

---

## API Endpoints
### 🔹 Add a Todo
```http
POST /todo
```
**Request Body:**
```json
{
  "title": "Sample Todo",
  "description": "This is a test todo"
}
```

### 🔹 Get All Todos
```http
GET /todos
```

### 🔹 Edit a Todo
```http
PUT /todo/:id
```
**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "completed": true
}
```

### 🔹 Delete a Todo
```http
DELETE /todo/:id
```

---

## Deployment (Later)
- AWS Lambda (Serverless)
- API Gateway
- More others tech and tools

