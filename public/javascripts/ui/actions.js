
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
                GameInfo.width/2-200,
                GameInfo.height/2+150,
                playCard,
                GameInfo.images.card
            );
        }
        if (GameInfo.oppDeck) GameInfo.oppDeck.update(GameInfo.matchDecks.oppcards); 
        else GameInfo.oppDeck = new Deck(" ",
            GameInfo.matchDecks.oppcards,GameInfo.width/2-200,GameInfo.height/2-400,null,GameInfo.images.card);
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
            GameInfo.matchBoard.mycards,GameInfo.width/2-200,GameInfo.height/2-40,playCard,GameInfo.images.card);
        if (GameInfo.oppBoard) GameInfo.oppBoard.update(GameInfo.matchBoard.oppcards); 
        else GameInfo.oppBoard = new Deck(" ",
            GameInfo.matchBoard.oppcards,GameInfo.width/2-200,GameInfo.height/2-200,null,GameInfo.images.card);
    }
}

async function placeDeckCard(placeId) {
    if (!placeId) {
        alert("Invalid placeId");
        return;
    }
    try {
        const response = await fetch(`/api/decks/place/${placeId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "GET"
        });
        let result = await response.json();
        if (!result.successful) {
            alert(result.msg);
            window.location.pathname = "index.html";
        } else {
            GameInfo.matchPlace = result.randomdeck;
        if (GameInfo.playerRandomDeck) GameInfo.playerRandomDeck.update(GameInfo.matchRandomDeck.mycards); 
        else GameInfo.playerRandomDeck = new Deck(" ",
            GameInfo.matchRandomDeck.mycards,GameInfo.width/2+530,GameInfo.height/2,playCard,GameInfo.images.card);
        if (GameInfo.oppRandomDeck) GameInfo.oppRandomDeck.update(GameInfo.matchRandomDeck.oppcards); 
        else GameInfo.oppRandomDeck = new Deck(" ",
            GameInfo.matchRandomDeck.oppcards,GameInfo.width/2-640,GameInfo.height/2-230,null,GameInfo.images.card);
        }
    } catch (err) {
        console.log(err);
        alert("Something went wrong while getting the place information. Please try again later.");
    }
}

async function playCard(card) {
    if (confirm(`Do you want to play the "${card.name}" card?`)) {
        let result = await requestPlayCard(card.deckId);
        if (result.successful) {
            await getGameInfo();
            await getDecksInfo();
        }
        alert(result.msg);
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