// src/features/messaging/components/ConversationList.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { listenToUserConversations } from './../../redux/slices/messageSlice';
import { Link } from 'react-router-dom';

const ConversationList = () => {
  const dispatch = useDispatch();
  const { conversations, loading, error } = useSelector((state) => state.messaging);
  const currentUserId = useSelector((state) => state.auth.user?.uid);

  useEffect(() => {
    if (currentUserId) {
      const unsubscribe = dispatch(listenToUserConversations(currentUserId));
      return () => unsubscribe();
    }
  }, [currentUserId, dispatch]);

  const getOtherParticipant = (participants) => {
    return participants.find(id => id !== currentUserId);
  };

  if (loading) return <div className="p-4 text-center">Loading conversations...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="border-r border-gray-200 w-64 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Conversations</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No conversations yet</div>
        ) : (
          conversations.map((conv) => (
            <Link
              key={conv.id}
              to={`/messages/${conv.id}`}
              className="block p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">User ID: {getOtherParticipant(conv.participants)}</p>
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unreadCount[currentUserId] > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {conv.unreadCount[currentUserId]}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(conv.lastMessageTime?.toDate()).toLocaleTimeString()}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;