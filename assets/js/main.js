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

let touching;

let windowPre;
let graphics;

let bricks = [];
let brickRowCount = 5;
let brickColumnCount = 12;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 5;
let brickOffsetTop = 50;
let brickOffsetLeft = 80;


function setup() {

    brickWidth = windowWidth / 13.51;
    brickHeight = windowHeight / 26;
    brickPadding = windowWidth / 384;
    brickOffsetTop = windowWidth / 21.6;
    brickOffsetLeft = windowWidth / 24;

    createCanvas(windowWidth, windowHeight);
    //graphics for text and paddle
    graphics = createGraphics(windowWidth, windowHeight);

    fill(128);
    paddle = createVector(windowWidth / 2, windowHeight * 0.85, 100); // X, Y, Width
    windowPre = createVector(windowWidth, windowHeight);

    //start ellipse at middle top of screen
    position = createVector((width / 2) + (paddle.z / 2), paddle.y - (r * 2));

    //calculate initial random velocity
    velocity = p5.Vector.random2D();
    if (velocity.y > 0) {
        velocity.y *= -1;
    }
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
    noCanvas();
    createCanvas(windowWidth, windowHeight);
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
                    speed += 0.1;
                }
                // bottom collision
                if (position.y <= b.y + brickHeight + r && position.y >= b.y + brickHeight && position.x >= b.x - r && position.x <= b.x + r + brickWidth) {
                    velocity.y *= -1;
                    b.status = 0;
                    score++;
                    speed += 0.1;
                }
                // left collision
                if (position.x >= b.x - r && position.x <= b.x && position.y >= b.y - r && position.y <= b.y + r + brickHeight) {
                    velocity.x *= -1;
                    b.status = 0;
                    score++;
                    speed += 0.1;
                }
                // right collision
                if (position.x <= b.x + r + brickWidth && position.x >= b.x + brickWidth && position.y >= b.y - r && position.y <= b.y + r + brickHeight) {
                    velocity.x *= -1;
                    b.status = 0;
                    score++;
                    speed += 0.1;
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

    if (gameOver == 1) {
        fill(20, 22);
        rect(0, 0, width, height);
    }

    if (gameOver != 1) {
        //draw background
        fill(0);
        rect(0, 0, width, height);
        graphics.fill(0, 12);
        graphics.noStroke();
        graphics.rect(0, 0, width, height);
        image(graphics, 0, 0)

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
        let relativeIntersectX = (paddle.x + (paddle.z / 2)) - position.x;
        let normalizedRelativeIntersectionX = (relativeIntersectX / (paddle.z / 2));
        let bounceAngle = normalizedRelativeIntersectionX * 75;

        velocity.y = speed*Math.cos(bounceAngle);
        velocity.x = speed*-Math.sin(bounceAngle);
        if (velocity.y > 0) {
            velocity.y *= -1;
        }
    }
    /*
    // collision for left side of paddle
    if (position.x >= paddle.x - r && position.x <= paddle.x && position.y >= paddle.y - r && position.y <= paddle.y + r + 20) {
        velocity.x *= -1;
    }
    // collision for right side of paddle
    if (position.x <= paddle.x + r + paddle.z && position.x >= paddle.x + paddle.z && position.y >= paddle.y - r && position.y <= paddle.y + r + 20) {
        velocity.x *= -1;
    }
     */
    // controls for moving paddle
    if (left_arrow && paddle.x > 0) {
        paddle.x -= 5;
    }
    if (right_arrow && paddle.x + paddle.z < width) {
        paddle.x += 5;
    }
    if (touching && paddle.x + paddle.z < width && paddle.x > 0) {
        if (mouseX > (paddle.z / 2) && mouseX < windowWidth - (paddle.z / 2)) {
            paddle.x = mouseX - (paddle.z / 2)
        }
    }
}

function touchStarted() {
    touching = true;
    // prevent default
    return false;
}

function touchEnded() {
    touching = false;
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