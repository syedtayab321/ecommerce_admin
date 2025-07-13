import { useSelector } from 'react-redux';
import ConversationList from './../../components/messages/conversationList';
import MessageList from './../../components/messages/messageList';
import MessageInput from './../../components/messages/messageInput';

const MessagingPage = () => {
  const { currentConversation } = useSelector((state) => state.messaging);

  return (
    <div className="flex h-screen bg-white">
      <ConversationList />
      
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold">Conversation</h2>
            </div>
            <MessageList conversationId={currentConversation} />
            <MessageInput conversationId={currentConversation} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <h3 className="text-xl font-medium text-gray-700">Select a conversation</h3>
              <p className="text-gray-500 mt-2">
                Choose from your existing conversations or start a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;