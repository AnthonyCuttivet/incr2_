import Phaser from 'phaser';
import { PlayerUtils } from '../utils/Game/PlayerUtils';
import { BuildingUtils } from '../utils/Game/BuildingUtils';

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader');
    }

    preload(): void {
        // Create or Load player Data
        PlayerUtils.CreateOrLoadPlayerData();
        BuildingUtils.LoadBuildingsData(this);
    }

    create(): void {
        this.scene.start('initial');
    }
}
