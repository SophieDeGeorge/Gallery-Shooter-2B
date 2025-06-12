class GalleryShooter extends Phaser.Scene {
    constructor() {
        super("galleryShooter");

        // Initialize a class variable "my" which is an object.
        // The object has two properties, both of which are objects
        //  - "sprite" holds bindings (pointers) to created sprites
        //  - "text"   holds bindings to created bitmap text objects
        this.my = {sprite: {}, text: {}};

        // Create a property inside "sprite" named "bullet".
        // The bullet property has a value which is an array.
        // This array will hold bindings (pointers) to bullet sprites
        this.my.sprite.bullet = [];   
        this.maxBullets = 10;           // Don't create more than this many bullets

        this.my.sprite.enemyBullet = [];
        this.maxenemyBullets = 10;
        
        this.myScore = 0;       // record a score as a class variable
        // More typically want to use a global variable for score, since
        // it will be used across multiple scenes
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("elephant", "elephant.png");
        this.load.image("heart", "heart.png");
        this.load.image("hippo", "hippo.png");
        this.load.image("giraffe", "giraffe.png");

        // For animation
        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");

        // Load the Kenny Rocket Square bitmap font
        // This was converted from TrueType format into Phaser bitmap
        // format using the BMFont tool.
        // BMFont: https://www.angelcode.com/products/bmfont/
        // Tutorial: https://dev.to/omar4ur/how-to-create-bitmap-fonts-for-phaser-js-with-bmfont-2ndc
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        // Sound asset from the Kenny Music Jingles pack
        // https://kenney.nl/assets/music-jingles
        this.load.audio("dadada", "jingles_NES13.ogg");
    }



    create() {
        let my = this.my;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                    //INIT

            // Path points
        this.hippo1Points = [
            20, 20,
            750, 100,
            20, 200,
            750, 300,
            20, 400,
            700, 700
        ];

        this.hippo2Points = [
            20, 20,
            750, 100,
            20, 200,
            750, 300,
            20, 400,
            700, 700
        ];

        this.hippo3Points = [
            20, 20,
            750, 100,
            20, 200,
            750, 300,
            20, 400,
            700, 700
        ];


        this.giraffePoints = [
            20, 20,
            100, 800,
            300, 20,
            400, 800,
            600, 20,
            700, 800,
            900, 20

        ]; 


            // Create spline curve
        this.curve = new Phaser.Curves.Spline(this.hippo1Points);

        this.giraffeCurve = new Phaser.Curves.Spline(this.giraffePoints);

            // Phaser graphics
        this.graphics = this.add.graphics();

////////////////////////////////////////////////////////////////////////////////////////////////

            // Hippo 1 variables
        this.hippo1ShootTimer = 10000;
        this.hippo1ShootTime = 10000;
        this.hippo1dead = false;
        this.hippo1Spawned = false;

            // Hippo 2 variables
        this.hippo2ShootTimer = 13000;
        this.hippo2ShootTime = 10000;
        this.hippo2dead = false;
        this.hippo2Spawned = false;

            // Hippo 3 variables
        this.hippo3ShootTimer = 15000;
        this.hippo3ShootTime = 10000;
        this.hippo3dead = false;
        this.hippo3Spawned = false;


        this.giraffeDead = false;
        this.giraffeSpawned = false;
        

///////////////////////////////////////////////////////////////////////////////////////////////

        this.canSpawnGiraffe = false;
        this.canSpawnHippo = true;
        this.spawnDelayTime = 2000;
        this.spawnDelay = this.spawnDelayTime;

        this.lives = 3;
        this.playerHit = false;
        this.iFrames = 2000;
        this.invincibilityTimer = this.iFrames;


        
        this.resetTime = 20000;
        this.resetTimer = this.resetTime;
        this.lost = false;
        this.hippoWaves = 3;

                                                                    //INIT END
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                    //SPRITES

        my.sprite.elephant = this.add.sprite(game.config.width/2, game.config.height - 40, "elephant");
        my.sprite.elephant.setScale(0.25);

        this.hippo1 = this.add.follower(this.curve, -100, 80, "hippo");
        this.hippo1.setScale(0.25);
        this.hippo1.scorePoints = 25;
        this.hippo1.visible = false;

        this.hippo2 = this.add.follower(this.curve, -100, 80, "hippo");
        this.hippo2.setScale(0.25);
        this.hippo2.scorePoints = 25;
        this.hippo2.visible = false;

        this.hippo3 = this.add.follower(this.curve, -100, 80, "hippo");
        this.hippo3.setScale(0.25);
        this.hippo3.scorePoints = 25;
        this.hippo3.visible = false;

        this.giraffe = this.add.follower(this.giraffeCurve, -100, 80, "giraffe");
        this.giraffe.setScale(0.25);
        this.giraffe.scorePoints = 50;
        this.giraffe.visible = false;
        


                                                                    //SPRITES END
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                    //ANIMATIONS

        // Create white puff animation
        this.anims.create({
            key: "puff",
            frames: [
                { key: "whitePuff00" },
                { key: "whitePuff01" },
                { key: "whitePuff02" },
                { key: "whitePuff03" },
            ],
            frameRate: 20,
            repeat: 1,
            lifeSpan: 1,
            hideOnComplete: true
        });

                                                                    //ANIMATIONS END
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                    //KEY OBJECTS

        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.rKey = this.input.keyboard.addKey("R");

                                                                    //KEY OBJECTS END
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 15;
        this.bulletSpeed = 35;
        this.enemyBulletSpeed = 15;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                    //TEXT

        // update HTML description
        document.getElementById('description').innerHTML = '<br>A: left // D: right // Space: shoot'

        // Put score on screen
        my.text.score = this.add.bitmapText(580, 0, "rocketSquare", "Score " + this.myScore);
        my.text.lives = this.add.bitmapText(580, 30, "rocketSquare", "Lives " + this.lives);

        // Put title on screen
        this.add.text(5, 5, "Elephant Cupid", {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: {
                width: 60
            }
        });

                                                                    //TEXT END
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }




    update(time, delta) {
        let my = this.my;
        //console.log(this.hippo1ShootTimera);
        if ((this.hippo1dead == true) && (this.hippo2dead == true) && (this.hippo3dead == true) && (this.canSpawnGiraffe == false)) {
            this.canSpawnGiraffe = true;
            this.spawnDelay = this.spawnDelayTime;
        }
        this.hippo1ShootTimer -= delta * 3;
        this.hippo2ShootTimer -= delta * 3;
        this.hippo3ShootTimer -= delta * 3;

        if ((this.hippoWaves > 0) || (this.giraffeSpawned == false)) {
            this.spawnDelay -= delta * 3;
            if (this.spawnDelay < 0) {
                this.canSpawnHippo = true;
                if ((this.hippo1dead == true) && (this.hippo2dead == true) && (this.hippo3dead == true)) {
                    this.canSpawnGiraffe = true;
                }
            }
        }
        if (this.lost == true) {
            this.resetTimer -= delta * 3;
        }
        if (this.resetTimer <= 0) {
            this.scene.restart()
        }
        if (this.hippo1dead == true) {
            this.hippo1.stopFollow();
            this.hippo1.y = -100;
            this.hippo1dead;
        }
        if (this.hippo2dead == true) {
            this.hippo2.stopFollow();
            this.hippo2.y = -100;
            this.hippo2dead;
        }
        if (this.hippo3dead == true) {
            this.hippo3.stopFollow();
            this.hippo3.y = -100;
            this.hippo3dead;
        }
        if (this.giraffeDead == true) {
            this.giraffe.stopFollow();
            this.giraffe.y = -100;
        }
        if (this.playerHit == true) {
            this.invincibilityTimer -= delta * 3;
                if (this.invincibilityTimer <= 0) {
                    this.playerHit = false;
                }
        }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                    //MOVEMENT

        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.elephant.x > (my.sprite.elephant.displayWidth/2)) {
                my.sprite.elephant.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.elephant.x < (game.config.width - (my.sprite.elephant.displayWidth/2))) {
                my.sprite.elephant.x += this.playerSpeed;
            }
        }

                                                                    //MOVEMENT END
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                    //SHOOTING
        // Check for bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            // Are we under our bullet quota?
            if (my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.elephant.x, my.sprite.elephant.y-(my.sprite.elephant.displayHeight/2), "heart")
                );
            }
        }

