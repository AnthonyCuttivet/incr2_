import { Building } from "../../prefabs/Building";
import { AlignGrid } from "../AlignGrid";
import { UIBlock } from "../UIBlock";
import { BuildingUtils } from "./BuildingUtils";
import { PlayerData } from "./PlayerData";
import { PlayerUtils } from "./PlayerUtils";
import { ScrollablePanel } from 'phaser3-rex-plugins/templates/ui/ui-components.js';

export interface HUDData {
    currency_text: Phaser.GameObjects.Text,
    cps_text: Phaser.GameObjects.Text,
    buildings_parent: UIBlock,
    upgrades_parent: UIBlock,
}

export class HUDUtils {

    private static HUDData: HUDData;
    private static grid: AlignGrid;

    public static CreateHUD(game: any, scene: any) {
        this.grid = new AlignGrid(game, { scene: scene, rows: 11, cols: 11 });
        this.grid.showNumbers();

        var currency_text = scene.add.text(0, 0, PlayerUtils.GetPlayerData().currency.toString()).setOrigin(0.5, 0.5);
        var cps_text = scene.add.text(0, 0, PlayerUtils.GetPlayerData().cps.toString() + '/s').setOrigin(0.5, 0.5);

        var buildingsPanelPos = this.grid.getIndexCoords(20);
        var buildingsPanel = HUDUtils.CreateBuildingsHUD(game, scene, buildingsPanelPos.x, buildingsPanelPos.y);

        var upgradesPanelPos = this.grid.getIndexCoords(0);
        var upgradesPanel = HUDUtils.CreateUpgradesHUD(game, scene, upgradesPanelPos.x, upgradesPanelPos.y);

        this.grid.placeAtIndex(5, currency_text);
        this.grid.placeAtIndex(16, cps_text);


        this.HUDData = {
            currency_text: currency_text,
            cps_text: cps_text,
            buildings_parent: buildingsPanel,
            upgrades_parent: upgradesPanel,
        }
    }

    public static CreateBuildingsHUD(game: any, scene: any, x: number, y: number): UIBlock {
        var parent = new UIBlock();
        var buttonSettings = {
            base_color: 0x303030,
            active_color: 0x3E3E3E,
            clicked_color: 0x232323,
            w: 250,
            h: 70,
            origin_x: x,
            origin_y: y
        };

        BuildingUtils.GetBuildingsData().buildings.forEach((building, index) => {
            parent.add(new Building(scene, building.name, building.icon, building.base_cost, building.base_prod, building.scaler, building.ID, buttonSettings, index));
        });

        return parent;
    }

    public static CreateUpgradesHUD(game: any, scene: any, x: number, y: number): UIBlock {
        var parent = new UIBlock();

        // var scrollablePanel = game.rexUI.add.scrollablePanel({
        //     x: 400,
        //     y: 300,
        //     width: 320,
        //     height: 460,

        //     scrollMode: 0,

        //     background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 10, 0x303030),

        //     // panel: {
        //     //     child: createGrid(this),
        //     //     mask: {
        //     //         mask: true,
        //     //         padding: 1,
        //     //     }
        //     // },

        //     slider: {
        //         track: scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, 0x232323),
        //         thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 13, 0x3E3E3E),
        //         // position: 'left'
        //     },

        //     mouseWheelScroller: {
        //         focus: false,
        //         speed: 0.1
        //     },

        //     header: scene.rexUI.add.label({
        //         height: 30,

        //         orientation: 0,
        //         background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0, 0x232323),
        //         text: scene.add.text(0, 0, 'Header'),
        //     }),

        //     footer: scene.rexUI.add.label({
        //         height: 30,

        //         orientation: 0,
        //         background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0, 0x232323),
        //         text: scene.add.text(0, 0, 'Footer'),
        //     }),

        //     space: {
        //         left: 10,
        //         right: 10,
        //         top: 10,
        //         bottom: 10,

        //         panel: 10,
        //         header: 10,
        //         footer: 10,
        //     }
        // })
        //     .layout()

        // var print = this.add.text(0, 0, '');

        // scrollablePanel
        //     .setChildrenInteractive()
        //     .on('child.click', function (child, pointer, event) {
        //         print.text += `Click ${child.text}\n`;
        //     })
        //     .on('child.pressstart', function (child, pointer, event) {
        //         print.text += `Press ${child.text}\n`;
        //     })

        // var upgradesPanel = scene.add.rectangle(x, y, 500, 500, 0x303030).setOrigin(0, 0).setStrokeStyle().setStrokeStyle(1, 0xffffff);
        // parent.add(upgradesPanel);

        return parent;
    }

    public static UpdatePlayerCurrencyHUD() {
        this.HUDData.currency_text.setText(Math.trunc(PlayerUtils.GetPlayerData().currency).toString());
    }

    public static UpdatePlayerCPSHUD() {
        this.HUDData.cps_text.setText(PlayerUtils.GetPlayerData().cps.toString() + '/s');
    }
}
