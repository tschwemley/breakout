export class Breakout extends Phaser.State {
  sprite: Phaser.TileSprite;

  bricks: Phaser.Group;

  paddle: Phaser.Sprite;

  ball: Phaser.Sprite;
  
  scoreText: Phaser.Text;

  livesText: Phaser.Text;

  introText: Phaser.Text;

  ballOnPaddle: boolean;

  lives: int;
  
  score: int;

  init() {
    this.ballOnPaddle = true;
    this.lives = 3;
    this.score = 0;
  }
  
  preload() {
    this.load.atlas('breakout', 'assets/images/breakout.png', 'assets/breakout.json');
    this.load.image('starfield', 'assets/images/starfield.jpg');
  }

  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // Check bound collisons against top, left, right walls
    this.game.physics.arcade.checkCollision.down = false;

    this.sprite = this.game.add.tileSprite(0, 0, 800, 600, 'starfield');
    
    this._initBricks();

    this._initPaddle();
    this._initBall();
    this._gameText();

    // Add input to release ball
    this.game.input.onDown.add(this.releaseBall, this);
  }

  update() {
    this.paddle.x = this.game.input.x;

    if (this.paddle.x < 24)
      this.paddle.x = 24;
    else if (this.paddle.x > this.game.width - 24)
      this.paddle.x = this.game.width;
    
    if (this.ballOnPaddle)
    {
      this.ball.body.x = this.paddle.x;
    }
    else
    {
      this.game.physics.arcade.collide(this.ball, this.paddle, this.ballHitPaddle,
                                      null, this);
      this.game.physics.arcade.collide(this.ball, this.bricks, this.ballHitBrick,
                                       null, this);
    }
  }

  // render() {
  //   // this.game.debug.inputInfo(32, 32);
  //   this.game.debug.spriteInfo(this.paddle, 32, 32);
  //   this.game.debug.spriteInfo(this.ball, 400, 32);
  // }

  releaseBall() {
    if(this.ballOnPaddle)
    { 
      this.ballOnPaddle = false;
      this.ball.body.velocity.y = -300;
      this.ball.body.velocity.x = -75;
      this.ball.animations.play('spin');
    }
  }

  ballLost() {
    this.lives--;
    this.livesTest = 'Lives: ' + this.lives;

    if (this.lives === 0)
    {
      // TODO: make this into a gameover state
      this.game.state.start('Menu');
    }
    else
    {
      this.ballOnPaddle = true;

      this.ball.reset(this.paddle.body.x + 16, this.paddle.y - 16);

      this.ball.animations.stop();

      this.livesText.text = 'Lives: ' + this.lives;
    }
  }

  ballHitBrick(_ball, _brick) {
    _brick.kill();

    // Update score and display
    this.score += 10;
    this.scoreText.text = 'Score: ' + this.score;

    // Any bricks left?
    if (this.bricks.countLiving() === 0)
    {
      // New level
      this.score += 1000
      this.scoreText.text = 'Score: ' + score;

      // Move ball back to paddle
      this.ballOnPaddle = true;
      this.ball.body.velocity.set(0);
      this.ball.x = this.paddle.x + 16;
      this.ball.y = this.paddle.y - 16;
      this.ball.animations.stop();

      // Bring bricks back from the dead
      this.bricks.callAll('revive');
    }
  }

  ballHitPaddle(_ball, _paddle) {
    var diff = 0;

    // console.log('ball x: ' + _ball.x);
    // console.log('paddlw x: ' + _paddle.x);
    // return;
    if(_ball.x < _paddle.x) 
    {
      // Ball on paddle left
      console.log('left');
      diff = _paddle.x - _ball.x; 
      console.log('velocity before: ' + _ball.body.velocity.x);
      _ball.body.velocity.x = (-10 * diff);
      console.log('velocity after: ' + _ball.body.velocity.x);
    }
    else if(_ball.x > _paddle.x)
    {
      // Ball on paddle right
      console.log('right');
      diff = _ball.x -_paddle.x;
      console.log('velocity before: ' + _ball.body.velocity.x);
      _ball.body.velocity.x = (10 * diff);
      console.log('velocity after: ' + _ball.body.velocity.x);
    }
    else 
    {
      console.log('middle');
      // Ball perfectly in middle. Add random X to stop bouncing straight up.
      console.log('velocity before: ' + _ball.body.velocity.x);
      _ball.body.velocity.x = 2 + Math.random() * 8;
      console.log('velocity after: ' + _ball.body.velocity.x);
    }
  }

  _initBricks() {
    this.bricks = this.game.add.group();
    this.bricks.enableBody = true;
    this.bricks.physicsBodyType = Phaser.Physics.ARCADE;

    var brick;

    // Create bricks - 15 blocks per row; 4 rows. Each row uses different image
    for (var y = 0; y < 4; y++)
    {
      for (var x = 0; x < 15; x++)
      {
        let brickX = 120 + (x*36);
        let brickY = 100 + (y*52);
        let brickFrame = 'brick_' + (y+1) + '_1.png';

        brick = this.bricks.create(brickX, brickY, 'breakout', brickFrame);
        brick.body.bounce.set(1);
        brick.body.immovable = true;
      }
    }
  }

  _initPaddle() {
    // Init paddle and set physics props
    this.paddle = this.game.add.sprite(this.game.world.centerX, 500, 'breakout',
                                      'paddle_big.png');
    this.paddle.anchor.set(0.5, 0.5);
    this.game.physics.enable(this.paddle, Phaser.Physics.ARCADE);
    this.paddle.body.collideWorldBounds = true;
    this.paddle.body.bounce.set(1);
    this.paddle.body.immovable = true;
  }

  _initBall() {
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

    this.ball.events.onOutOfBounds.add(this.ballLost, this);
  }

  _gameText() {
    var fontStyle = {
      font: "20px Arial",
      fill: '#ffffff',
      align: 'left'
    }

    this.scoreText = this.game.add.text(32, 550, 'Score: 0', fontStyle);
    this.livesText = this.game.add.text(680, 550, 'Lives: 3', fontStyle);
  }
}
