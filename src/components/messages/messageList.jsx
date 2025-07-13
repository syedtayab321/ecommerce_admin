// src/features/messaging/components/MessageList.jsx
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { listenToConversationMessages} from './../../redux/slices/messageSlice';
import { format } from 'date-fns';

const MessageList = ({ conversationId }) => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const { messages, loading, error } = useSelector((state) => state.messaging);
  const currentUserId = useSelector((state) => state.auth.user?.uid);

  useEffect(() => {
    if (conversationId && currentUserId) {
      const unsubscribe = dispatch(listenToConversationMessages(conversationId, currentUserId));
      return () => unsubscribe();
    }
  }, [conversationId, currentUserId, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <div className="p-4 text-center">Loading messages...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No messages yet. Start the conversation!
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                message.senderId === currentUserId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p>{message.text}</p>
              <div className="flex justify-end items-center mt-1 space-x-2">
                <span className="text-xs opacity-70">
                  {format(message.createdAt?.toDate(), 'h:mm a')}
                </span>
                {message.senderId === currentUserId && (
                  <span className="text-xs">
                    {message.read ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;