var gameState = "play";

var Background, BackgroundImg;

var ghost, ghostImg, ghostImg2;

var door, doorImg, doorGroup;
var climber, climberImg, climberGroup;
var block, blockGroup;

var spookySound;

function preload (){
  BackgroundImg = loadImage("tower.png");
  
  ghostImg  = loadImage("ghost-standing.png");
  ghostImg2 = loadImage("ghost-jumping.png");
  
  doorImg = loadImage("door.png");
  
  climberImg = loadImage("climber.png");
  
  spookySound = loadSound("spooky.wav");  
}

function setup (){
  createCanvas(700,550);
  
  Background = createSprite(350,225, 700, 550);
  Background.addImage("tower", BackgroundImg);
  Background.velocityY = 1;
  Background.y = Background.width/2;
  
  ghost = createSprite(350,225,20,20);
  ghost.addImage("standing", ghostImg);
  ghost.addImage("jumping", ghostImg2);
  ghost.scale = 0.4;
  
  //set collider area for ghost
  ghost.setCollider("rectangle", -40, 20, 100, 200);
  
  doorGroup = new Group();
  
  climberGroup = new Group();
  
  blockGroup = new Group();
}

function draw (){
  background("white");
  
  if(gameState==="play"){
    
    //reset background
    if(Background.y>550){
      Background.y = Background.width/2;
    }
    
    //play spooky sound
    spookySound.loop();

    //move ghost up when space key is pressed
    if(keyDown("space")){
      ghost.velocityY = -6;
      ghost.changeAnimation("jumping", ghostImg2);
    }
    
    //add gravity
    ghost.velocityY = ghost.velocityY + 0.8;

    //move ghost left or right with arrow keys
    if(keyDown("right_arrow")){
      ghost.x = ghost.x+2;
    }
    if(keyDown("left_arrow")){
      ghost.x = ghost.x-2;
    }
    
    //rest the ghost on climber
    if(ghost.isTouching(climberGroup)){
      ghost.collide(climberGroup);
      ghost.velocityY = 0;
      ghost.changeAnimation("standing", ghostImg);
    }
    
    //spawn doors
    spawnDoors();
    
    //end if ghost touches door underside or goes out of tower from below
    if(ghost.isTouching(blockGroup)||ghost.y>550){
      gameState="end";
    }
  }
  
  if(gameState==="end"){
    //destroy ghost and doors
    ghost.destroy();
    doorGroup.destroyEach();
    climberGroup.destroyEach();
    blockGroup.destroyEach();
    
    //change background to black
    Background.visible = false;
    background("black");
    
    //display game over text
    fill("yellow");
    textSize(40);
    text("GAME OVER", 250, 250);
  }
  
  drawSprites();
}

function spawnDoors(){
  if(frameCount%240===0){
    door = createSprite(50, -40,15,15);
    door.addImage("door", doorImg);
    door.velocityY=1;
    
    //give random x position to door
    door.x = Math.round(random(150,450));
    door.lifetime = 550;
    doorGroup.add(door);
    
    climber = createSprite(50, 20, 15, 5);
    climber.addImage("climber", climberImg);
    climber.velocityY = 1;
    
    //set collider area for climber
    climber.setCollider("rectangle", 0, -10, 100, 10);
    
    //climber and door come together
    climber.x = door.x;
    
    climber.lifetime = 550;
    climberGroup.add(climber);
    
    block = createSprite(50, 23, 80, 15);
    
    //block size = climber size
    block.width = climber.width;
    
    block.velocityY = 1;
    
    //block and climber come together
    block.x = climber.x;
    
    block.lifetime = 550;
    
    //make block invisible
    block.visible = false;
    
    blockGroup.add(block);
    
    //ghost infront of door
    door.depth = ghost.depth;
    ghost.depth = ghost.depth + 1;
  }
}