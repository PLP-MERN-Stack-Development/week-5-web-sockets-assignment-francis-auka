import React from 'react';

const Message = ({ message, isOwn }) => {
  /* ---------- helpers ---------- */
  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const avatarColor = (name) => {
    const colors = [
      'bg-red-500',  'bg-blue-500',  'bg-green-500', 'bg-yellow-500',
      'bg-purple-500','bg-pink-500', 'bg-indigo-500','bg-teal-500',
    ];
    return colors[name.length % colors.length];
  };

  /* ---------- read‑receipt logic ---------- */
  const isRead = isOwn && Array.isArray(message.readBy) && message.readBy.length > 0;

  /* ---------- special bubble styles ---------- */
  const baseBubble =
    message.type === 'private'
      ? 'bg-purple-100 text-purple-900 border border-purple-200'
      : 'bg-white text-gray-800 border border-gray-200';

  return message.type === 'system' ? (
    <div className="flex justify-center my-2">
      <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm">
        {message.content}
      </div>
    </div>
  ) : (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className="max-w-xs lg:max-w-md">
        <div
          className={`flex items-start space-x-3 ${
            isOwn ? 'flex-row-reverse space-x-reverse' : ''
          }`}
        >
          {/* avatar */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${avatarColor(
              message.sender
            )}`}
          >
            {message.sender[0].toUpperCase()}
          </div>

          {/* bubble + meta */}
          <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
            {/* header */}
            <div
              className={`flex items-center space-x-2 mb-1 ${
                isOwn ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <span className="text-sm font-medium text-gray-700">
                {isOwn ? 'You' : message.sender}
              </span>
              <span className="text-xs text-gray-500">
                {formatTime(message.timestamp)}
              </span>
              {message.type === 'private' && (
                <span className="text-xs text-purple-600 font-medium">Private</span>
              )}
            </div>

            {/* bubble */}
            <div
              className={`px-4 py-2 rounded-lg shadow-sm max-w-full break-words ${
                isOwn
                  ? 'bg-indigo-600 text-white'
                  : baseBubble
              }`}
            >
              {message.type === 'private' && isOwn && (
                <div className="text-xs text-purple-100 mb-1">
                  to {message.recipient}
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>

            {/* read receipt */}
            {isOwn && (
              <div className="flex items-center mt-1 space-x-1">
                <svg
                  className="w-3 h-3 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 01.083 1.32l-.083.094-8 8a1 1 0 01-1.32.083l-.094-.083-4-4a1 1 0 011.32-1.497l.094.083L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {isRead && (
                  <svg
                    className="w-3 h-3 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 01.083 1.32l-.083.094-8 8a1 1 0 01-1.32.083l-.094-.083-4-4a1 1 0 011.32-1.497l.094.083L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span className="text-xs text-gray-400">
                  {isRead ? 'Read' : 'Delivered'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
