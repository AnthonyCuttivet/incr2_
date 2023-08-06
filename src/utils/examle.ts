import Phaser, { GameObjects, Input, Math } from 'phaser';

interface GameData {
  game: any;
  goldGainTextPool: any;
  levelKillsText: any;
  levelText: any;
  levelUI: any;
  world: {};
  dpsTimer: any;
  buttons: any;
  upgradePanel: any;
  coins: any;
  playerGoldText: any;
  dmgTextPool: any;
  monsterHealthText: any;
  monsterNameText: any;
  monsterInfoUI: any;
  currentMonster: any;
  monsters: any;
  background: any;
  player: any,
}

var GAMEDATA: GameData = {
  player: undefined,
  monsterHealthText: undefined,
  monsterNameText: undefined,
  monsterInfoUI: undefined,
  currentMonster: undefined,
  monsters: undefined,
  background: undefined,
  dmgTextPool: undefined,
  playerGoldText: undefined,
  coins: undefined,
  upgradePanel: undefined,
  buttons: undefined,
  dpsTimer: undefined,
  world: {},
  levelKillsText: undefined,
  levelText: undefined,
  levelUI: undefined,
  goldGainTextPool: undefined,
  game: undefined
};

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: window.innerWidth,
    height: window.innerHeight,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: '#123456',
};

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  preload(): void {

    // this.load.scenePlugin(
    //   'PhaserDebugDrawPlugin',
    //   'https://cdn.jsdelivr.net/npm/phaser-plugin-debug-draw@7.1.0',
    //   'debugDraw',
    //   'debugDraw'
    // );

    // load in data
    this.load.image('forest-back', 'assets/parallax_forest_pack/layers/parallax-forest-back-trees.png');
    this.load.image('forest-lights', 'assets/parallax_forest_pack/layers/parallax-forest-lights.png');
    this.load.image('forest-middle', 'assets/parallax_forest_pack/layers/parallax-forest-middle-trees.png');
    this.load.image('forest-front', 'assets/parallax_forest_pack/layers/parallax-forest-front-trees.png');

    this.load.image('aerocephal', 'assets/allacrost_enemy_sprites/aerocephal.png');
    this.load.image('arcana_drake', 'assets/allacrost_enemy_sprites/arcana_drake.png');
    this.load.image('aurum-drakueli', 'assets/allacrost_enemy_sprites/aurum-drakueli.png');
    this.load.image('bat', 'assets/allacrost_enemy_sprites/bat.png');
    this.load.image('daemarbora', 'assets/allacrost_enemy_sprites/daemarbora.png');
    this.load.image('deceleon', 'assets/allacrost_enemy_sprites/deceleon.png');
    this.load.image('demonic_essence', 'assets/allacrost_enemy_sprites/demonic_essence.png');
    this.load.image('dune_crawler', 'assets/allacrost_enemy_sprites/dune_crawler.png');
    this.load.image('green_slime', 'assets/allacrost_enemy_sprites/green_slime.png');
    this.load.image('nagaruda', 'assets/allacrost_enemy_sprites/nagaruda.png');
    this.load.image('rat', 'assets/allacrost_enemy_sprites/rat.png');
    this.load.image('scorpion', 'assets/allacrost_enemy_sprites/scorpion.png');
    this.load.image('skeleton', 'assets/allacrost_enemy_sprites/skeleton.png');
    this.load.image('snake', 'assets/allacrost_enemy_sprites/snake.png');
    this.load.image('spider', 'assets/allacrost_enemy_sprites/spider.png');
    this.load.image('stygian_lizard', 'assets/allacrost_enemy_sprites/stygian_lizard.png');

    this.load.image('gold_coin', 'assets/496_RPG_icons/I_GoldCoin.png');
    this.load.image('dagger', 'assets/496_RPG_icons/W_Dagger002.png');
    this.load.image('swordIcon1', 'assets/496_RPG_icons/S_Sword15.png');

    GAMEDATA.game = this;

    // Game world
    GAMEDATA.world = {
      level: 1,
      levelKills: 0,
      levelKillsRequired: 10,
    };

    // the main player
    GAMEDATA.player = {
      clickDmg: 1,
      gold: 50,
      dps: 0
    };
  }

  create(): void {
    var game = this;
    var width = gameConfig.scale?.width as number;
    var height = gameConfig.scale?.height as number;

    // Background
    GAMEDATA.background = game.add.group();
    ['forest-back', 'forest-lights', 'forest-middle', 'forest-front'].forEach(function (image) {
      game.add.tileSprite(width / 2, height / 2, width, height, image, '');
    });

    // build panel for upgrades
    GAMEDATA.upgradePanel = this.add.container(15, 100);
    var menu = this.add.rectangle(0, 0, 250, 500, 0x9a783d).setOrigin(0, 0);
    menu.strokeColor = 0x35371c;
    menu.setStrokeStyle(12, 0x35371c, 1);
    GAMEDATA.buttons = GAMEDATA.upgradePanel.add(menu);

    // Upgrades data
    var upgradeButtonsData = [
      {
        icon: 'dagger', name: 'Attack', level: 0, cost: 5, purchaseHandler: function (button, player) {
          player.clickDmg += 1;
        }
      },
      {
        icon: 'swordIcon1', name: 'Auto-Attack', level: 0, cost: 25, purchaseHandler: function (button, player) {
          player.dps += 1;
        }
      }
    ];

    upgradeButtonsData.forEach(function (buttonData, index) {
      var button = game.add.container(10, 10 + (index * 55));
      var buttonBG = game.add.rectangle(0, 0, 230, 48, 0xe6dec7).setOrigin(0, 0);
      buttonBG.setStrokeStyle(4, 0x35371c, 1);
      button.add(buttonBG);

      button.setData('buttonData', buttonData);

      button.add(game.add.image(24, 24, buttonData.icon));
      var text = game.add.text(60, 4, buttonData.name + ':' + buttonData.level, { font: '16px Arial' }).setColor('#000000');
      var costText = game.add.text(60, 24, 'Cost: ' + buttonData.cost, { font: '16px Arial' }).setColor('#000000');

      button.setData('text', text);
      button.setData('costText', costText);

      button.add(text);
      button.add(costText);

      buttonBG.setInteractive().on('pointerup', () => {
        game.onUpgradeClicked(button);
      });

      GAMEDATA.upgradePanel.add(button);
      GAMEDATA.buttons.add(button);
    });

    // setup the world progression display
    GAMEDATA.levelUI = this.add.container().setPosition(this.cameras.main.centerX, 30);
    var levelText = this.add.text(0, 0, 'Level: ' + GAMEDATA.world.level, {
      font: '24px Arial',
      color: '#000000',
      stroke: '#ffffff',
      strokeThickness: 4
    });

    GAMEDATA.levelText = levelText;
    GAMEDATA.levelUI.add(levelText);

    var levelKillsText = this.add.text(0, 30, 'Kills: ' + GAMEDATA.world.levelKills + '/' + GAMEDATA.world.levelKillsRequired, {
      font: '24px Arial',
      color: '#000000',
      stroke: '#ffffff',
      strokeThickness: 4
    });

    GAMEDATA.levelKillsText = levelKillsText;
    GAMEDATA.levelUI.add(levelKillsText);

    // Monsters
    GAMEDATA.monsters = game.add.group();
    GAMEDATA.monsters.name = "Monsters";

    var monsterData = [
      { name: 'Aerocephal', image: 'aerocephal', maxHealth: 10 },
      { name: 'Arcana Drake', image: 'arcana_drake', maxHealth: 20 },
      { name: 'Aurum Drakueli', image: 'aurum-drakueli', maxHealth: 30 },
      { name: 'Bat', image: 'bat', maxHealth: 5 },
      { name: 'Daemarbora', image: 'daemarbora', maxHealth: 10 },
      { name: 'Deceleon', image: 'deceleon', maxHealth: 10 },
      { name: 'Demonic Essence', image: 'demonic_essence', maxHealth: 15 },
      { name: 'Dune Crawler', image: 'dune_crawler', maxHealth: 8 },
      { name: 'Green Slime', image: 'green_slime', maxHealth: 3 },
      { name: 'Nagaruda', image: 'nagaruda', maxHealth: 13 },
      { name: 'Rat', image: 'rat', maxHealth: 2 },
      { name: 'Scorpion', image: 'scorpion', maxHealth: 2 },
      { name: 'Skeleton', image: 'skeleton', maxHealth: 6 },
      { name: 'Snake', image: 'snake', maxHealth: 4 },
      { name: 'Spider', image: 'spider', maxHealth: 4 },
      { name: 'Stygian Lizard', image: 'stygian_lizard', maxHealth: 20 }
    ];

    var monster;
    monsterData.forEach(function (data) {
      // create a sprite for them off screen
      monster = GAMEDATA.monsters.create(width / 2, height / 2, data.image);

      // center anchor
      monster.health = monster.maxHealth = data.maxHealth;
      monster.alive = true;

      monster.originX = 0.5;
      monster.originY = 1;
      monster.visible = false;

      // reference to the database
      monster.details = data;

      //enable input so we can click it!
      monster.setInteractive();
      monster.on('pointerdown', game.onClickMonster);
    });

    // display the monster front and center
    GAMEDATA.currentMonster = GAMEDATA.monsters.getChildren()[Math.Between(0, GAMEDATA.monsters.getLength() - 1)];
    GAMEDATA.currentMonster.setPosition(this.cameras.main.centerX, this.cameras.main.centerY + 50);
    GAMEDATA.currentMonster.visible = true;

    // Monster infos
    GAMEDATA.monsterInfoUI = game.add.container();
    GAMEDATA.monsterInfoUI.setPosition(GAMEDATA.currentMonster.x + 150, GAMEDATA.currentMonster.y - 50);

    var monsterNameText = game.add.text(0, 0, GAMEDATA.currentMonster.details.name, {
      font: '48px Arial Black',
      color: '#fff',
      stroke: '#000000',
      strokeThickness: 4
    });
    GAMEDATA.monsterInfoUI.add(monsterNameText);

    var monsterHealthText = game.add.text(0, 80, GAMEDATA.currentMonster.health + ' HP', {
      font: '32px Arial Black',
      color: '#ff0000',
      strokeThickness: 4
    })

    GAMEDATA.monsterHealthText = GAMEDATA.monsterInfoUI.add(monsterHealthText);

    GAMEDATA.monsterNameText = monsterNameText;
    GAMEDATA.monsterHealthText = monsterHealthText;

    // Dmg
    GAMEDATA.dmgTextPool = this.add.group();
    var dmgText;
    for (var i = 0; i < 50; i++) {
      dmgText = this.add.text(0, 0, '1', {
        font: '64px Arial Black',
        color: '#fff',
        strokeThickness: 4
      });

      dmgText.setName("DMGText_" + i);

      // start out not existing, so we don't draw it yet
      dmgText.visible = false;
      dmgText.active = false;

      GAMEDATA.dmgTextPool.add(dmgText);
    }

    // Gold gain
    GAMEDATA.goldGainTextPool = this.add.group();
    var goldGainText;
    for (var i = 0; i < 50; i++) {
      goldGainText = this.add.text(0, 0, '+1g', {
        font: '64px Arial',
        color: '#f5b642',
        stroke: '#fff',
        strokeThickness: 4
      });

      goldGainText.setName("GoldGainText" + i);

      // start out not existing, so we don't draw it yet
      goldGainText.visible = false;
      goldGainText.active = false;

      GAMEDATA.goldGainTextPool.add(goldGainText);
    }

    // create a pool of gold coins
    GAMEDATA.coins = this.add.group();

    for (let i = 0; i < 50; i++) {
      var coin = GAMEDATA.coins.create(0, 0, 'gold_coin', '', false);
      coin.visible = false;
      coin.active = false;
      coin.inputEnabled = true;
      coin.setName('coin_' + i);
      coin.setData('goldValue', 1);
      coin.setData('index', i);

      coin.setInteractive().on('pointerdown', () => {
        game.onClickCoin(i);
      });
    }

    GAMEDATA.playerGoldText = this.add.text(30, 30, 'Gold: ' + GAMEDATA.player.gold, {
      font: '24px Arial Black',
      color: '#000000',
      stroke: '#fff',
      strokeThickness: 4
    });


    GAMEDATA.dpsTimer = this.time.addEvent({
      delay: 100,
      callback: this.onDPS,
      callbackScope: this,
      loop: true
    });

    var cheatTimer = this.time.addEvent({
      delay: 100,
      callback: this.onClickMonster,
      callbackScope: this,
      loop: true
    });

  }

  onClickMonster(): void {
    var game = GAMEDATA.game;
    GAMEDATA.currentMonster.health = Math.RoundTo(GAMEDATA.currentMonster.health - GAMEDATA.player.clickDmg);

    // grab a damage text from the pool to display what happened
    var dmgText = GAMEDATA.dmgTextPool.getFirstDead(false);

    if (dmgText) {

      var pos = game.input === undefined ? [GAMEDATA.currentMonster.x, GAMEDATA.currentMonster.y] : [game.cameras.main.centerX, game.cameras.main.centerY];

      dmgText.setText(GAMEDATA.player.clickDmg);
      dmgText.active = true;
      dmgText.visible = true;
      dmgText.setPosition(pos[0], pos[1]);
      dmgText.alpha = 1;

      dmgText.tween = game.tweens.add({
        targets: dmgText,
        alpha: 0,
        x: { start: dmgText.x, to: dmgText.x + Math.Between(0, 150) },
        y: { start: dmgText.y, to: dmgText.y - Math.Between(100, 250) },
        duration: 1000,
        ease: 'Cubic',
        onComplete: (tween) => {
          GAMEDATA.dmgTextPool.killAndHide(dmgText);
          game.tweens.killTweensOf(dmgText);
        }
      });
    }

    if (GAMEDATA.currentMonster.health <= 0) {
      GAMEDATA.currentMonster.alive = false;
      game.onKilledMonster(GAMEDATA.currentMonster);
    }

    GAMEDATA.monsterHealthText.setText(GAMEDATA.currentMonster.alive ? GAMEDATA.currentMonster.health + ' HP' : 'DEAD');
  }

  onKilledMonster(monster: GameObjects.GameObject): void {
    var game = this.scene as unknown as Game;
    monster.visible = false;
    GAMEDATA.currentMonster = GAMEDATA.monsters.getChildren()[Math.Between(0, GAMEDATA.monsters.getLength() - 1)];

    var coin;
    // spawn a coin on the ground
    coin = GAMEDATA.coins.getFirstDead(false);
    coin.setPosition(this.cameras.main.centerX + Math.Between(-100, 100), this.cameras.main.centerY + Math.Between(-100, 100));
    coin.active = true;
    coin.visible = true;
    coin.setData('goldValue', Math.RoundTo(GAMEDATA.world.level * 1.33));

    game.scene.time.delayedCall(1000, this.onClickCoin, [coin.getData('index')]);

    GAMEDATA.world.levelKills++;

    GAMEDATA.levelText.setText('Level: ' + GAMEDATA.world.level);
    GAMEDATA.levelKillsText.setText('Kills: ' + GAMEDATA.world.levelKills + '/' + GAMEDATA.world.levelKillsRequired);

    if (GAMEDATA.world.levelKills >= GAMEDATA.world.levelKillsRequired) {
      GAMEDATA.world.level++;
      GAMEDATA.world.levelKills = 0;
    }

    this.onRevivedMonster(GAMEDATA.currentMonster);
  }

  onRevivedMonster(monster: GameObjects.GameObject): void {
    monster.health = Math.CeilTo(monster.maxHealth + (GAMEDATA.world.level - 1) * 10.6);
    monster.alive = true;
    monster.visible = true;

    // update the text display
    GAMEDATA.monsterNameText.setText(monster.details.name);
    GAMEDATA.monsterHealthText.setText(monster.health + 'HP');
  }

  onClickCoin(index: number): void {
    var coin = GAMEDATA.coins.children.entries[index];

    if (!coin.visible) {
      return;
    }

    // grab a damage text from the pool to display what happened
    var goldGainText = GAMEDATA.goldGainTextPool.getFirstDead(false);

    if (goldGainText) {
      goldGainText.setText('+' + coin.getData('goldValue') + 'g');
      goldGainText.active = true;
      goldGainText.visible = true;
      goldGainText.setPosition(coin.x, coin.y);
      goldGainText.alpha = 1;

      var tween = GAMEDATA.game.tweens.add({
        targets: goldGainText,
        alpha: 0,
        x: { start: goldGainText.x, to: goldGainText.x + Math.Between(0, 75) },
        y: { start: goldGainText.y, to: goldGainText.y - Math.Between(0, 100) },
        duration: 2000,
        ease: 'Cubic',
        onComplete: (tween) => {
          GAMEDATA.goldGainTextPool.killAndHide(goldGainText);
          GAMEDATA.game.tweens.killTweensOf(goldGainText);
        }
      });
    }

    // give the player gold
    GAMEDATA.player.gold += coin.getData('goldValue');
    // update UI
    GAMEDATA.playerGoldText.setText('Gold: ' + GAMEDATA.player.gold);
    // remove the coin
    coin.visible = false;
    coin.active = false;
  }

  onUpgradeClicked(button: GameObjects.GameObject): void {

    var buttonData = button.getData('buttonData');

    function getAdjustedCost() {
      return Math.CeilTo(buttonData.cost + (buttonData.level * 1.46));
    }

    if (GAMEDATA.player.gold - getAdjustedCost() < 0) {
      return;
    }

    GAMEDATA.player.gold -= getAdjustedCost();
    GAMEDATA.playerGoldText.text = 'Gold: ' + GAMEDATA.player.gold;

    buttonData.level++;
    button.getData('text').text = button.getData('buttonData').name + ':' + buttonData.level;
    button.getData('costText').text = 'Cost: ' + getAdjustedCost();
    buttonData.purchaseHandler.call(this, buttonData, GAMEDATA.player);
  }

  onDPS(): void {
    var game = this.scene as unknown as Game;
    if (GAMEDATA.player.dps <= 0) {
      return;
    }

    if (GAMEDATA.currentMonster && GAMEDATA.currentMonster.alive) {
      var dmg = GAMEDATA.player.dps / 10;
      GAMEDATA.currentMonster.health -= dmg;
      // update the health text
      GAMEDATA.monsterHealthText.text = GAMEDATA.currentMonster.alive ? Math.RoundTo(GAMEDATA.currentMonster.health, 0) + ' HP' : 'DEAD';

      if (GAMEDATA.currentMonster.health <= 0) {
        GAMEDATA.currentMonster.alive = false;
        this.onKilledMonster(GAMEDATA.currentMonster);
      }
    }
  }

}

gameConfig.scene = [Game];

const game = new Phaser.Game(gameConfig);


