import { BuildingData } from "../../prefabs/Building";

export class PlayerData {
    private _currency: number = 0;
    private _cps: number = 0;
    private _clickPower: number = 1;
    private _buildings: Map<number, BuildingData> = new Map<number, BuildingData>;
    private _globalProductionBonusPercent: number = 1;
    private _globalProductionBonusRaw: number = 0;
    private _globalClickingBonusPercent: number = 1;
    private _globalClickingBonusRaw: number = 0;

    public get globalClickingBonusPercent(): number {
        return this._globalClickingBonusPercent;
    }
    public set globalClickingBonusPercent(value: number) {
        this._globalClickingBonusPercent = value;
    }
    public get globalClickingBonusRaw(): number {
        return this._globalClickingBonusRaw;
    }
    public set globalClickingBonusRaw(value: number) {
        this._globalClickingBonusRaw = value;
    }

    public get clickPower(): number {
        return this._clickPower;
    }
    public set clickPower(value: number) {
        this._clickPower = value;
    }

    public get globalProductionBonusRaw(): number {
        return this._globalProductionBonusRaw;
    }
    public set globalProductionBonusRaw(value: number) {
        this._globalProductionBonusRaw = value;
    }
    public get globalProductionBonusPercent(): number {
        return this._globalProductionBonusPercent;
    }
    public set globalProductionBonusPercent(value: number) {
        this._globalProductionBonusPercent = value;
    }
    public get buildings(): Map<number, BuildingData> {
        return this._buildings;
    }
    public set buildings(value: Map<number, BuildingData>) {
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
