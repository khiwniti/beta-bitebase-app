/**
 * BiteBase AI Assistant Component
 * Personal AI assistant with Thai language support and restaurant intelligence
 */

import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  Bot,
  Send,
  Trash,
  User,
  Globe,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  MapPin,
} from "lucide-react";

interface AIResponse {
  content: string;
  type: string;
  data?: any;
  language: "th" | "en";
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  response?: AIResponse;
}

interface BiteBaseAIAssistantProps {
  userId?: string;
  title?: string;
  placeholder?: string;
  className?: string;
  defaultLanguage?: "th" | "en";
}

const BiteBaseAIAssistant: React.FC<BiteBaseAIAssistantProps> = ({
  userId = "default-user",
  title = "BiteBase AI Assistant",
  placeholder = "Ask me anything about your restaurant...",
  className = "",
  defaultLanguage = "en",
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState<"th" | "en">(
    defaultLanguage,
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Load chat history on component mount
  useEffect(() => {
    loadChatHistory();
  }, [userId]);

  // Load user's chat history
  const loadChatHistory = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:12001'}/api/ai/history/${userId}?limit=5`,
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.history.length > 0) {
          const historyMessages: Message[] = data.history
            .map((item: any) => [
              {
                role: "user" as const,
                content: item.userMessage,
                timestamp: new Date(item.timestamp),
              },
              {
                role: "assistant" as const,
                content: item.assistantResponse.content,
                timestamp: new Date(item.timestamp),
                response: item.assistantResponse,
              },
            ])
            .flat();
          setMessages(historyMessages);
        }
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  // Send message to AI assistant
  const sendMessage = async (message: string) => {
    try {
      // Get auth token from localStorage or cookie
      const token = localStorage.getItem("bitebase_token") || 
                   document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1] ||
                   "demo-token";

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:12001'}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          message,
          conversation_id: `conv_${userId}_${Date.now()}`,
          context: {
            language: currentLanguage,
            timestamp: new Date().toISOString(),
            userId,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Backend returns: { success: true, data: { response: string, conversation_id: string, timestamp: string } }
      if (!data.success) {
        throw new Error(data.error || 'AI request failed');
      }

      const responseData = data.data || data;
      return {
        content: responseData.response || data.response || "I'm sorry, I couldn't generate a response.",
        type: "text",
        language: currentLanguage,
        suggestions: responseData.suggestions || [],
        data: {
          conversation_id: responseData.conversation_id,
          timestamp: responseData.timestamp,
          intent: "general_help"
        }
      };
    } catch (error) {
      console.error("AI request failed:", error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const message = input;
    setInput("");
    setIsLoading(true);
    setError(null);

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Get AI response
      const aiResponse = await sendMessage(message);

      // Add assistant message
      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse.content,
        timestamp: new Date(),
        response: aiResponse,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Update current language based on response
      if (aiResponse.language) {
        setCurrentLanguage(aiResponse.language);
      }
    } catch (err: any) {
      setError(err.message || "Failed to send message");
      console.error("Error sending message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history
  const clearChat = async () => {
    try {
      await fetch(`http://localhost:12001/api/ai/clear/${userId}`, {
        method: "DELETE",
      });
      setMessages([]);
      setError(null);
    } catch (error) {
      console.error("Failed to clear chat:", error);
    }
  };

  // Toggle language
  const toggleLanguage = () => {
    setCurrentLanguage((prev) => (prev === "th" ? "en" : "th"));
  };

  // Get response type icon
  const getResponseTypeIcon = (type: string) => {
    switch (type) {
      case "sales_analysis":
        return <DollarSign className="h-4 w-4" />;
      case "customer_analysis":
        return <Users className="h-4 w-4" />;
      case "performance_report":
        return <TrendingUp className="h-4 w-4" />;
      case "menu_analysis":
        return <BarChart3 className="h-4 w-4" />;
      case "location_analysis":
        return <MapPin className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  // Get response type color
  const getResponseTypeColor = (type: string) => {
    switch (type) {
      case "sales_analysis":
        return "bg-primary-100 text-primary-800";
      case "customer_analysis":
        return "bg-blue-100 text-blue-800";
      case "performance_report":
        return "bg-purple-100 text-purple-800";
      case "menu_analysis":
        return "bg-orange-100 text-orange-800";
      case "location_analysis":
        return "bg-indigo-100 text-indigo-800";
      case "marketing_strategy":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format response content with proper styling
  const formatResponseContent = (content: string | undefined) => {
    // Handle undefined content
    if (!content) return "No response available.";

    // Convert markdown-style formatting to HTML with better structure
    let formatted = content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^• (.+)$/gm, "<li class='ml-4 mb-1'>$1</li>")
      .replace(/^(\d+)\. (.+)$/gm, "<li class='ml-4 mb-1'><strong>$1.</strong> $2</li>")
      .replace(/📈|📊|👥|💰|🎯|🍝|🏆|📱|⚠️|💡|🎯/g, "<span class='text-lg'>$&</span>")
      .replace(/\n\n/g, "<br/><br/>")
      .replace(/\n/g, "<br/>");

    // Wrap lists in proper ul tags
    formatted = formatted.replace(/(<li[^>]*>.*?<\/li>)/gs, (match) => {
      if (!match.includes('<ul>')) {
        return `<ul class="list-none space-y-1 my-2">${match}</ul>`;
      }
      return match;
    });

    return formatted;
  };

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium text-primary">
              {title}
            </CardTitle>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-1"
            >
              <Globe className="h-4 w-4" />
              {currentLanguage === "th" ? "ไทย" : "EN"}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={clearChat}
              title={
                currentLanguage === "th" ? "ล้างการสนทนา" : "Clear conversation"
              }
              className="hover-primary"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 overflow-hidden">
            <Bot className="h-12 w-12 mb-4 text-primary flex-shrink-0" />
            <p className="text-lg font-medium mb-2 px-4">
              {currentLanguage === "th"
                ? "สวัสดีครับ! ผมพร้อมช่วยเหลือคุณ"
                : "Hello! I'm ready to help you"}
            </p>
            <p className="text-sm px-4">
              {currentLanguage === "th"
                ? "ถามเรื่องร้านอาหาร ยอดขาย ลูกค้า หรือการตลาดได้เลยครับ"
                : "Ask me about your restaurant, sales, customers, or marketing"}
            </p>

            {/* Quick suggestion buttons */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {currentLanguage === "th"
                ? [
                    "ยอดขายเดือนนี้เป็นยังไง?",
                    "แนะนำโปรโมชั่นหน่อย",
                    "วิเคราะห์คู่แข่งให้หน่อย",
                  ]
                : [
                    "How are my sales this month?",
                    "Suggest a promotion",
                    "Analyze my competition",
                  ].map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(suggestion)}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[85%] ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                <Avatar className="flex-shrink-0">
                  {message.role === "user" ? (
                    <>
                      <AvatarImage src="/avatars/user.png" alt="User" />
                      <AvatarFallback className="bg-primary-100">
                        <User className="h-5 w-5 text-primary" />
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/avatars/bot.png" alt="AI" />
                      <AvatarFallback className="bg-primary-100">
                        <Bot className="h-5 w-5 text-primary" />
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>

                <div className="flex flex-col gap-2 min-w-0 flex-1">
                  <div
                    className={`rounded-lg px-4 py-3 max-w-full ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-100 text-gray-900"
                    }`}
                    style={{ wordBreak: 'break-word' }}
                  >
                    {message.role === "assistant" && message.response ? (
                      <div>
                        {/* Response type badge */}
                        {message.response.type !== "general_help" && (
                          <Badge
                            className={`mb-2 ${getResponseTypeColor(message.response.type)}`}
                            variant="secondary"
                          >
                            {getResponseTypeIcon(message.response.type)}
                            <span className="ml-1 text-xs">
                              {message.response.type
                                .replace("_", " ")
                                .toUpperCase()}
                            </span>
                          </Badge>
                        )}

                        {/* Formatted content */}
                        <div
                          className="prose prose-sm max-w-none break-words text-sm leading-relaxed"
                          style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                          dangerouslySetInnerHTML={{
                            __html: formatResponseContent(message.content),
                          }}
                        />

                        {/* Performance data visualization */}
                        {message.response.data &&
                          message.response.type === "sales_analysis" && (
                            <div className="mt-3 p-3 bg-white rounded border">
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="font-medium">Revenue:</span>{" "}
                                  ฿
                                  {message.response.data.monthlyRevenue?.toLocaleString()}
                                </div>
                                <div>
                                  <span className="font-medium">
                                    Customers:
                                  </span>{" "}
                                  {message.response.data.customerCount}
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap break-words overflow-hidden">
                        {message.content}
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div
                    className={`text-xs text-gray-500 ${
                      message.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString(
                      currentLanguage === "th" ? "th-TH" : "en-US",
                      { hour: "2-digit", minute: "2-digit" },
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <Avatar>
                <AvatarImage src="/avatars/bot.png" alt="AI" />
                <AvatarFallback className="bg-primary-100">
                  <Bot className="h-5 w-5 text-primary" />
                </AvatarFallback>
              </Avatar>

              <div className="rounded-lg px-4 py-3 bg-gray-100">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="rounded-lg px-4 py-2 bg-red-100 text-red-700 text-sm">
              {currentLanguage === "th" ? "เกิดข้อผิดพลาด: " : "Error: "}
              {error}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex w-full gap-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              currentLanguage === "th"
                ? "ถามเรื่องร้านอาหารของคุณ..."
                : placeholder
            }
            className="flex-1 min-h-[60px] max-h-[120px] resize-none overflow-y-auto"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="btn-primary flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default BiteBaseAIAssistant;
