import Phaser from 'phaser';
import { Align } from '../utils/Align';
import { AlignGrid } from '../utils/AlignGrid';
import { UIBlock } from '../utils/UIBlock';
import { Building } from '../prefabs/Building';
import { PlayerUtils } from '../utils/Game/PlayerUtils';
import { HUDUtils } from '../utils/Game/HUDUtils';

export default class InitialScene extends Phaser.Scene {
    private background!: Phaser.GameObjects.Rectangle;
    building_button!: UIBlock;

    constructor() {
        super('initial');
    }

    create(): void {
        this.background = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, this.cameras.main.width, this.cameras.main.height, 0x232323);

        HUDUtils.CreateHUD(this.game, this);

        this.time.addEvent({
            delay: 500,
            callback: () => {
                PlayerUtils.AddCurrency(Math.ceil(PlayerUtils.GetPlayerData().cps / 2));
            },
            callbackScope: this,
            loop: true
        });


        this.background.setInteractive().on('pointerup', () => {
            PlayerUtils.AddCurrency(1);
        });
    }
}
