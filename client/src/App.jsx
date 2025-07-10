import React, { useState, useMemo } from 'react';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import { useSocket } from './socket/socket';

function App() {
  const [user, setUser] = useState(null);

  /* ---- 1. custom events (memoised) ---- */
  const customEventHandlers = useMemo(
    () => ({
      user_joined_success: (data) => {
        console.log('User joined successfully:', data);
        setUser(data.user);
      },
      join_error: (error) => {
        console.error('Failed to join:', error);
        alert('Failed to join chat: ' + error.message);
      },
      // add other custom events here
    }),
    []
  );

  /* ---- 2. useSocket hook ---- */
  const {
    /* state */
    messages,
    users,
    typingUsers,
    isConnected,
    currentRoom,

    /* methods */
    connect,                // <-- NEW: call after login
    sendMessage,
    sendPrivateMessage,
    joinRoom,
    leaveRoom,
    startTyping,
    stopTyping,
    emitCustomEvent,
  } = useSocket(customEventHandlers);

  /* ---- 3. login & logout ---- */
  const handleLogin = (username) => {
    const cleanName = username.trim();
    if (!cleanName) return;

    connect(cleanName);                           // connect socket
    emitCustomEvent('user_join', { username: cleanName }); // optional server hook
    setUser({ username: cleanName });
  };

  const handleLogout = () => {
    if (!user) return;
    emitCustomEvent('user_leave', { username: user.username });
    setUser(null);
  };

  /* ---- 4. render ---- */
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Socket.io Chat App
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span
              className={`text-sm ${
                isConnected ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </header>

        <main className="max-w-4xl mx-auto">
          {!user ? (
            <Login onLogin={handleLogin} />
          ) : (
            <ChatRoom
              user={user}
              messages={messages}
              users={users}
              typingUsers={typingUsers}
              isConnected={isConnected}
              currentRoom={currentRoom}
              onLogout={handleLogout}
              onSendMessage={sendMessage}
              onSendPrivateMessage={sendPrivateMessage}
              onJoinRoom={joinRoom}
              onLeaveRoom={leaveRoom}
              onStartTyping={startTyping}
              onStopTyping={stopTyping}
              onEmitCustomEvent={emitCustomEvent}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
