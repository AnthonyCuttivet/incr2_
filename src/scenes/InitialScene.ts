import Phaser, { Scene } from 'phaser';
import { Align } from '../utils/Align';
import { AlignGrid } from '../utils/AlignGrid';
import { UIBlock } from '../utils/UIBlock';
import { Building } from '../prefabs/Building';
import { PlayerUtils } from '../utils/Game/PlayerUtils';
import { HUDUtils } from '../utils/Game/HUDUtils';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { FixWidthSizer, Label, SetChildrenInteractive, Sizer } from 'phaser3-rex-plugins/templates/ui/ui-components';

export default class InitialScene extends Phaser.Scene {
    private background!: Phaser.GameObjects.Rectangle;
    building_button!: UIBlock;
    rexUI!: RexUIPlugin

    constructor() {
        super('initial');
    }

    create(): void {

        this.background = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, this.cameras.main.width, this.cameras.main.height, 0x232323);

        HUDUtils.CreateHUD(this.game, this);

        const COLOR_PRIMARY = 0x4e342e;
        const COLOR_LIGHT = 0x7b5e57;
        const COLOR_DARK = 0x260e04;

        var scrollablePanel = this.rexUI.add.scrollablePanel({
            x: 400,
            y: 300,
            width: 360,
            height: 460,

            scrollMode: 0,

            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_PRIMARY),

            panel: {
                child: createGrid(this, 3),
                mask: {
                    padding: 1,
                }
            },

            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 3, COLOR_DARK),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 3, COLOR_LIGHT),
                hideUnscrollableSlider: true,
                // position: 'left'
            },

            mouseWheelScroller: {
                focus: false,
                speed: 0.1
            },

            // header: this.rexUI.add.label({
            //     height: 30,

            //     orientation: 0,
            //     background: this.rexUI.add.roundRectangle(0, 0, 20, 20, 0, COLOR_DARK),
            //     text: this.add.text(0, 0, 'Header'),
            // }),

            // footer: this.rexUI.add.label({
            //     height: 30,

            //     orientation: 0,
            //     background: this.rexUI.add.roundRectangle(0, 0, 20, 20, 0, COLOR_DARK),
            //     text: this.add.text(0, 0, 'Footer'),
            // }),

            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,

                panel: 10,
                header: 10,
                footer: 10,
            }
        }).layout();

        scrollablePanel
            .setChildrenInteractive({})
            .on('child.click', function (child: Label, pointer: any, event: any) {
                PlayerUtils.AddClickingPower(1000000);
                child.destroy();
                scrollablePanel.layout();
            });

        function createGrid(scene: InitialScene, size: number) {
            // Create table body
            var sizer = scene.rexUI.add.fixWidthSizer({
                space: {
                    left: 1,
                    right: 1,
                    top: 1,
                    bottom: 1,
                    item: 1,
                    line: 1,
                },
            }).addBackground(scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, 0xff0000));

            for (var i = 0; i < size; i++) {
                var label = scene.rexUI.add.label({
                    width: 60, height: 60,

                    background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 5, COLOR_LIGHT),
                    icon: scene.add.image(25, 35, 'icon_clover'),

                    align: 'center',
                    space: {
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 10,
                    }
                });

                sizer.add(label);
            }

            // console.log(sizer);

            return sizer;
        }



        this.time.addEvent({
            delay: 100,
            callback: () => {
                PlayerUtils.AddCurrency(PlayerUtils.GetPlayerData().cps / 10);
            },
            callbackScope: this,
            loop: true
        });


        this.background.setInteractive().on('pointerup', () => {
            PlayerUtils.AddCurrency(PlayerUtils.GetPlayerData().clickPower);
        });
    }
}
