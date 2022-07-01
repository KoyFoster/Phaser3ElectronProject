import Phaser from "phaser";
export class StartupScene extends Phaser.Scene {
    constructor() {
        super("Startup");
    }

    create() {
        this.add.text(20, 20, "Loading game...", { fontSize: '32px', color: '#FFFF00' });
    }
}