import React from 'react';

const TypingIndicator = ({ typingUsers, currentUser }) => {
  // Filter out current user from typing users
  const otherTypingUsers = typingUsers.filter(user => user.id !== currentUser.id);
  
  if (otherTypingUsers.length === 0) {
    return null;
  }

  const getTypingText = () => {
    if (otherTypingUsers.length === 1) {
      return `${otherTypingUsers[0].username} is typing...`;
    } else if (otherTypingUsers.length === 2) {
      return `${otherTypingUsers[0].username} and ${otherTypingUsers[1].username} are typing...`;
    } else {
      return `${otherTypingUsers.slice(0, -1).map(user => user.username).join(', ')} and ${otherTypingUsers[otherTypingUsers.length - 1].username} are typing...`;
    }
  };

  return (
    <div className="flex items-center space-x-3 mb-4">
      <div className="flex space-x-1">
        {/* Typing animation dots */}
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="text-sm text-gray-500 italic">
        {getTypingText()}
      </span>
    </div>
  );
};

export default TypingIndicator;