//
            //enemy shooting
        if ((this.hippo1ShootTimer <= 0) && (this.hippo1.visible == true)) {
            // Are we under our bullet quota?
            if (my.sprite.enemyBullet.length < this.maxenemyBullets) {
                my.sprite.enemyBullet.push(this.add.sprite(this.hippo1.x, this.hippo1.y-(this.hippo1.displayHeight/2), "heart"));
                console.log(this.hippo1ShootTimer);
                this.hippo1ShootTimer = this.hippo1ShootTime;
            }
        }
        if ((this.hippo2ShootTimer <= 0) && (this.hippo2.visible == true)) {
            // Are we under our bullet quota?
            if (my.sprite.enemyBullet.length < this.maxenemyBullets) {
                my.sprite.enemyBullet.push(this.add.sprite(this.hippo2.x, this.hippo2.y-(this.hippo2.displayHeight/2), "heart"));
                console.log(this.hippo2ShootTimer);
                this.hippo2ShootTimer = this.hippo2ShootTime;
            }
        }
        if ((this.hippo3ShootTimer <= 0) && (this.hippo3.visible == true)) {
            // Are we under our bullet quota?
            if (my.sprite.enemyBullet.length < this.maxenemyBullets) {
                my.sprite.enemyBullet.push(this.add.sprite(this.hippo3.x, this.hippo3.y-(this.hippo3.displayHeight/2), "heart"));
                console.log(this.hippo3ShootTimer);
                this.hippo3ShootTimer = this.hippo3ShootTime;
            }
        }
