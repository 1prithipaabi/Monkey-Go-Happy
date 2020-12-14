
var monkey, monkey_running
var monkeyCrash;
var banana ,bananaImage, obstacle, obstacleImage;
var bananaSound;
var music;
var foodGroup, obstacleGroup;
var survivalTime = 0;
var bg, bg2, bgImage;
var ground, invisibleGround,groundImage;
var score = 0;
var gameState = 'PLAY'
var gameOver,gameOverImage, gameOverSound;
var restart,restartImage;
var small;


function preload(){
  
  //Load animations
  monkey_running =            loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png");
  monkeyCrash = loadAnimation("monkeyCrash.png");
  
  //Load images
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  bgImage = loadImage("HD-Jungle-Wallpaper.jpg");
  groundImage = loadImage("dirt.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  
  //Load sound
  bananaSound = loadSound("Splach Sound Effect.mp3");
  music = loadSound("Monkeys Spinning Monkeys.mp3");
  gameOverSound = loadSound("SAD MUSIC 2.mp3");
  small = loadSound("RUBBER DUCK (1).mp3");
}



function setup() {
  music.loop();
  //Create canvas
  createCanvas(650,400);
  
  //Create background
  bg = createSprite(100,200,400,400);
  bg.addImage(bgImage);
  bg.scale = 1.2;
  
  //Create ground
  ground = createSprite(400,350,900,10);
  ground.shapeColor = 'green';
  ground.addImage(groundImage);
  
  //Create invisible ground
  invisibleGround = createSprite(400,320,900,10);
  invisibleGround.visible = false;

  //Create monkey
  monkey = createSprite(80,315,20,20);
  monkey.scale = 0.1;
  monkey.addAnimation("running", monkey_running);
  monkey.addAnimation("crashed",monkeyCrash);
  monkey.setCollider('rectangle',20,20);
  //Create groups
  obstacleGroup = new Group();
  foodGroup = new Group();
  
  gameOver = createSprite(300,200);
  gameOver.addImage(gameOverImage)
  gameOver.visible = false;
  gameOver.scale = 0.1;
  gameOver.depth = monkey.depth;
  gameOver.depth = 2;
  
  restart = createSprite(400,200);
  restart.addImage(restartImage);
  restart.scale = 0.1;
  restart.visible = false;
}


function draw() {
  gameState = 'PLAY';
 if( gameState === 'PLAY'){
     
    //Set background velocity 
    bg.velocityX = -6;
    if(bg.x<0){
      bg.x = bg.width/2; 
    }
    
    //Set ground velocity
    ground.velocityX = -6;
    if(ground.x<0){
      ground.x = ground.width/2;
    }
  
    //Monkey jump
    if(keyDown('space') && monkey.y>=200){
      monkey.velocityY = -12;
    }
    monkey.velocityY = monkey.velocityY + 0.8;
    monkey.collide(invisibleGround);
  
    //Call obstacles and food
    if(frameCount%80 === 0){
      bananas();
    }
    if(frameCount%300 === 0){
      obstacles();
    }
  
    //Collect bananas
    if(foodGroup.isTouching(monkey)){
      score = score +2;
      foodGroup.destroyEach();
      bananaSound.play();
    }
    survivalTime= Math.ceil(frameCount/frameRate());
  }

   
  switch(score){
    case 10: monkey.scale = 0.12;
    break;
    case 20: monkey.scale = 0.14;
    break;
    case 30: monkey.scale = 0.16;
    break;
    case 40: monkey.scale = 0.18;
    break;
    case 50: monkey.scale = 0.20;
    break;
    default: break;
    
       }
  //END GAME
   if(obstacleGroup.isTouching(monkey) && monkey.scale === 0.12 || monkey.scale === 0.14 || monkey.scale === 0.16 || monkey.scale === 0.18 || monkey.scale === 0.20){
    monkey.scale = 0.1;
    small.play();
      obstacle.destroy();
  }
  
  if(monkey.scale === 0.1 && obstacleGroup.isTouching(monkey)){
    gameState = 'END';
    
  }
   if(gameState === 'END'){
     bg.velocityX = 0;
     ground.velocityX = 0;
     obstacleGroup.setVelocityXEach(0);
     foodGroup.setVelocityXEach(0);
     monkey.velocityY = 5;
     foodGroup.setLifetimeEach(-1);
     obstacleGroup.setLifetimeEach(-1);
     survivalTime = 0;
     monkey.changeAnimation("crashed",monkeyCrash);
     gameOver.visible = true;
     restart.visible = true;
     gameOverSound.play();
     music.stop();
     
  }
  
  if(mousePressedOver(restart)){
    reset();
  }
  
  drawSprites();
  
  //Display score
  textSize(40);
  stroke('white');
  text("Score: "+ score, 20,120);
  
  //Display survival time
  textSize(40);
  stroke('yellow');
  text("Survival Time: "+ survivalTime, 190,50);

}

function obstacles(){
  obstacle = createSprite(700,300);
  obstacle.addImage(obstacleImage);
  obstacle.velocityX = -6;
  obstacle.scale = 0.2;
  obstacle.lifetime = 700;
  obstacleGroup.add(obstacle);
}

function bananas(){
  banana = createSprite(700,200);
  banana.y = Math.round(random(100,180));
  banana.addImage(bananaImage);
  banana.velocityX = -6;
  banana.scale = 0.1;
  banana.lifetime = 700;
  foodGroup.add(banana);
}

function reset(){
  gameState = 'PLAY';
  gameOver.visible = false;
  restart.visible = false;
  gameOverSound.stop();
  music.loop();
  obstacleGroup.destroyEach();
  foodGroup.destroyEach();
  monkey.changeAnimation("running",monkey_running);
  monkey.scale = 0.1;
  score = 0;
}


