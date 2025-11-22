"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Bot, User, Plus, Trash2, MessageSquare } from "lucide-react";
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

interface Conversation {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
    message_count: number;
}

export default function ChatInterface() {
    const { user } = useUser();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: `# Welcome to Deep Research AI! 🚀

I'm your multi-agent research assistant. Here's what I can do:

## ⚡ **Quick Response** (Default)
Ask any question and get fast, concise answers!

## 🔬 **Deep Research Mode**
Add "deep research" to your query for comprehensive reports with web searches and document analysis.

## 🎥 **YouTube Analyzer**
Paste YouTube links to generate viral titles and extract captions.

## 📄 **Document RAG**
Upload PDFs or text files using the 📎 button.

Ready to get started? Create a new chat or ask me anything!`,
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7860";

    // Load conversations on mount
    useEffect(() => {
        if (user) {
            loadConversations();
        }
    }, [user]);

    const loadConversations = async () => {
        if (!user) return;

        try {
            const response = await fetch(`${API_URL}/api/conversations?user_id=${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setConversations(data);
            }
        } catch (error) {
            console.error("Error loading conversations:", error);
        }
    };

    const createNewConversation = async () => {
        if (!user) return;

        try {
            const response = await fetch(`${API_URL}/api/conversations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user.id,
                    title: "New Chat"
                }),
            });

            if (response.ok) {
                const newConv = await response.json();
                setConversations([newConv, ...conversations]);
                setCurrentConversationId(newConv.id);
                setMessages([]);
            }
        } catch (error) {
            console.error("Error creating conversation:", error);
        }
    };

    const loadConversation = async (conversationId: string) => {
        if (!user) return;

        try {
            const response = await fetch(
                `${API_URL}/api/conversations/${conversationId}/messages?user_id=${user.id}`
            );

            if (response.ok) {
                const msgs = await response.json();
                setMessages(msgs.map((msg: any) => ({
                    id: msg.id,
                    role: msg.role,
                    content: msg.content,
                    thoughts: msg.thoughts
                })));
                setCurrentConversationId(conversationId);
            }
        } catch (error) {
            console.error("Error loading conversation:", error);
        }
    };

    const deleteConversation = async (conversationId: string) => {
        if (!user) return;

        try {
            const response = await fetch(
                `${API_URL}/api/conversations/${conversationId}?user_id=${user.id}`,
                { method: "DELETE" }
            );

            if (response.ok) {
                setConversations(conversations.filter(c => c.id !== conversationId));
                if (currentConversationId === conversationId) {
                    setCurrentConversationId(null);
                    setMessages([]);
                }
            }
        } catch (error) {
            console.error("Error deleting conversation:", error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !user) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input,
                    history: messages.map(m => ({ role: m.role, content: m.content })),
                    conversation_id: currentConversationId,
                    user_id: user.id
                }),
            });

            if (!response.ok) throw new Error("Failed to send message");

            const data = await response.json();

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response,
                thoughts: data.thoughts,
            };
            setMessages((prev) => [...prev, aiMessage]);

            // Reload conversations to update message count
            loadConversations();
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        // Handle Documents (RAG)
        try {
            const response = await fetch(`${API_URL}/api/upload`, {
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
                    content: `✅ File uploaded: **${file.name}**. ${data.message}`,
                },
            ]);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload file");
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleSummarize = async (messageId: string) => {
        const message = messages.find(m => m.id === messageId);
        if (!message) return;

        if (message.summary) {
            setMessages(prev => prev.map(m =>
                m.id === messageId ? { ...m, showSummary: !m.showSummary } : m
            ));
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/summarize`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: message.content }),
            });

            if (!response.ok) throw new Error("Failed to summarize");

            const data = await response.json();

            setMessages(prev => prev.map(m =>
                m.id === messageId
                    ? { ...m, summary: data.summary, showSummary: true }
                    : m
            ));
        } catch (error) {
            console.error("Error summarizing:", error);
        }
    };

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            {/* Sidebar */}
            <div className={cn(
                "bg-gray-900 border-r border-white/10 transition-all duration-300",
                sidebarOpen ? "w-64" : "w-0 overflow-hidden"
            )}>
                <div className="p-4 space-y-4">
                    <button
                        onClick={createNewConversation}
                        className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        New Chat
                    </button>

                    <div className="space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto">
                        {conversations.map((conv) => (
                            <div
                                key={conv.id}
                                className={cn(
                                    "group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors",
                                    currentConversationId === conv.id
                                        ? "bg-gray-800"
                                        : "hover:bg-gray-800/50"
                                )}
                                onClick={() => loadConversation(conv.id)}
                            >
                                <MessageSquare className="w-4 h-4 shrink-0 text-gray-400" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-200 truncate">{conv.title}</p>
                                    <p className="text-xs text-gray-500">{conv.message_count} messages</p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteConversation(conv.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600/20 rounded transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
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
                                    <div className="prose prose-invert max-w-none">
                                        {message.showSummary && message.summary ? message.summary : message.content}
                                    </div>
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
        </div>
    );
}
