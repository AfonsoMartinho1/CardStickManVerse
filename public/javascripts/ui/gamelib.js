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
      await giveRandomCard();
    }
  }
  // Nothing to do when we are playing since we control all that happens
  // so no update is needed from the server
}

function preload() {
  
  GameInfo.images.Stickman = loadImage('/assets/cardstickmanBob.png'),
  GameInfo.images.Bomber = loadImage('/assets/cardstickmanBomber.png'),
  GameInfo.images.Chef = loadImage('/assets/cardstickmanChef.png'),
  GameInfo.images.Angel = loadImage('/assets/cardstickmanAngel.png'),
  GameInfo.images.Cyborg = loadImage('/assets/cardstickmanCyborg.png'),
  GameInfo.images.DrFamiliar = loadImage('/assets/cardstickmanDoctor.png'),
  GameInfo.images.GameDev = loadImage('/assets/cardstickmanGameDev.png'),
  GameInfo.images.Hitman = loadImage('/assets/cardstickmanHitman.png'),
  GameInfo.images.Joker = loadImage('/assets/cardstickmanJoker.png'),
  GameInfo.images.BobNaldo = loadImage('/assets/cardstickmanNaldo.png'),
  GameInfo.images.Ninja = loadImage('/assets/cardstickmanNinja.png'),
  GameInfo.images.Pirate = loadImage('/assets/cardstickmanPirate.png'),
  GameInfo.images.Reaper = loadImage('/assets/cardstickmanReaper.png'),
  GameInfo.images.BobRocky = loadImage('/assets/cardstickmanRocky.png'),
  GameInfo.images.Samurai = loadImage('/assets/cardstickmanSamurai.png'),
  GameInfo.images.SuperBob = loadImage('/assets/cardstickmanSuperBob.png'),
  GameInfo.images.SusBob = loadImage('/assets/cardstickmanSus.png'),
  GameInfo.images.Warrior = loadImage('/assets/cardstickmanWarrior.png'),
  GameInfo.images.Soldier = loadImage('/assets/cardstickmanSoldier.png'),
  GameInfo.images.Bob = loadImage('/assets/cardstickmanReal.png')
  
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
      GameInfo.endturnButton.position(GameInfo.width - 5000, GameInfo.height - 5000);
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


