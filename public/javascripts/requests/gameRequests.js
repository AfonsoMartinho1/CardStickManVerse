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
      let position = await promptCardPosition();
      let text;
      if (position && !isNaN(position) && position >= 1 && position <= 3) {
        switch (position) {
          case 1:
            text = "Card placed at position 1";
            break;
          case 2:
            text = "Card placed at position 2";
            break;
          case 3:
            text = "Card placed at position 3";
            break;
          default:
            text = "Please introduce a valid position. 1, 2 or 3!";
        }
      } else {
        text = "Please introduce a valid position. 1, 2 or 3!";
      }
      if (position) {
        const placeId = parseInt(position);
        const response = await fetch(`/api/decks/place`, 
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "PATCH",
            body: JSON.stringify({
              deckId: deckId,
              cardId: cardId,
              position: placeId
            })
          });
        let result = await response.json();
        if (result.successful) {
          return {successful: true, msg: text};
        } else {
          return {successful: false, err: result.err};
        }
      } else {
        return {successful: false, err: "User canceled prompt"};
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

