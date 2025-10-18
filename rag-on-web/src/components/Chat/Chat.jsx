import { useState, useEffect, useRef } from 'react';
import { useApi } from '../../hooks/useApi';

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! Ask me anything about the registered data.', sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const { post, isLoading, error, setError } = useApi();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
      if (error) {
          const errorMsg = {
              id: Date.now(), // Use timestamp for unique key
              text: `Error: ${error}`,
              sender: 'system'
          };
          setMessages(prev => [...prev, errorMsg]);
          setError(null); // Clear error after displaying
      }
  }, [error, setError]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');

    const response = await post('chat', { message: currentInput });

    if (response) {
      const aiResponse = {
        id: Date.now() + 1,
        text: response.answer,
        sender: 'ai',
      };
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="bg-white rounded-xl shadow-lg flex flex-col h-[75vh]">
        {/* Message Display Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>}
                {message.sender === 'system' ? (
                    <div className="w-full text-center text-sm text-red-600 bg-red-100 rounded-lg py-2 px-4 mx-auto">
                        {message.text}
                    </div>
                ) : (
                  <div
                    className={`rounded-xl px-4 py-2 max-w-md ${
                      message.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 border-t bg-gray-50 rounded-b-xl">
          <form onSubmit={handleSendMessage} className="flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-r-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                'Send'
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Chat;