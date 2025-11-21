"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="p-4 border-b border-white/10 flex justify-between items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          AI Agent RAG
        </h1>
        <div>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>

      <SignedIn>
        <ChatInterface />
      </SignedIn>

      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-8">
          {/* Hero Section */}
          <div className="text-center mb-16 max-w-3xl">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Deep Research AI
            </h2>
            <p className="text-xl text-gray-300 mb-2">
              Multi-Agent Research Assistant
            </p>
            <p className="text-gray-400 mb-8">
              Powered by LangGraph & Google Gemini
            </p>
            <SignInButton mode="modal">
              <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105">
                Get Started →
              </button>
            </SignInButton>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 hover:border-blue-500/40 transition-all">
              <div className="text-4xl mb-3">🔬</div>
              <h3 className="text-lg font-bold mb-2 text-blue-300">Deep Research</h3>
              <p className="text-sm text-gray-400">
                Multi-step research with web search & document analysis
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <div className="text-4xl mb-3">🎥</div>
              <h3 className="text-lg font-bold mb-2 text-purple-300">YouTube Analyzer</h3>
              <p className="text-sm text-gray-400">
                Generate viral titles & extract captions from videos
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-pink-900/20 to-pink-800/10 border border-pink-500/20 hover:border-pink-500/40 transition-all">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-lg font-bold mb-2 text-pink-300">Smart Summarizer</h3>
              <p className="text-sm text-gray-400">
                Auto-summarize long reports with one click
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-500/20 hover:border-green-500/40 transition-all">
              <div className="text-4xl mb-3">📄</div>
              <h3 className="text-lg font-bold mb-2 text-green-300">Document RAG</h3>
              <p className="text-sm text-gray-400">
                Upload PDFs & texts for enhanced knowledge
              </p>
            </div>
          </div>
        </div>
      </SignedOut>
    </main>
  );
}
