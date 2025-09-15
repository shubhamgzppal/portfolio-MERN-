import React, { useState, useEffect, useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Chatbot({ showChat: propShowChat, setShowChat: propSetShowChat }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Hello! I am Shubham pal assistance. How can I help you?' }]);
  const [loading, setLoading] = useState(false);
  const [pdfText, setPdfText] = useState(''); // optional, kept from ChatBotMassage behaviour
  const [internalShow, setInternalShow] = useState(false);
  const messagesEndRef = useRef(null);

  const isControlled = typeof propShowChat === 'boolean' && typeof propSetShowChat === 'function';
  const showChat = isControlled ? propShowChat : internalShow;
  const setShowChat = isControlled ? propSetShowChat : setInternalShow;

  const robotAnimationUrl = "https://lottie.host/a783ea57-cd22-44fd-9c2b-834317723d8d/aEnTrFev0r.lottie";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showChat]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMessage = { role: 'user', text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    try {
      setLoading(true);

      // Build history for server (compatible with previous implementations)
      const conversationHistory = newMessages.slice(1); // skip initial system/greeting if present
      const geminiHistory = conversationHistory.map(msg => ({
        role: msg.role === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

      const body = { history: geminiHistory };
      if (pdfText) body.pdfText = pdfText;

      // determine API base:
      // 1) REACT_APP_API_URL (set at build time), 2) window.__API_BASE__ (runtime), 3) default to relative '/api'
      const envBase = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : undefined;
      const runtimeBase = typeof window !== 'undefined' ? window.__API_BASE__ : undefined;
      const API_BASE = (envBase || runtimeBase || '').replace(/\/+$/, '');
      const apiUrl = (API_BASE ? API_BASE : '') + '/api/chat';

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error('Error response from server:', res.status, errorBody);
        setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, the server responded with an error.' }]);
        return;
      }

      const data = await res.json();
      const botMessage = { role: 'bot', text: data.reply || 'No reply from server.' };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      const hostHint = (typeof API_BASE !== 'undefined' && API_BASE) ? ` (tried ${API_BASE})` : ' (tried relative /api/chat)';
      setMessages(prev => [...prev, { role: 'bot', text: `Unable to contact the chat server${hostHint}. Make sure your backend is running and REACT_APP_API_URL or window.__API_BASE__ is configured.` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      <div className="fixed right-4 bottom-6 z-50 flex flex-col items-end">
        {!showChat && (
          <div className="mb-2 flex items-center justify-end">
            <button
              onClick={() => setShowChat(true)}
              aria-label="Open chat"
              className="w-24 h-24 p-0 overflow-hidden shadow-lg hover:scale-105 transition"
            >
              <DotLottieReact src={robotAnimationUrl} loop autoplay className="w-12 h-12" />
            </button>
          </div>
        )}

        {/* Chat window (shown when open) */}
        {showChat && (
          <div className="w-full max-w-md bg-white border rounded-xl shadow-2xl flex flex-col">
            <div className="flex justify-between items-center bg-gray-50 text-gray-800 px-4 py-3 rounded-t-xl border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="font-semibold">Shubham’s Assistant</span>
              </div>
              <button
                className="text-gray-500 hover:text-gray-800 text-2xl"
                onClick={() => setShowChat(false)}
                aria-label="Close chat"
              >
                &times;
              </button>
            </div>

            <div className="flex-grow p-4 bg-white h-96 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none p-2">
                    <div className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-200 rounded-b-xl flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder="Ask a question..."
                className="flex-grow px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="ml-3 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}