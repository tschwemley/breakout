export class Menu extends Phaser.State {
  text: Phaser.Text;

  create() {
    // Make sure only one pointer can be active at a time
    this.game.input.maxPointers = 1;

    var fontStyle = {
      font: '48px Arial',
      fill: '#73dcfc'
    };

    this.text = this.add.text(this.world.centerX, this.world.centerY, 'Play', fontStyle);
    this.text.anchor.setTo(0.5, 0.5);
    this.text.inputEnabled = true;

    this.text.input.useHandCursor = true;
  }

  update() {
    var activePointerId = this.game.input.activePointer.id;

    if(this.text.input.pointerOver(activePointerId) 
        && this.text.input.justReleased(activePointerId))
    {
      console.log('nyx');
    }
  }
}
