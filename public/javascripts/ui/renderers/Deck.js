class Card {
  static width = 84;
  static height = 130;

  constructor(card, x, y, img, position) {
    this.card = card;
    this.x = x;
    this.y = y;
    this.img = img;
    this.cardx = img.width;
    this.cardy = img.height;
    this.position = position;
    this.played = false;

        // drag stuff
        // these will be set outside 
        this.draggable = false;
        this.dragAction = undefined;
        // these are only to be used inside
        this.dragging = false;
        this.offsety = 0;
        this.offsetx = 0;
        this.dragx = 0;
        this.dragy = 0;;
  }

  draw() {
    if (!this.card.active) {
      image(this.img, this.x, this.y, Card.width, Card.height);
    }

    textAlign(CENTER, CENTER);
    fill(255);
    textStyle(BOLD);
    textSize(18);
    stroke(0);
    strokeWeight(2);
    strokeWeight(1);
    noStroke();
    fill(0);
    textSize(16);
    text(this.card.name, this.x + Card.width * 0.5, this.y + Card.height * 0.60);
    textSize(12);
    textAlign(CENTER, TOP);
    text(
      this.card.attack,
      this.x + Card.width * 0.15,
      this.y + Card.height * 0.77,
      Card.width * 0.8,
      Card.height * 0.1
    );
    if (this.card.note) {
      text(
        this.card.note,
        this.x + Card.width * 0.1,
        this.y + Card.height * 0.8,
        Card.width * 0.8,
        Card.height * 0.15
      );
    }
    textStyle(NORMAL);
    noTint();

    if (this.dragging) {
      tint(255, 100);
      image(this.img, this.dragx, this.dragy, this.width, this.height,
        this.cardx * (this.number - 1), 0, this.cardx, this.cardy);
      tint(255, 255);
    }
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

  update() {
    // Adjust location if being dragged
    if (this.dragging) {
        this.dragx = mouseX + this.offsetX;
        this.dragy = mouseY + this.offsetY;
    }
}


press() {
    if (this.draggable &&
        mouseX > this.x && mouseX < this.x + this.width &&
        mouseY > this.y && mouseY < this.y + this.height) {
        this.dragging = true;
        // If so, keep track of relative location of click to corner of rectangle
        this.offsetX = this.x - mouseX;
        this.offsetY = this.y - mouseY;
    }
}
release() {
    this.dragging = false;
    if (this.draggable && this.dragAction) {
        this.dragAction(mouseX, mouseY, this.number);
    }
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
    this.hoveredCard = null;
  }

  createCards(cardsInfo) {
    let cards = [];
    let x = this.x;
    let position = 1;
    let hasPositionProperty = cardsInfo.every(cardInfo =>
      cardInfo.hasOwnProperty("position")
    );

    for (let cardInfo of cardsInfo) {
      if (hasPositionProperty) {
        let adjustedPosition = cardInfo.position - 1;
        let offsetX = adjustedPosition * (Card.width + 15);
        x = this.x + offsetX;
      }

      cards.push(
        new Card(cardInfo, x, this.y + Deck.titleHeight, this.cardImg, position)
      );

      if (!hasPositionProperty) {
        x += Card.width + 15;
      }

      position++;
    }

    return cards;
  }

  update(cardsInfo) {
    for (let card of this.cards) {
      if (card.card.name === "Angel" && !card.played && card.card.ugc_played_turn === 1) {
        card.play();
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
    let hoveringCard = null;

    for (let card of GameInfo.playerDeck.cards) {
      if (card.click() && !card.played) {
        hoveringCard = card;
        break;
      }
    }

    this.hoveredCard = hoveringCard;
  }

  updateCards() {
    for (let card of this.cards) {
      card.update();
    }
  }
}