//
                                                                    //SHOOTING END
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                    //COLLISIONS

            // get rid of bullets past boundaries
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));
        my.sprite.enemyBullet = my.sprite.enemyBullet.filter((enemyBullet) => enemyBullet.y > (enemyBullet.displayHeight));

        // Check for collision with the hippo
        for (let bullet of my.sprite.bullet) {
            if (this.collides(this.hippo1, bullet)) {
                // start animation
                this.puff = this.add.sprite(this.hippo1.x, this.hippo1.y, "whitePuff03").setScale(0.25).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                //this.hippo1.visible = false;
                this.hippo1.y = -100;
                // Update score
                this.myScore += this.hippo1.scorePoints;
                this.updateScore();
                // Play sound
                this.sound.play("dadada", {
                    volume: 0.20
                }); 
                this.hippo1dead = true;
            }

            if (this.collides(this.hippo2, bullet)) {
                // start animation
                this.puff = this.add.sprite(this.hippo2.x, this.hippo2.y, "whitePuff03").setScale(0.25).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                //this.hippo2.visible = false;
                this.hippo2.y = -100;
                // Update score
                this.myScore += this.hippo2.scorePoints;
                this.updateScore();
                // Play sound
                this.sound.play("dadada", {
                    volume: 0.20
                }); 
                this.hippo2dead = true;
            }

            if (this.collides(this.hippo3, bullet)) {
                // start animation
                this.puff = this.add.sprite(this.hippo3.x, this.hippo3.y, "whitePuff03").setScale(0.25).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                //this.hippo3.visible = false;
                this.hippo3.y = -100;
                // Update score
                this.myScore += this.hippo3.scorePoints;
                this.updateScore();
                // Play sound
                this.sound.play("dadada", {
                    volume: 0.20
                }); 
                this.hippo3dead = true;
            }

            if (this.collides(this.giraffe, bullet)) {
                // start animation
                this.puff = this.add.sprite(this.giraffe.x, this.giraffe.y, "whitePuff03").setScale(0.25).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                //this.hippo1.visible = false;
                this.giraffe.y = -100;
                // Update score
                this.myScore += this.giraffe.scorePoints;
                this.updateScore();
                // Play sound
                this.sound.play("dadada", {
                    volume: 0.20
                }); 
                this.giraffeDead = true;
                this.youWon();
            }
        }

        // collision check bullet-player
        for (let enemyBullet of my.sprite.enemyBullet) {
            if (this.collides(my.sprite.elephant, enemyBullet) && (this.playerHit == false)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.elephant.x, my.sprite.elephant.y, "whitePuff03").setScale(0.25).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                enemyBullet.y = -1000;
                
                //this.invincibilityTimer = this.iFrames;
                this.updateLives();
                // Play sound
                this.sound.play("dadada", {
                    volume: 0.20
                }); 
                

            }
        }

        // check for player-hippo collision
        
            if (this.collides(this.hippo1, my.sprite.elephant) && (this.playerHit == false)) {
                this.puff = this.add.sprite(this.hippo1.x, this.hippo1.y, "whitePuff03").setScale(0.25).play("puff");
                this.hippo1.stopFollow();
                console.log("stopfollow");
                this.hippo1.x = -100;
                console.log("move hippo");
                this.hippo1dead = true;
                
                    // Update Lives
                
                this.updateLives();
                this.sound.play("dadada", {
                    volume: 0.20
                });
            }

            if (this.collides(this.hippo2, my.sprite.elephant) && (this.playerHit == false)) {
                this.puff = this.add.sprite(this.hippo2.x, this.hippo2.y, "whitePuff03").setScale(0.25).play("puff");
                this.hippo2.stopFollow();
                console.log("stopfollow");
                this.hippo2.x = -100;
                console.log("move hippo");
                this.hippo2dead = true;
                
                    // Update Lives
                
                this.updateLives();
                this.sound.play("dadada", {
                    volume: 0.20
                });
            }

            if (this.collides(this.hippo3, my.sprite.elephant) && (this.playerHit == false)) {
                this.puff = this.add.sprite(this.hippo3.x, this.hippo3.y, "whitePuff03").setScale(0.25).play("puff");
                this.hippo3.stopFollow();
                console.log("stopfollow");
                this.hippo3.x = -100;
                console.log("move hippo");
                this.hippo3dead = true;
                
                    // Update Lives
            
                this.updateLives();
                this.sound.play("dadada", {
                    volume: 0.20
                });
            }

            if (this.collides(this.giraffe, my.sprite.elephant) && (this.playerHit == false)) {
                this.puff = this.add.sprite(this.giraffe.x, this.giraffe.y, "whitePuff03").setScale(0.25).play("puff");
                this.giraffe.stopFollow();
                console.log("stopfollow");
                this.giraffe.x = -100;
                console.log("move hippo");
                this.giraffeDead = true;
                this.youWon();
                
                    // Update Lives
                
                this.updateLives();
                this.sound.play("dadada", {
                    volume: 0.20
                });
            }
        

                                                                    //COLLISIONS END
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        if ((this.hippoWaves > 0) && (this.hippo1Spawned == false)) {
                           
            if (this.curve.points[0]) {
                this.hippo1.x = this.curve.points[0].x;
                this.hippo1.y = this.curve.points[0].y;
            } else {
                              
                this.hippo1.x = 0;
                this.hippo1.y = 0;
            }

            this.followConfig = {
                from: 0,
                to: 1,
                delay: 0,
                duration: 15000,
                ease: 'Linear',
                repeat: -1,
                yoyo: false,
                rotateToPath: true,
                rotationOffset: -90
            }
             
            if (this.hippo1dead == false) {
                this.hippoWaves--;
                this.hippo1.startFollow(this.followConfig);
                this.hippo1.visible = true;
                this.spawnDelay = this.spawnDelayTime;
                this.canSpawnHippo = false;
                this.hippo1Spawned = true;
                console.log("this.hippoWaves " + this.hippoWaves)
                console.log("this.spawnDelay " + this.spawnDelay)
            }
        }

        if ((this.hippoWaves > 0) && (this.canSpawnHippo == true) && (this.hippo2Spawned == false)) {
                           
            if (this.curve.points[0]) {
                this.hippo2.x = this.curve.points[0].x;
                this.hippo2.y = this.curve.points[0].y;
                console.log("No hippo points");
            } else {
                              
                this.hippo2.x = 0;
                this.hippo2.y = 0;
                
                console.log("hippo else ");
            }

            this.followConfig = {
                from: 0,
                to: 1,
                delay: 0,
                duration: 15000,
                ease: 'Linear',
                repeat: -1,
                yoyo: false,
                rotateToPath: true,
                rotationOffset: -90
            }
             
            if (this.hippo2dead == false) {
                this.hippoWaves--;
                this.hippo2.startFollow(this.followConfig);
                this.hippo2.visible = true;
                this.hippo2Spawned = true;
                this.spawnDelay = this.spawnDelayTime;
                this.canSpawnHippo = false;
            }
        }

        if ((this.hippoWaves > 0) && (this.canSpawnHippo == true) && (this.hippo3Spawned == false)) {
                           
            if (this.curve.points[0]) {
                this.hippo3.x = this.curve.points[0].x;
                this.hippo3.y = this.curve.points[0].y;
                console.log("No hippo points");
            } else {
                              
                this.hippo3.x = 0;
                this.hippo3.y = 0;
            }

            this.followConfig = {
                from: 0,
                to: 1,
                delay: 0,
                duration: 15000,
                ease: 'Linear',
                repeat: -1,
                yoyo: false,
                rotateToPath: true,
                rotationOffset: -90
            }
             
            if (this.hippo3dead == false) {
                this.hippoWaves--;
                this.hippo3.startFollow(this.followConfig);
                this.hippo3.visible = true;
                this.hippo3Spawned = true;
                this.spawnDelay = this.spawnDelayTime;
                this.canSpawnHippo = false;
                this.giraffeDead = false;
            }
        }



        if ((this.canSpawnGiraffe == true) && (this.giraffeSpawned == false)) {
            // giraffe code
            
            if (this.giraffeCurve.points[0]) {
                this.giraffe.x = this.giraffeCurve.points[0].x;
                this.giraffe.y = this.giraffeCurve.points[0].y;
                console.log("No points");
            } else {
                              
                this.giraffe.x = 0;
                this.giraffe.y = 0;
                console.log("else ");
            }
                
               /*
            if (this.curve.points[0]) {
                this.giraffe.x = this.curve.points[0].x;
                this.giraffe.y = this.curve.points[0].y;
                console.log("No points");
            } else {
                              
                this.giraffe.x = 0;
                this.giraffe.y = 0;
                console.log("else ");
            }
                */

            this.followConfig = {
                from: 0,
                to: 1,
                delay: 0,
                duration: 5000,
                ease: 'Linear',
                repeat: -1,
                yoyo: false,
                rotateToPath: true,
                rotationOffset: -90
            }

            if ((this.giraffeDead == false) && (this.giraffeSpawned == false)) {
                console.log("inside");
                this.giraffe.startFollow(this.followConfig);
                this.giraffe.visible = true;
                this.giraffeSpawned = true;
            }
        }




        // Make all of the bullets move
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }
        for (let enemyBullet of my.sprite.enemyBullet) {
            enemyBullet.y += this.enemyBulletSpeed;
        }

    }

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
    }
    youLost() {
        let my = this.my;
        my.text.lose = this.add.bitmapText(300, 300, "rocketSquare", "YOU LOSE! ");
        this.lost = true;
    }
    youWon() {
        let my = this.my;
        // reset all variables
            // Hippo 1 variables
        this.hippo1ShootTimer = 10000;
        this.hippo1ShootTime = 10000;
        this.hippo1dead = false;
        this.hippo1Spawned = false;

            // Hippo 2 variables
        this.hippo2ShootTimer = 13000;
        this.hippo2ShootTime = 10000;
        this.hippo2dead = false;
        this.hippo2Spawned = false;

            // Hippo 3 variables
        this.hippo3ShootTimer = 15000;
        this.hippo3ShootTime = 10000;
        this.hippo3dead = false;
        this.hippo3Spawned = false;


        //this.giraffeDead = false;
        this.giraffeSpawned = false;
        

///////////////////////////////////////////////////////////////////////////////////////////////

        this.canSpawnGiraffe = false;
        this.canSpawnHippo = true;
        this.spawnDelayTime = 2000;
        this.spawnDelay = this.spawnDelayTime;

        //this.lives = 3;
        this.playerHit = false;
        this.iFrames = 2000;
        this.invincibilityTimer = this.iFrames;


        
        this.resetTime = 20000;
        this.resetTimer = this.resetTime;
        this.lost = false;
        this.hippoWaves = 3;
    }
    updateLives() {
        let my = this.my;
        if (this.playerHit == false) {
            this.lives--;
            my.text.lives.setText("Lives " + this.lives);
            if (this.lives <= 0) {
                this.youLost();
            }
            this.playerHit = true;
            this.invincibilityTimer = this.iFrames;
        }
    }



}
         