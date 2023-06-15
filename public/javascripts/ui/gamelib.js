const { endTurn } = require("../../../models/playsModel");

async function refresh() {
  if (GameInfo.game.player.state == 'Waiting') {
    // Every time we are waiting
    await getGameInfo();
    await getDecksInfo();
    await getBoardInfo();
    if (GameInfo.game.player.state != 'Waiting') {
      // The moment we pass from waiting to play
      GameInfo.prepareUI();
      await playCard();
      await combatHandler();
      await endTurn();
      await giveRandomCard(game);
    }
  }
  // Nothing to do when we are playing since we control all that happens
  // so no update is needed from the server
}

function preload() {
  GameInfo.images.opponentcard = loadImage('/assets/cardstickman180degrees.png');
  GameInfo.images.board = loadImage('/assets/boardv4.png');
  GameInfo.images.losingImage = loadImage('/assets/lose background.png');
  GameInfo.images.winningImage = loadImage('/assets/win background.png');
}

async function setup() {
  let canvas = createCanvas(GameInfo.width, GameInfo.height);
  canvas.parent('game');
  // Preload images

  await getGameInfo();
  setInterval(refresh, 500);

    GameInfo.endturnButton = createButton('End Turn');
    GameInfo.endturnButton.parent('game');
    if (GameInfo.game.player.hp > 0 && GameInfo.game.opponents[0].hp > 0) {
      GameInfo.endturnButton.position(GameInfo.width - 125, GameInfo.height - 700);
    } else if (GameInfo.game.player.hp <= 0 || GameInfo.game.opponents[0].hp <= 0) {
      GameInfo.endturnButton.position(GameInfo.width - 2000, GameInfo.height - 2000);
    }
    GameInfo.endturnButton.mousePressed(endturnAction);
    GameInfo.endturnButton.addClass('game');

  await getDecksInfo();
  await getBoardInfo();

  GameInfo.prepareUI();

  GameInfo.loading = false;
}

function draw() {
  if (GameInfo.loading) {
    textAlign(CENTER, CENTER);
    textSize(40);
    fill('black');
    text('Loading...', GameInfo.width / 2, GameInfo.height / 2);
  } else if (GameInfo.game.player.hp <= 0 || GameInfo.game.opponents[0].hp <= 0) {
    if (GameInfo.game.player.hp <= 0) {
      background(GameInfo.images.losingImage);
    } else {
      background(GameInfo.images.winningImage);
    }
    // Wait for a short delay before redirecting
    setTimeout(() => {
      window.location.href = "http://localhost:8080/matches.html"; // Replace with your desired URL
    }, 100);
  } else {
    background(GameInfo.images.board);
    GameInfo.scoreBoard.draw();

    if (GameInfo.playerDeck) {
      GameInfo.playerDeck.draw();
      GameInfo.playerDeck.mouseMoved();
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
  if (GameInfo.playerDeck) {
    GameInfo.playerDeck.click();
  }
}


