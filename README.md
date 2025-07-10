# 🧠 Socket.io Chat Application

A real-time chat application built with **React**, **Node.js**, and **Socket.io** featuring authentication, chat rooms, private messaging, and live user presence indicators.

## 🚀 Features

- ✅ Real-time messaging using **Socket.io**
- ✅ Live user presence and online user count
- ✅ Typing indicators
- ✅ Message timestamps and read receipts
- ✅ Private messaging
- ✅ System messages on user join/leave
- ✅ User avatars based on initials
- ✅ Fully styled with **Tailwind CSS**
- ✅ Responsive layout (mobile and desktop)
- ✅ Room support (backend ready, UI coming)
- 🧪 In-memory message storage for now

## 📁 Project Structure

```
socketio-chat/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── ChatRoom.jsx
│   │   │   ├── UserList.jsx
│   │   │   └── Message.jsx
│   │   ├── socket/
│   │   │   └── socket.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   └── server.js
├── .env
└── README.md ✅
```

## 🔧 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies

**Server:**

```bash
cd server
npm install
```

**Client:**

```bash
cd ../client
npm install
```

### 3. Configure Environment

Create a `.env` file in `/server`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 4. Run the App

**Start the server:**

```bash
cd server
npm run dev
```

**Start the client:**

```bash
cd ../client
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Assignment Requirements Checklist

| Requirement                           | Status     |
|--------------------------------------|------------|
| Real-time messaging                   | ✅ Done     |
| User authentication / login          | ✅ Done     |
| Multiple chat rooms                  | 🕐 Partial  |
| Private messaging                    | ✅ Done     |
| Typing indicators                    | ✅ Done     |
| Read receipts                        | ✅ Done     |
| Message timestamps                   | ✅ Done     |
| Online user tracking                 | ✅ Done     |
| User avatars                         | ✅ Done     |

---

---

## 🧠 Credits

Created by **Francis Auka** as part of a Socket.io WebSockets assignment.
