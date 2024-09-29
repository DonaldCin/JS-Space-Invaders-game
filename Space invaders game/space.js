//board
let tileSize = 46;
let row = 16;
let col = 16;

let board;
let boardWidth = tileSize * col;
let boardHeight = tileSize * row;
let context;

//ship
let shipWidth = tileSize * 2;
let shipHeight = tileSize * 2;
let shipX = tileSize * col/2 - tileSize;
let shipY = tileSize * row - tileSize*2;

let ship = {
    x : shipX,
    y : shipY,
    width : shipWidth,
    height : shipHeight
}

let shipImg;
let shipVelocityX = tileSize; //Speed

//Aliens
let alienArray = [];
let alienWidth = tileSize*2
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg; 

let alienRow = 2;
let alienCol = 3;
let alienCount = 0;
let alienVelocityX = 1;

//bullets
let bulletArray = [];
let bulletVelocityY = -10;

let score = 0;
let gameOver = false;

window.onload = function(){
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    //load image
    shipImg = new Image();
    shipImg.src = "Images/ship.png";
    shipImg.onload = function() {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }

    alienImg = new Image();
    alienImg.src = "Images/alien-" + getRandomColor() + ".png";

    createAliens();

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
}

//UPDATE
function update(){
    requestAnimationFrame(update);

    if(gameOver){
        return;
    }

    context.clearRect(0, 0, board.width, board.height)

    //draw ship 
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);


    //draw aliens, movement
    for(let i = 0; i < alienArray.length; i++){
        let alien = alienArray[i];
        if (alien.alive){
            alien.x += alienVelocityX;
            if(alien.x + alien.width >= boardWidth || alien.x <= 0){
                alienVelocityX *= -1;
                alien.x += alienVelocityX*2;
                for(let j=0; j < alienArray.length; j++){
                    alienArray[j].y += alienHeight;
                }
            }
            context.drawImage(alien.img, alien.x, alien.y, alien.width, alien.height);

            if (alien.y >= ship.y){
                gameOver = true;
            }
        }
    }

    //draw bullets
    for(let i = 0; i < bulletArray.length; i++){
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;
        context.fillStyle="white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        //collison
        for(let j = 0; j < alienArray.length; j++){
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)){
                bullet.used = true;
                alien.alive = false;
                alienCount --;
                score += 100;
            }
        }
    }

    while(bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift();
    }

    //next level
    if(alienCount == 0){
        alienCol = Math.min(alienCol + 1, col/2 - 2);
        alienRow = Math.min(alienRow + 1, row - 4);
        alienVelocityX += 0.2;
        alienArray = [];
        bulletArray = [];
        createAliens();
    }

    //score
    context.fillStyle = "white";
    context.font = "40px Pixelify Sans";
    context.fillText(score, 10, 40);

}

//movement
function moveShip(e){

    if(gameOver){
        return;
    }

    if(e.code == "KeyA" && ship.x -shipVelocityX >= 0) {
        ship.x -= shipVelocityX; //move left
    }
    else if(e.code == "KeyD" && ship.x + shipVelocityX + ship.width <= boardWidth){
        ship.x += shipVelocityX; //move right
    }
}

//create enemies
function createAliens(){
    for(let c = 0; c < alienCol; c++){
        for(let r = 0; r < alienRow; r++){
            let alien = {
                img : alienImg,
                x : alienX + c * alienWidth,
                y : alienY + r *  alienHeight,
                width : alienWidth,
                height : alienHeight,
                alive : true
            }

            alienArray.push(alien);

        }
    }
    alienCount = alienArray.length;
}

//shooting
function shoot(e){

    if(gameOver){
        return;
    }

    if(e.code == "Space"){
        let bullet = {
            x : ship.x + shipWidth*22/46,
            y : ship.y, 
            width : tileSize/8,
            height : tileSize/2,
            used : false,
        }
        bulletArray.push(bullet);
    }
}

//collison 
function detectCollision(a, b){
    return a.x < b.x + b.width && 
           a.x + a.width > b.x &&
           a.y < b.y + b.height && 
           a.y + a.height > b.y;
}

//random color
function getRandomColor() {
    // Generate a random number between 0 and 3 (inclusive)
    let randomNumber = Math.floor(Math.random() * 4);
    if(randomNumber == 0){
        return "white;"
    }
    else if(randomNumber == 1){
        return "cyan";
    }
    else if(randomNumber == 2){
        return "magenta";
    }
    else if(randomNumber == 3){
        return "yellow";
    }
}
