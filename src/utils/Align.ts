export class Align {
	static scaleToGameW(game: any, obj: any, per: any) {
		obj.displayWidth = game.config.width * per;
		obj.scaleY = obj.scaleX;
	}
	static centerH(game: any, obj: any) {
		obj.x = game.config.width / 2 - obj.displayWidth / 2;
	}
	static centerV(game: any, obj: any) {
		obj.y = game.config.height / 2 - obj.displayHeight / 2;
	}
	static center2(game: any, obj: any) {
		obj.x = game.config.width / 2 - obj.displayWidth / 2;
		obj.y = game.config.height / 2 - obj.displayHeight / 2;
	}
	static center(game: any, obj: any) {
		obj.x = game.config.width / 2;
		obj.y = game.config.height / 2;
	}
}
