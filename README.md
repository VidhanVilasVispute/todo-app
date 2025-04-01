
# Serverless Todo App

This is a fully functional **Serverless Todo App** built using **AWS Lambda, API Gateway, DynamoDB, and S3** for frontend hosting. The backend is deployed with the **Serverless Framework**, and the frontend is a **React** application.

---

## Project Structure

```
serverless-todo-app/
├── backend/            # Serverless Framework Backend
│   ├── src/handlers    # Lambda function handlers
│   ├── serverless.yml  # Serverless configuration file
│   ├── package.json    # Backend dependencies
│   ├── .env            # Environment variables (optional)
│   ├── README.md       # Documentation
│
├── frontend/           # React Frontend
│   ├── src/            # React components
│   ├── public/         # Static files
│   ├── package.json    # Frontend dependencies
│   ├── README.md       # Documentation
│
├── .gitignore          # Files to ignore in Git
└── README.md           # Project documentation
```

---

## Prerequisites

Ensure you have the following installed:

- ✅ **Node.js** (v18+ recommended)
- ✅ **AWS CLI** (configured with IAM permissions)
- ✅ **Serverless Framework**
- ✅ **GitHub Account** (for code hosting)

---

## Setup Instructions

### **1. Clone the Repository**
```sh
git clone https://github.com/your-username/serverless-todo-app.git
cd serverless-todo-app
```

### **2. Backend Setup**

#### Install Dependencies
```sh
cd backend
npm install
```

#### Update `serverless.yml` with AWS Configurations
Ensure your `serverless.yml` file is properly configured with the necessary IAM permissions, API Gateway settings, and DynamoDB table configuration.

#### Deploy the Backend
```sh
serverless deploy
```
After deployment, note the **ServiceEndpoint** from the console output.

#### Test API Locally
```sh
serverless invoke local --function createTodo --data '{ "body": "{\"task\": \"Test Task\"}" }'
```

#### Test API with CURL
```sh
curl -X POST https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/todos \
     -H "Content-Type: application/json" \
     -d '{"task": "Test Task"}'
```

---

### **3. Frontend Setup**

#### Install Dependencies
```sh
cd ../frontend
npm install
```

#### Update API URL in `src/api/todoApi.js`
```js
const API_URL = 'https://your-api-id.execute-api.us-east-1.amazonaws.com/dev';
```

#### Run Locally
```sh
npm start
```
Open `http://localhost:3000` to test the app.

#### Build Frontend for Deployment
```sh
npm run build
```

---

### **4. Deploy Frontend to S3**

If you're using **S3 + CloudFront** for hosting:
```sh
aws s3 sync build/ s3://serverless-todo-app-dev-frontend --delete
```
To access the app, use your CloudFront distribution URL:
```sh
https://your-cloudfront-id.cloudfront.net
```

---

### **5. Testing & Debugging**

#### Check API Gateway Logs
```sh
aws logs tail /aws/lambda/serverless-todo-app-dev-createTodo --follow
```

#### Check Lambda Execution Logs (CloudWatch)
1. Go to AWS Console → **CloudWatch** → **Logs**
2. Find the log group for `serverless-todo-app-dev-createTodo`
3. Check logs for errors or missing input

#### Check CORS Issues
Ensure your `serverless.yml` file includes:
```yaml
cors: true
```

---

### **6. GitHub Version Control**

#### Initialize Git & Push to GitHub
```sh
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/serverless-todo-app.git
git push -u origin main
```

---

### **7. CI/CD (Optional: GitHub Actions)**

You can automate deployments using **GitHub Actions** by adding a `.github/workflows/deploy.yml` file.

#### Example Workflow:
```yaml
name: Deploy Serverless Todo App

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3
      - name: Install Serverless Framework
        run: npm install -g serverless
      - name: Deploy Backend
        run: |
          cd backend
          serverless deploy
      - name: Deploy Frontend
        run: |
          cd frontend
          npm install
          npm run build
          aws s3 sync build/ s3://serverless-todo-app-dev-frontend --delete
```

---

### **8. Troubleshooting**

| Issue | Possible Cause | Solution |
|--------|----------------------|----------------------|
| API returns `400 (Bad Request)` | Frontend is sending wrong payload | Check **DevTools (F12 → Network Tab)** |
| CORS errors in console | API Gateway CORS not enabled | Add `cors: true` in `serverless.yml` |
| Frontend not updating | Old cache | Clear cache, refresh, or run `aws s3 sync` again |
| Lambda not updating | Deployment issue | Run `serverless deploy` again |
| S3 bucket access denied | Wrong permissions | Update S3 policy to allow public access |

---

### **9. Scaling and Performance**

This application is designed to **scale automatically** with AWS serverless services:

- **AWS Lambda** scales automatically based on incoming requests.
- **DynamoDB** handles millions of requests with low-latency performance.
- **CloudFront** caches static assets globally to reduce latency.

---

### **10. Production Considerations**

For a production deployment, consider the following:

1. **Custom Domain**: Set up a domain for API and frontend.
2. **Authentication**: Add user authentication (e.g., Amazon Cognito).
3. **HTTPS**: Ensure all traffic is encrypted (**CloudFront handles this**).
4. **Database Backups**: Set up **DynamoDB backups**.
5. **Logging & Monitoring**: Configure **CloudWatch alarms**.
6. **CI/CD Pipeline**: Automate deployments with **GitHub Actions**.

---

### **11. Next Steps & Enhancements**

✅ **Add Authentication** (Cognito, Auth0)  
✅ **Enable Logging & Monitoring** (CloudWatch, Sentry)  
✅ **Optimize Frontend Performance** (Lazy Loading, Compression)  
✅ **Use DynamoDB Streams for Real-Time Updates**  

---

### **12. Cleaning Up**

To avoid AWS charges, remove resources when not needed:

#### Remove backend resources
```sh
cd backend
serverless remove
```

#### Remove frontend resources
```sh
aws s3 rm s3://YOUR-BUCKET-NAME --recursive
```
Then, delete the **CloudFormation stack** manually in **AWS Console**.

---

This document outlines the complete setup, deployment, and management of a **Serverless Todo App** using **AWS Lambda, API Gateway, DynamoDB, and React**. 🚀
