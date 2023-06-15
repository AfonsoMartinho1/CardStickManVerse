class Card {
  static width = 84;
  static height = 130;

  constructor(card, x, y, img, position) {
    this.card = card;
    this.x = x;
    this.y = y;
    this.img = img;
    this.position = position;
    this.played = false;
  }

  draw() {
    if (!this.card.active);
    image(this.img, this.x, this.y, Card.width, Card.height);

    textAlign(CENTER, CENTER);
    fill(255);
    textStyle(BOLD);
    textSize(18);
    stroke(0);
    strokeWeight(2);
    //text(this.card.cost, this.x + Card.width * 0.905 - 6, this.y + Card.height * 0.065);
    strokeWeight(1);
    noStroke();
    fill(0);
    textSize(16);
    text(this.card.name, this.x + Card.width * 0.5, this.y + Card.height * 0.60);
    textSize(12);
    textAlign(CENTER, TOP);
    text(this.card.attack,this.x + Card.width * 0.15,this.y + Card.height * 0.77,Card.width * 0.8,Card.height * 0.1);
    if (this.card.note) {
      text(this.card.note,this.x + Card.width * 0.1,this.y + Card.height * 0.8,Card.width * 0.8,Card.height * 0.15);
    }
    textStyle(NORMAL);
    noTint();
  }

  click() {
    return (
      mouseX > this.x &&
      mouseX < this.x + Card.width &&
      mouseY > this.y &&
      mouseY < this.y + Card.height
    );
  }

  play() {
    this.played = true;
  }
}

class Deck {
  static titleHeight = 50;
  static nCards = 3;

  constructor(title, cardsInfo, x, y, clickAction, cardImg) {
    this.title = title;
    this.x = x;
    this.y = y;
    this.width = Card.width * Deck.nCards;
    this.clickAction = clickAction;
    this.cardImg = cardImg;
    this.cards = this.createCards(cardsInfo);
    this.hoveredCard = null; // New property to store the hovered card
  }

  createCards(cardsInfo) {
    let cards = [];
    let x = this.x;
    let position = 1;
    let hasPositionProperty = cardsInfo.every(cardInfo => cardInfo.hasOwnProperty('position'));
  
    for (let cardInfo of cardsInfo) {
      if (hasPositionProperty) {
        let adjustedPosition = cardInfo.position - 1;
        let offsetX = adjustedPosition * (Card.width + 15);
        x = this.x + offsetX;
      }
  
      cards.push(new Card(cardInfo, x, this.y + Deck.titleHeight, this.cardImg, position));
  
      if (!hasPositionProperty) {
        x += Card.width + 15;
      }
  
      position++;
    }
  
    return cards;
  }

  update(cardsInfo) {
    for (let card of this.cards) {
      // Check if the card is the Angel and has not been played before
      if (card.card.name === 'Angel' && !card.played && card.card.ugc_played_turn === 1) {
        card.play(); // Play the card
      }
    }
    this.cards = this.createCards(cardsInfo);
  }

  draw() {
    fill(0);
    noStroke();
    textSize(28);
    textAlign(CENTER, CENTER);
    text(this.title, this.x, this.y, this.width, Deck.titleHeight);
    for (let card of this.cards) {
      card.draw();
    }

    if (this.hoveredCard) {
      // Draw a highlight around the hovered card
      stroke(181, 80, 0);
      strokeWeight(2);
      noFill();
      rect(this.hoveredCard.x, this.hoveredCard.y, Card.width, Card.height);
    }
  }

  click() {
    if (this.clickAction) {
      for (let card of this.cards) {
        if (card.click()) {
          this.clickAction(card.card);
        }
      }
    }
  }

  mouseMoved() {
    // Check if the mouse is hovering over a card in the deck
    let hoveringCard = null;
  
    for (let card of GameInfo.playerDeck.cards) {
      if (card.click() && !card.played) {
        hoveringCard = card;
        break;
      }
    }
  
    // Set the hoveredCard property of the deck to the hoveringCard
    GameInfo.playerDeck.hoveredCard = hoveringCard;
  }
  
}





