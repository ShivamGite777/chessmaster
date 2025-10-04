import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store';
import { soundManager } from '../utils/sounds';

interface ChatPanelProps {
  gameId: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: number;
  type: 'user' | 'system';
}

const ChatPanel: React.FC<ChatPanelProps> = ({ gameId }) => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: 'system',
      username: 'System',
      message: 'Game started! Good luck to both players.',
      timestamp: Date.now(),
      type: 'system'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user) return;

    soundManager.playClick();

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      message: newMessage.trim(),
      timestamp: Date.now(),
      type: 'user'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // In a real app, this would send the message via socket
    console.log('Sending message:', message);
  };

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <motion.div
      className="glass-dark rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Game Chat</h3>
        <div className={`flex items-center space-x-2 ${
          isConnected ? 'text-success' : 'text-danger'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-success' : 'bg-danger'
          }`} />
          <span className="text-sm">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto mb-4 space-y-3">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            className={`flex ${
              message.userId === user?.id ? 'justify-end' : 'justify-start'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`max-w-xs px-3 py-2 rounded-lg ${
              message.type === 'system' 
                ? 'bg-primary-500/20 text-primary-300 text-center mx-auto'
                : message.userId === user?.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-700 text-white'
            }`}>
              {message.type === 'user' && (
                <div className="text-xs opacity-75 mb-1">
                  {message.username}
                </div>
              )}
              <div className="text-sm">{message.message}</div>
              <div className={`text-xs mt-1 ${
                message.type === 'system' ? 'text-primary-400' : 'opacity-75'
              }`}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 input-field text-sm"
          maxLength={200}
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>

      {/* Chat Guidelines */}
      <div className="mt-4 pt-4 border-t border-dark-600">
        <div className="text-xs text-gray-400">
          <p className="mb-1">💡 Chat guidelines:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Be respectful to your opponent</li>
            <li>No spoilers or external assistance</li>
            <li>Keep messages game-related</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatPanel;