import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader');
    }

    preload(): void {

    }

    create(): void {
        this.scene.start('initial');
    }
}
