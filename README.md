# 💰 FinanceFlow Pro

> A serverless, full-stack finance management application built with React and AWS

[![AWS](https://img.shields.io/badge/AWS-Lambda%20%7C%20DynamoDB%20%7C%20S3-orange)](https://aws.amazon.com/)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)

## 🌟 Live Demo

**Application:** http://financeflow-rav-2026.s3-website-us-east-1.amazonaws.com

---

## 📖 Overview

FinanceFlow Pro is a production-ready serverless finance management application that enables users to track income, expenses, and savings goals with real-time data visualization.

### Key Highlights

- **Serverless Architecture**: Auto-scaling, pay-per-use AWS infrastructure
- **Secure Authentication**: JWT-based auth with bcrypt password hashing  
- **Real-time Data**: Instant sync with AWS DynamoDB
- **Cost Efficient**: $0/month on AWS Free Tier, ~$3/month after
- **Production Ready**: Deployed and accessible 24/7

---

## 🚀 Features

- 🔐 User authentication with JWT tokens (7-day expiration)
- 💵 Income and savings goal tracking
- 📊 Expense management across 8 categories
- 📈 Interactive data visualization (pie charts, bar charts)
- 💰 Investment calculators (SIP & Lumpsum with inflation adjustment)
- 📥 Data export (JSON format)
- 🎯 Real-time savings progress tracking

---

## 🏗️ Architecture

```
Frontend (React/Vite) → S3 Static Hosting
         ↓
   API Gateway (REST)
         ↓
Lambda Functions (7 endpoints)
         ↓
   DynamoDB Tables
```

### AWS Services
- **Lambda**: 7 serverless functions (Node.js 20.x)
- **API Gateway**: REST API with CORS
- **DynamoDB**: 2 tables with on-demand billing
- **S3**: Static website hosting
- **CloudWatch**: Automatic logging

---

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Recharts, Axios  
**Backend:** Node.js 20, Serverless Framework, JWT, bcrypt  
**Database:** AWS DynamoDB (NoSQL)  
**Infrastructure:** AWS Lambda, API Gateway, S3

---

## 📁 Project Structure

```
financeflow-aws/
├── backend/
│   ├── functions/
│   │   ├── auth/          # Registration & login
│   │   ├── expenses/      # CRUD operations
│   │   ├── user/          # Profile management
│   │   └── utils/         # JWT helpers
│   └── serverless.yml     # Infrastructure config
│
└── frontend/
    ├── src/
    │   ├── services/      # API client
    │   └── App.jsx        # Main component
    └── vite.config.js
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- AWS Account
- AWS CLI configured
- Serverless Framework

### Backend Setup

```bash
# Create DynamoDB tables
aws dynamodb create-table --table-name FinanceFlow-Users-dev \
  --attribute-definitions AttributeName=email,AttributeType=S \
  --key-schema AttributeName=email,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST --region us-east-1

aws dynamodb create-table --table-name FinanceFlow-Expenses-dev \
  --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=expenseId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH AttributeName=expenseId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST --region us-east-1

# Deploy backend
cd backend
npm install
export JWT_SECRET="your-secret-key"
serverless deploy
```

### Frontend Setup

```bash
cd frontend
npm install
echo "VITE_API_URL=https://your-api-url.com/dev" > .env
npm run build
aws s3 sync dist/ s3://your-bucket/ --delete
```

---

## 📊 API Endpoints

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/auth/register` | POST | User registration | No |
| `/auth/login` | POST | User login | No |
| `/user/profile` | GET | Get profile | Yes |
| `/user/profile` | PUT | Update profile | Yes |
| `/expenses` | POST | Create expense | Yes |
| `/expenses` | GET | List expenses | Yes |
| `/expenses/{id}` | DELETE | Delete expense | Yes |

---

## 🔐 Security

- bcrypt password hashing (10 rounds)
- JWT authentication (7-day tokens)
- Server-side input validation
- Least-privilege IAM roles
- CORS protection

---

## 💰 Cost

**Free Tier (12 months):** $0/month  
**After Free Tier:** ~$2-3/month (light usage)

- Lambda: $0.50/month
- API Gateway: $1.00/month  
- DynamoDB: $0.50/month (on-demand)
- S3: $0.01/month

---

## 📈 Future Enhancements

- Budget alerts
- Recurring expenses
- Multi-currency support
- PDF reports
- Mobile app (React Native)

---

## 👨‍💻 Author

**[Your Name]**  
• [GitHub](https://github.com/RAV1SHCHAUDHARY)

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Built with React ⚛️ and AWS ☁️

</div>