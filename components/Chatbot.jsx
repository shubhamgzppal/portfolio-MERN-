// components/Chatbot.jsx
import React, { useState, useEffect, useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import ReactMarkdown from 'react-markdown';

const Chatbot = ({ isOpen, onClick }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const robotAnimationUrl = "https://lottie.host/a783ea57-cd22-44fd-9c2b-834317723d8d/aEnTrFev0r.lottie";

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => { setMessages([{ role: 'bot', text: "Hello! I am Shubham Pal's assistant. How can I help you?" }]);}, []);
  useEffect(() => { const handleBeforeUnload = () => { setMessages([]); };
  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => { window.removeEventListener("beforeunload", handleBeforeUnload); };}, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    try {
      setLoading(true);

      const geminiHistory = newMessages.slice(-10).map(msg => ({
        role: msg.role === "bot" ? "model" : "user", parts: [{ text: msg.text }],
      }));

      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ history: geminiHistory }),});

      const data = await res.json();
      const botMessage = { role: "bot", text: data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { role: "bot", text: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") { sendMessage(); }};

  return (
    <>
      {/* Floating Bot Icon */}
      {!isOpen && (
        <div
          onClick={onClick}
          className="cursor-pointer transition-all duration-300 ease-in-out w-16 h-16 sm:w-20 sm:h-20 md:w-48 md:h-48 items-end hover:scale-150"
          aria-hidden="true"
        >
          <DotLottieReact src={robotAnimationUrl} loop autoplay style={{ width: '100%', height: '100%' }} />
        </div>
      )}

      {/* Chat Window */}
      <div
        className={`fixed bottom-5 right-1 w-[90vw] sm:w-[30vw] max-w-sm bg-white border border-gray-200 rounded-xl shadow-2xl z-50 flex flex-col transition-all duration-300 ease-in-out
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <div className="flex justify-between items-center bg-gray-500 text-gray-800 px-4 py-3 rounded-t-xl">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="font-semibold text-gray-900">Shubham’s Assistant</span>
          </div>
          <button onClick={onClick} className="text-gray-200 text-nowrap hover:text-gray-800 rounded-full">&times;</button>
        </div>

        <div className="flex-grow p-4 bg-white h-96 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-900 text-gray-200 rounded-bl-none'}`}>
                {msg.role === 'bot' ? ( <ReactMarkdown>{msg.text}</ReactMarkdown> ) : ( msg.text )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none p-2">
                <div className="flex items-center space-x-1 animate-bounce">
                  <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 bg-gray-500 flex items-center rounded-b-xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="Ask something..."
            className="flex-grow px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-500"
          />
          <button onClick={sendMessage} disabled={loading} className="ml-2 px-4 py-2 bg-none rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
