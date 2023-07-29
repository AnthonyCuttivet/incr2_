import Phaser from 'phaser';
import { Align } from '../utils/Align';
import { AlignGrid } from '../utils/AlignGrid';
import { UIBlock } from '../utils/UIBlock';

export default class InitialScene extends Phaser.Scene {
    private goldText!: Phaser.GameObjects.Text;
    private background!: Phaser.GameObjects.Rectangle;
    private gold!: number | 0;
    doggo!: Phaser.GameObjects.Image;
    grid!: AlignGrid;
    block!: UIBlock;

    private GetGold() {
        return this.gold;
    }

    private SetGold(value: number) {
        this.gold = value;
        this.goldText.setText(this.gold.toString());
    }


    constructor() {
        super('initial');
    }

    create(): void {
        this.background = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, this.cameras.main.width, this.cameras.main.height, 0x121212);
        this.grid = new AlignGrid(this.game, { scene: this, rows: 11, cols: 11 });
        this.grid.showNumbers();


        this.gold = 0;
        this.goldText = this.add.text(this.cameras.main.centerX, this.cameras.main.height * 0.05, this.GetGold().toString()).setOrigin(0.5, 0.5);


        this.grid.placeAtIndex(5, this.goldText);


        this.background.setInteractive().on('pointerup', () => {
            this.SetGold(this.GetGold() + 1);
        });
    }
}
