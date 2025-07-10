import React, { useState } from 'react';

const UserList = ({ users, currentUser, onPrivateMessage }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [privateMessage, setPrivateMessage] = useState('');

  const getAvatarColor = (username) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const index = username.length % colors.length;
    return colors[index];
  };

  const handleUserClick = (user) => {
    if (user.id !== currentUser.id) {
      setSelectedUser(user);
    }
  };

  const handleSendPrivateMessage = (e) => {
    e.preventDefault();
    if (privateMessage.trim() && selectedUser) {
      onPrivateMessage(privateMessage.trim(), selectedUser.id); // 🔁 match `sendPrivateMessage(content, recipientId)`
      setPrivateMessage('');
      setSelectedUser(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setPrivateMessage('');
  };

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <div
          key={user.id}
          onClick={() => handleUserClick(user)}
          className={`
            flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer
            ${user.id === currentUser.id
              ? 'bg-indigo-50 border border-indigo-200'
              : 'hover:bg-gray-50'}
          `}
        >
          {/* Avatar */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getAvatarColor(user.username)}`}>
            {user.username?.charAt(0).toUpperCase()}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium truncate ${user.id === currentUser.id ? 'text-indigo-700' : 'text-gray-700'}`}>
                {user.username}
                {user.id === currentUser.id && ' (You)'}
              </span>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-500">Online</p>
          </div>

          {/* Private Msg Icon */}
          {user.id !== currentUser.id && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(user);
              }}
              className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
              title="Send private message"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
              </svg>
            </button>
          )}
        </div>
      ))}

      {/* Private Message Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Message to {selectedUser.username}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSendPrivateMessage}>
              <div className="mb-4">
                <textarea
                  value={privateMessage}
                  onChange={(e) => setPrivateMessage(e.target.value)}
                  placeholder="Type your private message..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows="3"
                  autoFocus
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!privateMessage.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
