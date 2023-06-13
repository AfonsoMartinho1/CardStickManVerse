async function refresh() {
    if (GameInfo.game.player.state == "Waiting") { 
        // Every time we are waiting
        await getGameInfo();
        await getDecksInfo();
        await getBoardInfo();
        if (GameInfo.game.player.state != "Waiting") {
            // The moment we pass from waiting to play
            GameInfo.prepareUI();
            await playCard();
            await combatHandler();
        }
    }
    // Nothing to do when we are playing since we control all that happens 
    // so no update is needed from the server
}

function preload() {
  GameInfo.images.playercard = loadImage('/assets/cardstickman.png');
  GameInfo.images.opponentcard = loadImage('/assets/cardstickman180degrees.png');
  GameInfo.images.board = loadImage('/assets/boardv4.png');
}


async function setup() {
    let canvas = createCanvas(GameInfo.width, GameInfo.height);
    canvas.parent('game');
    // preload  images
    
    await  getGameInfo();
    setInterval(refresh,500);

    //buttons (create a separated function if they are many)
    GameInfo.endturnButton = createButton('End Turn');
    GameInfo.endturnButton.parent('game');
    GameInfo.endturnButton.position(GameInfo.width-125,GameInfo.height-700);
    GameInfo.endturnButton.mousePressed(endturnAction);
    GameInfo.endturnButton.addClass('game')

    await getDecksInfo();
    await getBoardInfo();

    GameInfo.prepareUI();
    

    GameInfo.loading = false;
}

function draw() {
    background(GameInfo.images.board);
    if (GameInfo.loading) {
        textAlign(CENTER, CENTER);
        textSize(40);
        fill('black');
        text('Loading...', GameInfo.width/2, GameInfo.height/2);
    } else if (GameInfo.game.state == "Finished" && GameInfo.scoreWindow) {
        GameInfo.scoreWindow.draw();
    } else  {
        GameInfo.scoreBoard.draw();
        if (GameInfo.playerDeck) {
            GameInfo.playerDeck.draw();
          }
          if (GameInfo.oppDeck) {
            GameInfo.oppDeck.draw();
          }
          if (GameInfo.playerBoard) {
            GameInfo.playerBoard.draw();
          }
          if (GameInfo.oppBoard) {
            GameInfo.oppBoard.draw();
          }
          if (GameInfo.playerPlay) {
            GameInfo.playerPlay.draw();
          }
          if (GameInfo.oppPlay) {
            GameInfo.oppPlay.draw();
          }
        
    }
}

async function mouseClicked() {
    if ( GameInfo.playerDeck) {
        GameInfo.playerDeck.click();
    }
}

