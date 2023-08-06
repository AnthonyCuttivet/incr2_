import { HUDUtils } from "./HUDUtils";
import { PlayerData } from "./PlayerData";

export class GameFeelUtils {

    private static playerData: PlayerData;

    public static CreateGameFeelPools() {
        this.playerData = new PlayerData();
    }
}
