// src/features/messaging/components/MessageInput.jsx
import  { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage } from './../../redux/slices/messageSlice';

const MessageInput = ({ conversationId }) => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.auth.user?.uid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !conversationId || !currentUserId) return;
    
    try {
      await dispatch(sendMessage({ conversationId, senderId: currentUserId, text: message }));
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="bg-blue-500 text-white rounded-full px-4 py-2 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;