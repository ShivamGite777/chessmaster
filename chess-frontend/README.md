# ChessMaster - Modern Multiplayer Chess Game

A beautiful, modern multiplayer chess game built with React, TypeScript, and Tailwind CSS. Features real-time gameplay, ELO rating system, and immersive animations.

## 🚀 Features

- **Real-time Multiplayer**: Play against players worldwide with instant move synchronization
- **ELO Rating System**: Competitive ranking system with fair matchmaking
- **Beautiful UI**: Modern design with glassmorphism effects and smooth animations
- **Sound Effects**: Immersive audio feedback for moves, captures, and game events
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Game History**: Track your games and analyze your performance
- **Chat System**: Communicate with opponents during games
- **Multiple Time Controls**: Blitz, Rapid, and Classical game modes
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand for lightweight state management
- **Routing**: React Router for navigation
- **Animations**: Framer Motion for smooth transitions
- **Chess Logic**: chess.js for move validation
- **Real-time**: Socket.io-client for live communication
- **Audio**: Howler.js for sound effects
- **HTTP Client**: Axios for API calls
- **Build Tool**: Vite for fast development and building

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chess-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 🎮 Usage

### Getting Started
1. Visit the landing page to learn about ChessMaster
2. Create an account or sign in with existing credentials
3. Navigate to the dashboard to create or join games
4. Start playing and climb the ELO ladder!

### Game Features
- **Create Games**: Set up custom games with different time controls
- **Quick Match**: Automatically find opponents with similar skill levels
- **Spectate**: Watch ongoing games between other players
- **Chat**: Communicate with opponents during games
- **Analysis**: Review your game history and statistics

## 🎨 Design System

### Color Palette
- **Primary**: Gold/Amber (#EAB308) for highlights and accents
- **Dark Mode**: Deep navy/charcoal backgrounds for modern look
- **Success**: Green (#10B981) for positive actions
- **Danger**: Red (#EF4444) for warnings and errors
- **Info**: Blue (#3B82F6) for informational elements

### Typography
- **Font**: Inter for clean, modern readability
- **Hierarchy**: Clear size and weight distinctions
- **Accessibility**: High contrast ratios for readability

### Components
- **Glass Effects**: Backdrop blur with transparency for modern UI
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design approach
- **Accessibility**: ARIA labels and keyboard navigation

## 🔧 Configuration

### Environment Variables
```env
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
VITE_NODE_ENV=development
```

### Customization
- Modify `tailwind.config.js` for theme customization
- Update `src/utils/sounds.ts` for audio configuration
- Customize `src/store/index.ts` for state management

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full feature set with side-by-side layouts
- **Tablet**: Adapted layouts with collapsible panels
- **Mobile**: Touch-friendly interface with swipe gestures

## ♿ Accessibility

- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader**: ARIA labels and semantic HTML
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user motion preferences
- **Focus Indicators**: Clear focus states for navigation

## 🎵 Sound Effects

The game includes comprehensive audio feedback:
- Move sounds (different for normal moves vs captures)
- Check and checkmate alerts
- Victory and defeat fanfares
- Timer warnings
- UI interaction sounds

## 🔮 Future Features

- **Tournament Mode**: Organized competitions and brackets
- **Puzzle Mode**: Daily chess puzzles and tactics training
- **Analysis Board**: Post-game analysis with engine evaluation
- **Social Features**: Friends list and private messaging
- **Mobile App**: Native iOS and Android applications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Chess.js for chess logic and validation
- Tailwind CSS for the design system
- Framer Motion for smooth animations
- React community for excellent documentation and tools

---

Built with ❤️ for chess enthusiasts worldwide.