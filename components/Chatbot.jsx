import React, { useState, useEffect, useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Chatbot({ showChat: propShowChat, setShowChat: propSetShowChat }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Hello! I am Shubham pal assistance. How can I help you?' }]);
  const [loading, setLoading] = useState(false);
  const [pdfText, setPdfText] = useState('');
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

      const conversationHistory = newMessages.slice(1);
      const geminiHistory = conversationHistory.map(msg => ({
        role: msg.role === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

      const body = { history: geminiHistory };
      if (pdfText) body.pdfText = pdfText;

  const apiUrl = (typeof window !== 'undefined' && window.__CHAT_API_BASE__) ? `${window.__CHAT_API_BASE__}/api/chat` : '/api/chat';
      window.lastApiUrlAttempt = apiUrl;

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let parsed;
        try {
          parsed = await res.json();
        } catch (e) {
          parsed = { error: await res.text() };
        }
        console.error('Error response from server:', res.status, parsed);

        if (res.status === 503) {
          setMessages(prev => [...prev, { role: 'bot', text: `The chat model is currently overloaded. Please try again in a few seconds. (${parsed?.details||parsed?.error||res.status})` }]);
        } else {
          setMessages(prev => [...prev, { role: 'bot', text: `Server error: ${parsed?.error || parsed?.details || 'Unknown error'}` }]);
        }
        return;
      }

      const data = await res.json();
      const botMessage = { role: 'bot', text: data.reply || 'No reply from server.' };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      console.log('API URL attempted:', window.lastApiUrlAttempt);
  const attempted = window.lastApiUrlAttempt || '/api/chat';
  setMessages(prev => [...prev, { role: 'bot', text: `Unable to contact the chat server (tried ${attempted}). Make sure the dev server is running and that the API route '/api/chat' is available.` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      <div className="fixed right-1 bottom-3 z-50 flex flex-col items-end">
        {!showChat && (
          <div className="flex items-center justify-end w-36 h-36 p-0 overflow-hidden hover:scale-150 transition">
              <DotLottieReact onClick={() => setShowChat(true)} src={robotAnimationUrl} loop autoplay style={{width: '100%', height: '100%' }}  />
          </div>
        )}

        {showChat && (
          <div className="w-full max-w-md bg-white border rounded-xl shadow-2xl flex flex-col">
            <div className="flex justify-between items-center bg-gray-50 text-gray-800 px-4 py-3 rounded-t-xl border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="font-semibold">Shubhams Assistant</span>
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
