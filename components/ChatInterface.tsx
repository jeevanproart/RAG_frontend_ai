"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Bot, User } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    thoughts?: { tool: string; input: any; status: string }[];
    summary?: string;
    showSummary?: boolean;
}

export default function ChatInterface() {
    const { user } = useUser();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: `# Welcome to Deep Research AI! 🚀

I'm your multi-agent research assistant powered by LangGraph and Google Gemini. Here's what I can do for you:

## 🔬 Deep Research Mode
Ask me complex questions and I'll:
- Break down your topic into research steps
- Search the web AND your uploaded documents
- Generate comprehensive, well-formatted reports

**Try:** "Research the future of quantum computing in cryptography"

---

## 🎥 YouTube Video Analyzer
Paste any YouTube link and I'll:
- Generate 3 AI-enhanced title options (Viral, SEO, Professional)
- Extract full captions (for videos < 10 mins)
- Provide professional formatting

**Try:** "Generate a better title for this video: [YouTube URL]"

---

## 📝 Smart Summarizer
For long responses, I automatically show a "Summarize" button to give you:
- Concise 3-5 sentence summaries
- Toggle between summary and full report

---

## 📄 Document Knowledge Base
Upload PDFs or text files using the 📎 button to enhance my knowledge!

---

Ready to get started? Ask me anything!`,
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    history: messages.map(m => ({ role: m.role, content: m.content }))
                }),
            });

            if (!response.ok) throw new Error('Failed to send message');

            const data = await response.json();

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response,
                thoughts: data.thoughts
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsLoading(false);

        } catch (error) {
            console.error("Error sending message:", error);
            setIsLoading(false);
            // Optional: Add error message to chat
        }
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    role: "assistant",
                    content: `File uploaded successfully: ${file.name}. ${data.message}`,
                },
            ]);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload file");
        }
    };

    const handleSummarize = async (messageId: string) => {
        const message = messages.find(m => m.id === messageId);
        if (!message) return;

        // If summary already exists, just toggle
        if (message.summary) {
            setMessages(prev => prev.map(m =>
                m.id === messageId ? { ...m, showSummary: !m.showSummary } : m
            ));
            return;
        }

        // Otherwise, fetch summary from backend
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/summarize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: message.content }),
            });

            if (!response.ok) throw new Error('Failed to summarize');

            const data = await response.json();

            setMessages(prev => prev.map(m =>
                m.id === messageId
                    ? { ...m, summary: data.summary, showSummary: true }
                    : m
            ));
        } catch (error) {
            console.error("Error summarizing:", error);
            alert("Failed to generate summary");
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto p-4">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-white/5 rounded-lg border border-white/10">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            "flex items-start gap-3",
                            message.role === "user" ? "flex-row-reverse" : "flex-row"
                        )}
                    >
                        <div
                            className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                message.role === "user" ? "bg-blue-600" : "bg-purple-600"
                            )}
                        >
                            {message.role === "user" ? (
                                <User className="w-5 h-5 text-white" />
                            ) : (
                                <Bot className="w-5 h-5 text-white" />
                            )}
                        </div>
                        <div className="flex flex-col gap-2 max-w-[80%]">
                            <div
                                className={cn(
                                    "p-3 rounded-lg",
                                    message.role === "user"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-800 text-gray-100"
                                )}
                            >
                                {message.thoughts && message.thoughts.length > 0 && (
                                    <div className="mb-2 text-xs text-gray-400 bg-black/20 p-2 rounded border border-white/10">
                                        <div className="font-semibold mb-1 text-purple-300">Thinking Process:</div>
                                        {message.thoughts.map((thought, idx) => (
                                            <div key={idx} className="mb-1 last:mb-0">
                                                <span className="text-yellow-500">[{thought.tool}]</span>{" "}
                                                <span className="opacity-80">
                                                    {typeof thought.input === 'string' ? thought.input : JSON.stringify(thought.input)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {message.showSummary && message.summary ? message.summary : message.content}
                            </div>
                            {message.role === "assistant" && message.content.length > 500 && (
                                <button
                                    onClick={() => handleSummarize(message.id)}
                                    className="self-start text-xs px-3 py-1 rounded bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 transition-colors"
                                >
                                    {message.showSummary ? "📄 Show Full" : "📝 Summarize"}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".txt,.pdf"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    title="Upload file"
                >
                    <Paperclip className="w-5 h-5" />
                </button>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
