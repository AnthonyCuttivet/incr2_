import { Building, BuildingData } from "../../prefabs/Building";
import { PlayerUtils } from "./PlayerUtils";
import buildingsData from "../../data/Buildings.json";

export class BuildingUtils {

    public static LoadBuildingsData(game: any) {
        buildingsData.buildings.forEach(b => {
            game.load.image(b.icon, b.icon_path);
        });
    }

    public static GetBuildingsData() {
        return buildingsData;
    }

    public static CanBePurchased(building: BuildingData, quantity: number): boolean {
        return PlayerUtils.GetPlayerData().currency >= building.current_cost;
    }

    public static Purchase(building: BuildingData, quantity: number): BuildingData {
        PlayerUtils.AddCurrency(-building.current_cost);
        building.owned += quantity;
        building.current_cost = Math.floor(building.base_cost * Math.pow(building.scaler, building.owned));


        BuildingUtils.AddBuilding(building);
        PlayerUtils.UpdateCPS();
        return building;
    }

    public static AddBuilding(building: BuildingData) {
        if (PlayerUtils.GetPlayerData().buildings.includes(building)) {
            return;
        }

        PlayerUtils.GetPlayerData().buildings.push(building);
    }
}
