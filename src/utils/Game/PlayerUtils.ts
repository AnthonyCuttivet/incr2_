import { HUDUtils } from "./HUDUtils";
import { PlayerData } from "./PlayerData";

export class PlayerUtils {

    private static playerData: PlayerData;

    public static CreateOrLoadPlayerData() {
        this.playerData = new PlayerData();
    }

    public static GetPlayerData(): PlayerData {
        return this.playerData;
    }

    public static AddCurrency(amount: number) {
        PlayerUtils.GetPlayerData().currency += amount;
        HUDUtils.UpdatePlayerCurrencyHUD();
    }

    public static UpdateCPS() {
        var cps = 0;
        PlayerUtils.GetPlayerData().buildings.forEach(building => {
            cps += building.base_prod * building.owned;
        });
        PlayerUtils.GetPlayerData().cps = cps;
        HUDUtils.UpdatePlayerCPSHUD();
    }
}
