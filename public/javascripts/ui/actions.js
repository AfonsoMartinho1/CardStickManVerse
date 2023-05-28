
async function getGameInfo() {
    let result = await requestPlayerGame();
    if (!result.successful) {
        alert("Something is wrong with the game please login again!");
        window.location.pathname = "index.html";
    } else {
        GameInfo.game = result.game;
        if (GameInfo.scoreBoard) GameInfo.scoreBoard.update(GameInfo.game); 
        else GameInfo.scoreBoard = new ScoreBoard(GameInfo.game);
        // if game ended we get the scores and prepare the ScoreWindow
        if (GameInfo.game.state == "Finished") {
            let result = await requestScore();
            GameInfo.scoreWindow = new ScoreWindow(50,50,GameInfo.width-100,GameInfo.height-100,result.score,closeScore);
        }
    }
}

async function getDecksInfo() {
    let result = await requestDecks();
    if (!result.successful) {
        alert("Something is wrong with the game please login again!");
        window.location.pathname = "index.html";
    } else {
        GameInfo.matchDecks = result.decks;
        if (GameInfo.playerDeck) {
            GameInfo.playerDeck.update(GameInfo.matchDecks.mycards);  
        }  
        else {
            GameInfo.playerDeck = new Deck(
                " ",
                GameInfo.matchDecks.mycards,
                GameInfo.width/2-339,
                GameInfo.height/2+175,
                playCard,
                GameInfo.images.card
            );
        }
        if (GameInfo.oppDeck) GameInfo.oppDeck.update(GameInfo.matchDecks.oppcards); 
        else GameInfo.oppDeck = new Deck(" ",
            GameInfo.matchDecks.oppcards,GameInfo.width/2-339,GameInfo.height/2-404,null,GameInfo.images.card);
    }
}

async function getBoardInfo() {
    let result = await requestBoard();
    if (!result.successful) {
        alert("Something is wrong with the game please login again!");
        window.location.pathname = "index.html";
    } else {
        GameInfo.matchBoard = result.board;
        console.log(GameInfo.matchBoard.mycards);
        if (GameInfo.playerBoard) GameInfo.playerBoard.update(GameInfo.matchBoard.mycards); 
        else GameInfo.playerBoard = new Deck(" ",
            GameInfo.matchBoard.mycards,GameInfo.width/2-141,GameInfo.height/2-7,playCard,GameInfo.images.card);
        if (GameInfo.oppBoard) GameInfo.oppBoard.update(GameInfo.matchBoard.oppcards); 
        else GameInfo.oppBoard = new Deck(" ",
            GameInfo.matchBoard.oppcards,GameInfo.width/2-143,GameInfo.height/2-207,null,GameInfo.images.card);
    }
}

async function playCard(card) {
    console.log(Object.keys(card));
    let position = parseInt(prompt("What position would you like to place the card? 1, 2, or 3?"));
    
    if (GameInfo.game.player.state === "Playing") {
      let result = await requestPlayCard(card.deckId, position);
      console.log(result);
      if (result.successful) {
        await getGameInfo();
        await getDecksInfo();
        await getBoardInfo();
      } else {
        alert(result.err);
      }
    } else {
      alert("It's not your turn to play a card.");
    }
  }
  


async function promptCardPosition() {
     let successful;
    if (position && !isNaN(position) && position >= 1 && position <= 3) {
      return { position, successful:true }  
    } else {
      text = "Invalid Postion!";
      alert(text); // display the message before returning the object
      return { position, successful:false };
    }
}

async function endturnAction() {
    let result = await requestEndTurn();
    if (result.successful) {
        await  getGameInfo();
        GameInfo.prepareUI();
    } else alert("Something went wrong when ending the turn.")
}

async function closeScore() {
    let result = await requestCloseScore();
    if (result.successful) {
        await checkGame(true); // This should send the player back to matches
    } else alert("Something went wrong when ending the turn.")
}