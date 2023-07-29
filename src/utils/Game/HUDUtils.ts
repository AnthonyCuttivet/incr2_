import { Building } from "../../prefabs/Building";
import { AlignGrid } from "../AlignGrid";
import { UIBlock } from "../UIBlock";
import { BuildingUtils } from "./BuildingUtils";
import { PlayerData } from "./PlayerData";
import { PlayerUtils } from "./PlayerUtils";

export interface HUDData {
    currency_text: Phaser.GameObjects.Text,
    cps_text: Phaser.GameObjects.Text,
    buildings_parent: UIBlock,
}

export class HUDUtils {

    private static HUDData: HUDData;
    private static grid: AlignGrid;

    public static CreateHUD(game: any, scene: any) {
        this.grid = new AlignGrid(game, { scene: scene, rows: 11, cols: 11 });
        // this.grid.showNumbers();

        var currency_text = scene.add.text(0, 0, PlayerUtils.GetPlayerData().currency.toString()).setOrigin(0.5, 0.5);
        var cps_text = scene.add.text(0, 0, PlayerUtils.GetPlayerData().cps.toString() + '/s').setOrigin(0.5, 0.5);

        this.grid.placeAtIndex(5, currency_text);
        this.grid.placeAtIndex(16, cps_text);

        this.HUDData = {
            currency_text: currency_text,
            cps_text: cps_text,
            buildings_parent: HUDUtils.CreateBuildingsHUD(game, scene),
        }
    }

    public static CreateBuildingsHUD(game: any, scene: any): UIBlock {
        var parent = new UIBlock();
        var buttonSettings = {
            base_color: 0x303030,
            active_color: 0x3E3E3E,
            clicked_color: 0x232323,
            w: 250,
            h: 70,
        };

        BuildingUtils.GetBuildingsData().buildings.forEach((building, index) => {
            parent.add(new Building(scene, building.name, building.icon, building.base_cost, building.base_prod, building.scaler, buttonSettings, index));
        });

        return parent;
    }

    public static UpdatePlayerCurrencyHUD() {
        this.HUDData.currency_text.setText(PlayerUtils.GetPlayerData().currency.toString());
    }

    public static UpdatePlayerCPSHUD() {
        this.HUDData.cps_text.setText(PlayerUtils.GetPlayerData().cps.toString() + '/s');
    }
}
