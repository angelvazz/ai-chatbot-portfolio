# 🤖 AI Chatbot Portfolio

A **modern AI Chatbot application** built as a personal portfolio project to demonstrate **frontend engineering** and **full-stack integration** skills.  
This system consists of two repositories:

- 🖥️ **Frontend:** [`ai-chatbot-portfolio`](https://github.com/angelvazz/ai-chatbot-portfolio) — built with **Next.js**, **TypeScript**, and **TailwindCSS**, delivering a responsive and performant chat interface.
- ⚙️ **Backend:** [`ai-chatbot-portfolio-backend`](https://github.com/angelvazz/ai-chatbot-portfolio-backend) — built with **Node.js** and **Terraform (AWS Lambda + API Gateway)**, exposing REST endpoints for chat message processing.

---

## 🚀 Features

- 💬 **AI Chat Interface** — conversational UI with smooth user input, auto-scroll, and responsive design.
- ⚡ **Real-time Responses** — communicates with a serverless backend to fetch replies from an AI model.
- 🎨 **Frontend-Driven UI/UX** — designed and implemented directly in code to reflect modern SaaS chatbot patterns.
- ☁️ **Serverless Backend** — powered by AWS Lambda for scalability and cost efficiency.
- 🧱 **Infrastructure as Code (IaC)** — Terraform provisions Lambda, API Gateway, and S3 resources automatically.
- 🧩 **Modular Codebase** — clear separation between UI, business logic, and API layer.

---

## 🧰 Tech Stack

### 🖥️ Frontend

- **Framework:** Next.js 14 (App Router) + React 18
- **Language:** TypeScript
- **Styling:** TailwindCSS + PostCSS
- **State Management:** React Hooks + Context API
- **Build Tools:** ESLint, ready for Vercel deployment

### ⚙️ Backend

- **Language:** Node.js (JavaScript)
- **Architecture:** AWS Serverless (Lambda + API Gateway)
- **Infrastructure:** Terraform (`main.tf`, `variables.tf`, `outputs.tf`)
- **CI/CD:** GitHub Actions (optional)
- **Persistence (future):** DynamoDB for conversation logs

---

## 🧩 Architecture Overview

[User]
|
v
[Next.js Frontend]
|
| -> fetch(“https://api-gateway/chat”, { message })
v
[AWS API Gateway]
|
v
[Lambda Chat Service]
|
v
[AI Model / Provider API]

- The **frontend** sends user messages via HTTP POST to the backend endpoint.
- The **backend** validates, processes, and calls the AI model provider.
- The **frontend** displays the AI response dynamically.

---

## 🧑‍💻 Getting Started

### 1️⃣ Clone both repositories

```bash
git clone https://github.com/angelvazz/ai-chatbot-portfolio.git
git clone https://github.com/angelvazz/ai-chatbot-portfolio-backend.git

2️⃣ Frontend Setup
cd ai-chatbot-portfolio
npm install

Create a .env.local file:
NEXT_PUBLIC_API_BASE_URL="https://your-api-gateway-url/chat"

Run locally:
npm run dev

Build for production:
npm run build
npm start
```
