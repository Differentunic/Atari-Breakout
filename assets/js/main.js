// Variables related to moving ball
let position;
let velocity;
let r = 6;
let speed = 3.5;

let paddle

let score = 0;
let gameOver = 0;

let left_arrow;
let right_arrow;

let windowPre;
let graphics;

let bricks = [];
let brickRowCount = 6;
let brickColumnCount = 16;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 50;
let brickOffsetLeft = 80;

function setup() {
    createCanvas(windowWidth, windowHeight);
    //graphics for text and paddle
    graphics = createGraphics(windowWidth, windowHeight);

    fill(128);
    paddle = createVector(windowWidth / 2, windowHeight * 0.85, 100); // X, Y, Width
    windowPre = createVector(windowWidth, windowHeight);

    //start ellipse at middle top of screen
    position = createVector((width / 2) + (paddle.z / 2), paddle.y - r - 1);

    //calculate initial random velocity
    velocity = p5.Vector.random2D();
    velocity.mult(speed);

    graphics.fill(10);
    graphics.noStroke();
    graphics.rect(0, 0, width, height);

    for(let c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(let r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

}
function windowResized() {
    if (position.x > windowWidth){
        position.x = windowWidth * (position.x / windowPre.x);
    }
    if (position.y > windowHeight){
        position.y = windowHeight * (position.y / windowPre.y);
    }
    if (paddle.x + paddle.z > windowWidth){
        paddle.x = windowWidth * (paddle.x / windowPre.x);
    }
    paddle.y = windowHeight * 0.85;
    windowPre.x = windowWidth;
    windowPre.y = windowHeight;
    resizeCanvas(windowWidth, windowHeight);
    graphics.remove();

    graphics = createGraphics(windowWidth, windowHeight);
}
// function for drawing bricks
function drawBricks() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                fill("white")
                rect(brickX, brickY, brickWidth, brickHeight);
            }
        }
    }
}
// function for brick collition detection
async function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status == 1) {
                // top collision
                if (position.y >= b.y - r && position.y <= b.y + r && position.x >= b.x - r && position.x <= b.x + r + brickWidth) {
                    velocity.y *= -1;
                    b.status = 0;
                    score++;
                }
                // bottom collision
                if (position.y <= b.y + brickHeight + r && position.y >= b.y + brickHeight && position.x >= b.x - r && position.x <= b.x + r + brickWidth) {
                    velocity.y *= -1;
                    b.status = 0;
                    score++;
                }
                // left collision
                if (position.x >= b.x - r && position.x <= b.x && position.y >= b.y - r && position.y <= b.y + r + brickHeight) {
                    velocity.x *= -1;
                    b.status = 0;
                    score++;
                }
                // right collision
                if (position.x <= b.x + r + brickWidth && position.x >= b.x + brickWidth && position.y >= b.y - r && position.y <= b.y + r + brickHeight) {
                    velocity.x *= -1;
                    b.status = 0;
                    score++;
                }
            }
        }
    }
}
// function for drawing score
function drawScore() {
    textSize(22);
    fill("white");
    textAlign(CENTER, TOP);
    text("SCORE: "+score, width / 2, height / 64);
}
function drawBall() {
    graphics.noStroke();
    graphics.fill(255);
    graphics.ellipse(position.x, position.y, r * 2, r * 2);
    //move ball
    position.add(velocity);
}
function drawPaddle() {
    fill("white");
    rect(paddle.x, paddle.y, paddle.z, 20);
}

function draw() {
    //draw background
    fill(0);
    rect(0, 0, width, height);
    graphics.fill(0, 12);
    graphics.noStroke();
    graphics.rect(0, 0, width, height);
    image(graphics, 0, 0)

    if (gameOver == 1) {
        fill(255, 80);
        rect(0, 0, width, height);
    }


    if (gameOver != 1) {
        //draw paddle
        drawPaddle()
        //draw ball
        drawBall();
        //draw bricks
        drawBricks();
        //collition detection
        collisionDetection();
        //draw score
        drawScore();
    }

    // detect boundary collision
    // right
    if (position.x > width - r) {
        position.x = width - r;
        velocity.x *= -1;
    }
    // left
    if (position.x < r) {
        position.x = r;
        velocity.x *= -1;
    }
    // top
    if (position.y < r) {
        position.y = r;
        velocity.y *= -1;

    }
    // bottom
    if (position.y > height - r) {
        gameOver = 1;
        textSize(102);
        fill("white");
        textAlign(CENTER, CENTER);
        text("GAME OVER \n SCORE: "+score, width / 2, height / 2);
    }
    // collision for top of paddle
    if (position.y >= paddle.y - r && position.y <= paddle.y + r && position.x >= paddle.x - r && position.x <= paddle.x + r + paddle.z) {
        velocity.y *= -1;
    }
    // collision for left side of paddle
    if (position.x >= paddle.x - r && position.x <= paddle.x && position.y >= paddle.y - r && position.y <= paddle.y + r + 20) {
        velocity.x *= -1;
    }
    // collision for right side of paddle
    if (position.x <= paddle.x + r + paddle.z && position.x >= paddle.x + paddle.z && position.y >= paddle.y - r && position.y <= paddle.y + r + 20) {
        velocity.x *= -1;
    }
    // controls for moving paddle
    if (left_arrow) {
        paddle.x -= 5;
    }
    if (right_arrow) {
        paddle.x += 5;
    }
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        left_arrow = true;
    }
    if (keyCode === RIGHT_ARROW) {
        right_arrow = true;
    }
}

function keyReleased() {
    if (keyCode === LEFT_ARROW) {
        left_arrow = false;
    }
    if (keyCode === RIGHT_ARROW) {
        right_arrow = false;
    }
    return false; // prevent any default behavior
}