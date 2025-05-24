import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Mic, Volume2, User } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import AIAssistant from '../../lib/ai-assistant';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatbotPage = () => {
  const { t, i18n } = useTranslation();
  const { profile } = useAuthStore();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const assistantRef = useRef<AIAssistant>();
  
  // Initialize AI assistant
  useEffect(() => {
    assistantRef.current = new AIAssistant({
      language: i18n.language,
      userProfile: profile,
    });
    
    // Get initial messages from assistant
    setMessages(assistantRef.current.getChatHistory());
    
    // Update assistant when language changes
    const handleLanguageChange = () => {
      if (assistantRef.current) {
        assistantRef.current.setLanguage(i18n.language);
      }
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n.language, profile]);
  
  // Auto scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Get response from assistant
    try {
      if (assistantRef.current) {
        const response = await assistantRef.current.sendMessage(userMessage);
        setMessages(assistantRef.current.getChatHistory());
      }
    } catch (error) {
      console.error('Error getting response from assistant:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const toggleListening = () => {
    // In a real implementation, this would use the Web Speech API
    // For the MVP, we'll just show a listening state
    setIsListening(!isListening);
    
    if (!isListening) {
      // Simulate getting voice input after 2 seconds
      setTimeout(() => {
        setIsListening(false);
        setInput('What schemes am I eligible for?');
        // Focus the input
        inputRef.current?.focus();
      }, 2000);
    }
  };
  
  const speakMessage = (message: string) => {
    // In a real implementation, this would use the Web Speech API
    // For the MVP, we'll just show an alert
    alert(`Speaking: ${message}`);
  };
  
  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };
  
  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-200px)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{t('chatbot.title')}</h1>
        <p className="text-gray-600">Ask any questions about welfare schemes and eligibility</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md border border-gray-100 flex-1 flex flex-col overflow-hidden">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => speakMessage(message.content)}
                      className="mt-2 text-xs opacity-50 hover:opacity-100 transition-opacity"
                      aria-label="Speak message"
                    >
                      <Volume2 size={16} className="inline-block mr-1" />
                      Listen
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800 rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Suggested questions */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">{t('chatbot.suggestions')}:</p>
          <div className="flex flex-wrap gap-2">
            {t('chatbot.suggestedQuestions', { returnObjects: true }).map((question: string, index: number) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded-full transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
        
        {/* Input area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <button
              onClick={toggleListening}
              className={`p-2 mr-2 rounded-full ${
                isListening ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            >
              <Mic size={20} />
            </button>
            
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-gray-100 border-none rounded-full py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              placeholder={isListening ? t('chatbot.listening') : t('chatbot.placeholder')}
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isListening}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="p-2 ml-2 bg-blue-600 text-white rounded-full disabled:bg-blue-300 hover:bg-blue-700 transition-colors"
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;