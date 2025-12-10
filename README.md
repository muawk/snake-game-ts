# Snake Game TypeScript

![snake-game-play](https://github.com/user-attachments/assets/46911ae6-5fef-4108-9859-60af03463c9a)

A classic Snake game implementation built with TypeScript and Canvas API. Navigate the snake to eat food and grow longer while avoiding collisions with walls and yourself.

## Overview

This is a modern implementation of the timeless Snake arcade game. The player controls a snake that moves around a grid, eating food to grow longer and earn points. The game ends when the snake collides with the walls or itself.

## Technical Specifications

- **Canvas Size**: 600 × 600 px
- **Unit Size**: 25 × 25 px per square
- **Grid Dimensions**: 24 × 24 units (576 total squares)

## Development Roadmap

- [x] Press spacebar to start game
- [x] Game over screen with restart functionality
- [x] Score tracking with high score and offline storage
- [x] Sound effects
- [ ] Sprite animations for different actions
- [ ] Different kinds of food items

## Features

- **Classic Gameplay**: Traditional Snake mechanics with smooth controls
- **TypeScript**: Fully typed implementation for better code quality and maintainability
- **Canvas Rendering**: Smooth graphics using HTML5 Canvas API
- **Score Tracking**: Keep track of your current score and level progression
- **Responsive Controls**: Arrow keys for intuitive snake movement
- **Game States**: Start, playing, and game over states with clear UI feedback
- **Progressive Difficulty**: Game speed increases every 5 points earned

## How to Play

1. Press **Spacebar** to start the game
2. Use **Arrow Keys** to control the snake's direction
3. Eat the food squares to grow and increase your score
4. Avoid hitting the walls or the snake's own body
5. Try to reach the highest level possible

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

```bash
git clone <repository-url>
cd snake-game-ts
npm install
```

### Running the Game

```bash
npm run dev
```

This will start a local development server and open the game in your browser.

### Building for Production

```bash
npm run build
```

## Project Structure

- **src/**: TypeScript source files
- **dist/**: Compiled JavaScript output
- **index.html**: Main HTML file
- **styles.css**: Game styling

## Technologies Used

- **TypeScript**: Language for type-safe development
- **HTML5 Canvas**: Graphics rendering
- **Webpack**: Module bundling (if configured)
- **Node.js**: Runtime environment

## Game Rules

- The snake starts with a length of 4 units
- Each food eaten increases the snake's length by 1
- The game board is 24 × 24 grid units
- Snake movement speed increases every 5 points (level increases)
- Minimum speed is capped to maintain playability
- Game ends on collision with walls or the snake's body

## Future Enhancements

- Difficulty levels (Easy, Normal, Hard)
- Obstacles on the game board
- Leaderboard system
- Mobile touch controls
- Pause/Resume functionality
- Power-ups and special items

## License

MIT License - feel free to use this project for learning and personal use.

## Author

Muluneh Awoke

---

**Happy Gaming!** 🐍
