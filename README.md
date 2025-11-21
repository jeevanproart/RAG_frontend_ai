# Deep Research AI - Frontend 🚀

> Multi-Agent Research Assistant powered by LangGraph and Google Gemini

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge)](https://rag-frontend-ai.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-HuggingFace-yellow?style=for-the-badge)](https://jeevzz-deep-research-ai.hf.space)

---

## 🌟 Live Demo

**Frontend:** [https://rag-frontend-ai.vercel.app](https://rag-frontend-ai.vercel.app)

**Backend API:** [https://jeevzz-deep-research-ai.hf.space](https://jeevzz-deep-research-ai.hf.space)

---

## 📖 About

This is the frontend interface for **Deep Research AI**, an intelligent research assistant that uses a multi-agent architecture to:

- 🔬 Conduct deep research with automated task decomposition
- 🎥 Analyze YouTube videos and generate viral titles
- 📝 Summarize long content with one click
- 📄 Process and query uploaded documents (PDFs, text files)

Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Clerk Authentication**.

---

## ✨ Features

### 🎯 Landing Page
- Stunning gradient hero section
- Feature cards with glassmorphism effects
- Responsive design (mobile to desktop)
- Professional color scheme

### 💬 Chat Interface
- Real-time AI responses
- Thinking process visualization
- Message history
- File upload support
- Markdown rendering

### 📝 Smart Summarizer
- Auto-detects long responses (>500 chars)
- One-click summary generation
- Toggle between summary and full content
- Efficient caching

### 🔐 Authentication
- Powered by Clerk
- Secure sign-in/sign-up
- User profile management
- Protected routes

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Clerk
- **Icons:** Lucide React
- **Deployment:** Vercel

### Backend Integration
- **API:** FastAPI (HuggingFace Spaces)
- **AI:** Google Gemini 2.0 Flash
- **Orchestration:** LangGraph
- **Vector Store:** ChromaDB

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Clerk account ([Get one free](https://clerk.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jeevanproart/RAG_frontend_ai.git
   cd RAG_frontend_ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=https://jeevzz-deep-research-ai.hf.space
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 📁 Project Structure

```
frontend/
├── app/                   # Next.js App Router
│   ├── layout.tsx        # Root layout with Clerk
│   └── page.tsx          # Landing page
├── components/           # React components
│   ├── ChatInterface.tsx # Main chat UI
│   └── Providers.tsx     # Clerk provider wrapper
├── lib/                  # Utilities
│   └── utils.ts          # Helper functions
├── public/               # Static assets
└── next.config.ts        # Next.js configuration
```

---

## 🎨 Key Features Implementation

### Landing Page
- Gradient text effects with `bg-clip-text`
- Responsive grid layout for feature cards
- Hover animations and transitions
- Mobile-first design

### Chat Interface
- Real-time message streaming
- File upload with drag-and-drop
- Markdown rendering for AI responses
- Thinking process visualization
- Auto-scroll to latest message

### Summarizer
- Conditional rendering based on content length
- API integration with `/api/summarize` endpoint
- State management for summary toggling
- Loading states and error handling

---

## 🌐 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

3. **Environment Variables on Vercel**
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

---

## 🔗 Related Repositories

- **Backend:** [RAG_backend_ai](https://github.com/jeevanproart/RAG_backend_ai)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## 📝 License

This project is [MIT](LICENSE) licensed.

---

## 👨‍💻 Author

**Jeevan**

- GitHub: [@jeevanproart](https://github.com/jeevanproart)
- Frontend Demo: [rag-frontend-ai.vercel.app](https://rag-frontend-ai.vercel.app)

---

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- Clerk for authentication
- Vercel for hosting
- Next.js team for the amazing framework

---

**Built with ❤️ using Next.js and TypeScript**
