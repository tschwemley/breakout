export class Breakout extends Phaser.State {
  sprite: Phaser.TileSprite;

  bricks: Phaser.Group;

  paddle: Phaser.Sprite;

  ball: Phaser.Sprite;

  preload() {
    this.load.atlas('breakout', 'assets/images/breakout.png', 'assets/breakout.json');
    this.load.image('starfield', 'assets/images/starfield.jpg');
  }

  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // Check bound collisons against top, left, right walls
    this.game.physics.arcade.checkCollision.down = false;

    this.sprite = this.game.add.tileSprite(0, 0, 800, 600, 'starfield');
    
    this.bricks = this.game.add.group();
    this.bricks.enableBody = true;
    this.bricks.physicsBodyType = Phaser.Physics.ARCADE;

    var brick = this.createBlocks();

    // Init paddle and set physics props
    this.paddle = this.game.add.sprite(this.game.world.centerX, 500, 'breakout',
                                      'paddle_big.png');
    this.game.physics.enable(this.paddle, Phaser.Physics.ARCADE);
    this.paddle.body.collideWorldBounds = true;
    this.paddle.body.bounce.set(1);
    this.paddle.body.immovable = true;

    // Init ball and set physics props
    this.ball = this.game.add.sprite(this.game.world.centerX, this.paddle.y - 16, 
                                    'breakout', 'ball_1.png');
    this.ball.anchor.set(0.5);
    this.ball.checkWorldBounds = true;
    this.game.physics.enable(this.ball, Phaser.Physics.ARCADE);
    this.ball.body.collideWorldBounds = true;
    this.ball.body.bounce.set(1);

    // Set ball animations
    this. ball.animations.add('spin', [ 
        'ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png' ], 
        50, true, false);

    // this.ball.events.onOutOfBounds.add(ballLost, this);
  }

  createBlocks() {
    var brick;

    // Create blocks - 15 blocks per row; 4 rows. Each row uses different image
    for (var y = 0; y < 4; y++)
    {
      for (var x = 0; x < 15; x++)
      {
        brick = this.bricks.create(120 + (x*36), 100 + (y*52), 'breakout', 
            'brick_' + (y+1) + '_1.png');
      }
    }

    return brick;
  }
}
