import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import Phaser from 'phaser';
import logoImg from './assets/logo.png';

class MyGame extends Phaser.Scene
{
    preload ()
    {
        this.load.image('logo', logoImg);
    }

    create ()
    {
        const logo = this.add.image(400, 150, 'logo');

        // bounce
        this.tweens.add({
            targets: logo,
            y: 450,
            duration: 2000,
            ease: "Power2",
            yoyo: true,
            loop: -1
        });
    }
}

// Game Window Config
const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1920,
    height: 1080,
    scene: MyGame
};

const game = new Phaser.Game(config);

// Main app
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);