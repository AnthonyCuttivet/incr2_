import { BuildingUtils } from "../utils/Game/BuildingUtils";
import { UIBlock } from "../utils/UIBlock";

export interface BuildingData {
    name: string,
    icon: string,
    base_cost: number,
    current_cost: number,
    base_prod: number,
    current_prod: number,
    owned: number,
    scaler: number,
    ID: number
}

export interface ButtonSettings {
    base_color: number,
    active_color: number,
    clicked_color: number,
    w: number,
    h: number,
    origin_x: number,
    origin_y: number,
}

export class Building extends UIBlock {
    game: any;
    data!: BuildingData;
    building_button!: UIBlock;

    button_settings!: ButtonSettings;
    button_bg!: Phaser.GameObjects.Rectangle;

    building_icon !: Phaser.GameObjects.Image;
    building_name !: Phaser.GameObjects.Text;
    building_cost !: Phaser.GameObjects.Text;
    building_prod !: Phaser.GameObjects.Text;
    building_owned!: Phaser.GameObjects.Text;
    building_locked!: boolean;

    constructor(game: any, name: string, icon: string, base_cost: number, base_prod: number, scaler: number, ID: number, button_settings: ButtonSettings, index: number) {
        super();
        this.game = game;

        this.data = {
            name: name,
            icon: icon,
            base_cost: base_cost,
            current_cost: base_cost,
            base_prod: base_prod,
            current_prod: 0,
            owned: 0,
            scaler: scaler,
            ID: ID
        };

        this.building_button = new UIBlock();
        this.button_settings = button_settings;
        this.createButton(index);
    }

    private createButton(index: number) {
        var game = this.game;
        var data = this.data;
        var buttonSettings = this.button_settings;
        this.button_bg = game.add.rectangle(0, 0, buttonSettings.w, buttonSettings.h, buttonSettings.base_color).setOrigin(0, 0);
        this.button_bg.setStrokeStyle(1, 0xffffff);
        this.button_bg.setInteractive();

        this.building_icon = game.add.image(25, 35, data.icon);
        this.building_name = game.add.text(55, 5, data.name);
        this.building_cost = game.add.text(55, 26, data.base_cost);
        this.building_prod = game.add.text(55, 47, '0%');
        this.building_owned = game.add.text(230, 43, 0).setFontSize(20);
        this.building_locked = game.add.rectangle(0, 0, 250, 70, 0x000000, 0).setOrigin(0, 0);

        this.button_bg.on("pointerover", () => {
            this.onHover();
        });

        this.button_bg.on("pointerout", () => {
            this.onExit();
        });

        this.button_bg.on("pointerdown", () => {
            this.onDown();
        });

        this.button_bg.on("pointerup", () => {
            this.onClick();
        });

        this.building_button.add(this.button_bg);
        this.building_button.add(this.building_icon);
        this.building_button.add(this.building_name);
        this.building_button.add(this.building_cost);
        this.building_button.add(this.building_prod);
        this.building_button.add(this.building_owned);
        this.building_button.add(this.building_locked);

        this.building_button.setXY(this.button_settings.origin_x + 0, this.button_settings.origin_y + (index * 1.05 * this.button_settings.h));
    }

    public UpdateBuilding() {
        this.building_cost.setText(this.data.current_cost.toString());
        this.building_owned.setText(this.data.owned.toString());
        this.building_owned.setX(this.building_button.x + 240 - this.building_owned.width);
    }

    public onClick() {

        if (!BuildingUtils.CanBePurchased(this.data, 1)) {
            return;
        }

        this.data = BuildingUtils.Purchase(this.data, 1);
        this.UpdateBuilding();

        this.button_bg.setFillStyle(this.button_settings.active_color);
    }

    private onHover() {
        this.button_bg.setFillStyle(this.button_settings.active_color);
    }

    private onExit() {
        this.button_bg.setFillStyle(this.button_settings.base_color);
    }

    private onDown() {
        if (!BuildingUtils.CanBePurchased(this.data, 1)) {
            return;
        }

        this.button_bg.setFillStyle(this.button_settings.clicked_color);
    }
}
