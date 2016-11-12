/// <reference path="../node_modules/phaser/typescript/phaser.d.ts"/>

// import { Loading } from './states/loading';
import { Menu } from './states/menu';
// Import additional states here

export class MyGame extends Phaser.Game {
    constructor() {
        super(800, 600);

        // this.state.add('Loading', Loading);
        this.state.add('Menu', Menu);

        this.state.start('Menu');
    }
}

new MyGame(); // This kicks everything off
