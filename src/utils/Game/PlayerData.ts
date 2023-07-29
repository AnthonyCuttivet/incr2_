import { BuildingData } from "../../prefabs/Building";

export class PlayerData {
    private _currency: number = 0;
    private _cps: number = 0;
    private _buildings: BuildingData[] = [];
    public get buildings(): BuildingData[] {
        return this._buildings;
    }
    public set buildings(value: BuildingData[]) {
        this._buildings = value;
    }

    public get cps(): number {
        return this._cps;
    }
    public set cps(value: number) {
        this._cps = value;
    }
    public get currency(): number {
        return this._currency;
    }
    public set currency(value: number) {
        this._currency = value;
    }
}
