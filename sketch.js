let video;
let poseNet;
let pose;

var gameScreen = 0;

var ballSize = 20;  
var ballX;          
var ballY;          
var ballColor;

var gravity = 1;
var ballSpeedVert = 0;
var ballSpeedHorizon= 7;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  ballX = width/2;              
  ballY = height/4;             
  ballColor = color(20, 150, 200);
}

function gotPoses(poses) {
 // console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
  }
}

function modelLoaded(){
  console.log('poseNet ready');
}

function initScreen(){
 
  textAlign(CENTER);                
  fill(52, 73, 94);                 
  textSize(90);                     
  text("乒 乓", width/2, height/2); 

  fill(92,167,182);                   
  noStroke();                         
  rectMode(CENTER);                  
  rect(width/2, height-35, 100,30,5); 
  fill(236,240,241);                  
  textSize(15);                       
  text("START", width/2, height-30);
}

function draw() {
  image(video, 0, 0); 
  if (gameScreen == 0){
    initScreen();
  }
  
  if (gameScreen == 1){
    gameplayScreen();
  }
}

function mousePressed(){
  if (gameScreen == 0){
    startGame();
  }
}

function startGame() {       
  gameScreen=1;             
}

function gameplayScreen(){
  if (pose) {
    fill(0,0,255);
    //rect (pose.leftWrist.x,pose.leftWrist.y,60, 20)
    rect (pose.rightWrist.x,pose.rightWrist.y,80,20,3)
  }
  
  fill(ballColor);                            
  ellipse(ballX, ballY, ballSize, ballSize);
  
  ballSpeedVert += gravity;
  ballY += ballSpeedVert;
  
  ballX += ballSpeedHorizon;
  
  keepInScreen();
  watchRacketBounce();
}

function makeBounceBottom(surface) {  
  ballY = surface-(ballSize/2);       
  ballSpeedVert*=-1;                  
}

function makeBounceTop(surface) {    
  ballY = surface+(ballSize/2);       
  ballSpeedVert*=-1;                 
}

function makeBounceLeft(surface){
  ballX = surface+(ballSize/2);
  ballSpeedHorizon*=-1;
}

function makeBounceRight(surface) {
  ballX = surface-(ballSize/2);
  ballSpeedHorizon*=-1;
}

function keepInScreen() {
  if (ballY+(ballSize/2) > height) { 
    makeBounceBottom(height);         
  }
  
  if (ballY-(ballSize/2) < 0) {
    makeBounceTop(0);                 
  }
  
  if (ballX-(ballSize/2) < 0) {     
    makeBounceLeft(0);               
  }
  
  if (ballX+(ballSize/2) > width) {   
    makeBounceRight(width);  
  }
}

function watchRacketBounce() {
  if(pose){
    if (ballY+(ballSize/2) > pose.rightWrist.y && 
        ballX-(ballSize/2) < pose.rightWrist.x+40 &&
        ballX+(ballSize/2) > pose.rightWrist.x-40
       ) {
      makeBounceBottom(pose.rightWrist.y);
      ballSpeedHorizon = (ballX - pose.rightWrist.x)/4;
    }

  }
}
