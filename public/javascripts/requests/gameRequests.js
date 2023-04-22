// Actions
async function requestEndTurn() {
    try {
        const response = await fetch(`/api/plays/endturn`, 
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
          method: "PATCH"
      });
      return {successful: response.status == 200};
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return {err: err};
    }
}

async function requestDecks() {
    try {
        const response = await fetch(`/api/decks/auth`);
        let result = await response.json();
        return { successful: response.status == 200,
                 unauthenticated: response.status == 401,
                 decks: result};
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return {err: err};
    }
}

async function requestBoard() {
    try {
        const response = await fetch(`/api/decks/auth/board`);
        let result = await response.json();
        return { successful: response.status == 200,
                 unauthenticated: response.status == 401,
                 board: result};
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return {err: err};
    }
}

async function requestPlayCard(deckId, cardId) {
    try {
        const response = await fetch(`/api/decks/play`, 
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
          method: "PATCH",
          body: JSON.stringify({
            deckId: deckId,
            cardId: cardId
          })
        });
        let result = await response.json();
        if (result.successful) {
            // Prompt the user to choose the position on the board to place the card
            let position = prompt("What position would you like to place the card? 1, 2 or 3?");
                switch(position) {
                case "1":
                text = "Card placed at position 1";
                break;
                case "2":
                text = "Card placed at position 2";
                break;
                case "3":
                text = "Card placed at position 3";
                break;
                default:
                text = "Please introduce a valid position. 1, 2 or 3!";
                }
            if (position) {
                // Send a request to the server to place the card at the chosen position
                const placeResponse = await fetch(`/api/decks/place`, 
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                  method: "PATCH",
                  body: JSON.stringify({
                    deckId: deckId,
                    cardId: cardId,
                    position: parseInt(position)
                  })
                });
                let placeResult = await placeResponse.json();
                if (placeResult.successful) {
                    return {successful: true, msg: placeResult.msg};
                } else {
                    return {successful: false, err: placeResult.err};
                }
            } else {
                // If the user cancels the prompt, return a failure result
                return {successful: false, err: "User canceled prompt"};
            }
        } else {
            return {successful: false, err: result.err};
        }
    } catch (err) {
        console.log(err);
        return {successful: false, err: err};
    }
}


async function requestCloseScore() {
    try {
        const response = await fetch(`/api/scores/auth/close`, 
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
          method: "PATCH"
      });
      return {successful: response.status == 200};
    } catch (err) {
        // Treat 500 errors here
        console.log(err);
        return {err: err};
    }
}

