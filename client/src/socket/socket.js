// src/socket/useSocket.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export const useSocket = (customEventHandlers = {}) => {
  /* ---------- state ---------- */
  const [messages,     setMessages]     = useState([]);
  const [users,        setUsers]        = useState([]);
  const [typingUsers,  setTypingUsers]  = useState([]);
  const [isConnected,  setIsConnected]  = useState(false);
  const [currentRoom,  setCurrentRoom]  = useState('general');
  const [currentUser,  setCurrentUser]  = useState(null);

  /* ---------- refs ---------- */
  const socketRef      = useRef(null);
  const typingTimeout  = useRef(null);

  /* ---------- connect helper ---------- */
  const connect = useCallback((username) => {
    if (!username || socketRef.current) return;

    const socket = io(SERVER_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      withCredentials: true,
      timeout: 20000,
      query: { username },
    });

    socketRef.current = socket;
    setIsConnected(true);

    /* ----- core listeners ----- */
    socket.on('disconnect', () => setIsConnected(false));

    socket.on('message', (msg) =>
      setMessages((prev) => [
        ...prev,
        { ...msg, id: Date.now() + Math.random() },
      ])
    );

    socket.on('private_message', (msg) =>
      setMessages((prev) => [
        ...prev,
        { ...msg, id: Date.now() + Math.random(), type: 'private' },
      ])
    );

    socket.on('user_joined', ({ user }) => {
      if (user)
        setUsers((prev) =>
          prev.some((u) => u.id === user.id) ? prev : [...prev, user]
        );
    });

    socket.on('user_left', ({ userId }) =>
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    );

    socket.on('users_list', setUsers);

    /* typing indicator */
    socket.on('user_typing', ({ userId, username }) => {
      setTypingUsers((prev) =>
        prev.some((u) => u.id === userId)
          ? prev
          : [...prev, { id: userId, username }]
      );
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(
        () =>
          setTypingUsers((prev) => prev.filter((u) => u.id !== userId)),
        2000
      );
    });

    /* room events */
    socket.on('room_joined', ({ room }) => {
      setCurrentRoom(room);
      setMessages([]); // optional: clear on room switch
    });

    /* custom handlers */
    Object.entries(customEventHandlers).forEach(([evt, h]) =>
      socket.on(evt, h)
    );
  }, [customEventHandlers]);

  /* ---------- disconnect on unmount ---------- */
  useEffect(() => {
    return () => socketRef.current?.disconnect();
  }, []);

  /* ---------- emit helpers ---------- */
  const sendMessage = (content, room = currentRoom) => {
    if (socketRef.current && content.trim())
      socketRef.current.emit('send_message', { content, room });
  };

  const sendPrivateMessage = (content, recipientId) => {
    if (socketRef.current && content.trim())
      socketRef.current.emit('send_private_message', { content, recipientId });
  };

  const startTyping = () =>
    socketRef.current?.emit('typing_start', { room: currentRoom });

  const stopTyping = () =>
    socketRef.current?.emit('typing_stop', { room: currentRoom });

  const joinRoom = (room) =>
    socketRef.current?.emit('join_room', { room });

  const leaveRoom = (room) =>
    socketRef.current?.emit('leave_room', { room });

  /* ---------- emit ANY custom event ---------- */
  const emitCustomEvent = (eventName, payload) =>
    socketRef.current?.emit(eventName, payload);

  /* ---------- export API ---------- */
  return {
    /* state */
    messages,
    users,
    typingUsers,
    isConnected,
    currentRoom,
    currentUser,

    /* methods */
    connect,
    sendMessage,
    sendPrivateMessage,
    startTyping,
    stopTyping,
    joinRoom,
    leaveRoom,
    emitCustomEvent,   // <-- restored
  };
};
