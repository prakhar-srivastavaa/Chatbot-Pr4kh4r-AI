# Pr4kh4r AI Chatbot

A modern, responsive AI chatbot interface built with React, TypeScript, and Vite. Features a sleek Claude-inspired design with OAuth authentication support.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your OAuth credentials (see OAUTH_SETUP.md)

# Run development server
npm run dev
```

Visit `http://localhost:3030` to see the app.

**⚠️ Important:** OAuth login requires:
1. OAuth credentials in `.env` file (see [OAUTH_SETUP.md](./OAUTH_SETUP.md))
2. Backend server for production (see [OAUTH_TROUBLESHOOTING.md](./OAUTH_TROUBLESHOOTING.md))
3. For now, use email/password login or mock OAuth for development

## ✨ Features

- 🎨 **Modern UI**: Claude-inspired interface with dark/light theme
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- 🔐 **OAuth Integration**: Google and GitHub login support
- 💬 **Chat Management**: Create, switch, and delete conversations
- 📊 **Resizable Layout**: Drag to adjust sidebar width
- ⚡ **Fast**: Built with Vite for optimal performance
- 🎯 **Recent Chats**: Quick access to your recent conversations

## 📖 Full Setup Instructions

See [SETUP.md](./SETUP.md) for detailed setup instructions including:
- OAuth configuration (Google & GitHub)
- Backend setup requirements
- Environment variables
- Deployment guide
- Troubleshooting tips

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Authentication**: OAuth 2.0 (Google, GitHub)

## 🎯 Usage

1. **Login**: Use email/password or OAuth (Google/GitHub)
2. **New Chat**: Click "New chat" button in sidebar
3. **Send Messages**: Type in the input box and press Enter
4. **Resize Sidebar**: Drag the separator between sidebar and chat
5. **Switch Themes**: Click the theme toggle in the header
6. **Access Recent Chats**: Check the "Recents" section in sidebar

## ⚙️ Configuration

Create a `.env` file with your OAuth credentials:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

## 📱 Responsive Design

The app automatically adapts to different screen sizes:
- **Mobile** (< 640px): Compact layout
- **Tablet** (640px - 768px): Toggleable sidebar
- **Desktop** (> 768px): Full resizable layout

## 🚀 Deployment

```bash
npm run build
```

Deploy the `dist/` folder to Vercel, Netlify, or any static hosting.

## 📝 License

MIT License - feel free to use this project.

---

**Need help?** Check [SETUP.md](./SETUP.md) for detailed instructions.
  