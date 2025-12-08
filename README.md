# Snake Game TypeScript (WIP)

A classic Snake game implementation built with TypeScript and Canvas API. Navigate the snake to eat food and grow longer while avoiding collisions with walls and yourself.

## Overview

This is a modern implementation of the timeless Snake arcade game. The player controls a snake that moves around a grid, eating food to grow longer and earn points. The game ends when the snake collides with the walls or itself.

## Features

- **Classic Gameplay**: Traditional Snake mechanics with smooth controls
- **TypeScript**: Fully typed implementation for better code quality and maintainability
- **Canvas Rendering**: Smooth graphics using HTML5 Canvas API
- **Score Tracking**: Keep track of your current score and high score (WIP)
- **Responsive Controls**: Arrow keys for intuitive snake movement
- **Game States**: Start, playing, and game over states with clear UI feedback

## How to Play

1. Use **Arrow Keys** to control the snake's direction
2. Eat the red food squares to grow and increase your score
3. Avoid hitting the walls or the snake's own body
4. Try to achieve the highest score possible

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

### Building for Production (WIP)

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

- The snake starts with a length of 3 units
- Each food eaten increases the snake's length by 1
- The game board is 20x20 grid units
- Snake movement speed increases slightly as the game progresses
- Game ends on collision with walls or the snake's body

## Future Enhancements

- Difficulty levels (Easy, Normal, Hard)
- Obstacles on the game board
- Leaderboard system
- Mobile touch controls
- Sound effects and background music
- Pause/Resume functionality

## License

MIT License - feel free to use this project for learning and personal use.

## Author

Muluneh Awoke

---

**Happy Gaming!** 🐍
