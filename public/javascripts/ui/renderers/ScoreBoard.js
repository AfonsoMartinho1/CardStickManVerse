

class ScoreBoard {
    static width = 165;
    static height = 65;
    static x = 1;
    static y = 1;
    constructor(game) {
        this.game = game;
    }
    draw() {
        fill(1,1,1);
        stroke(0,0,0);
        rect (ScoreBoard.x,ScoreBoard.y,ScoreBoard.width,ScoreBoard.height,5,5,5,5);
        fill(255,255,255);
        textAlign(LEFT,CENTER);
        textSize(16);
        textStyle(NORMAL);
        text("Player HP: "+this.game.player.hp,ScoreBoard.x+5,ScoreBoard.y+15)
        text("Turn: "+this.game.turn,ScoreBoard.x+5,ScoreBoard.y+45)
        if (this.game.state == "Finished"){ 
            fill(200,0,0);
            textSize(24);
            textStyle(BOLD);
            textAlign(CENTER,CENTER);
            text("GAMEOVER",ScoreBoard.x+200,ScoreBoard.y-5+ScoreBoard.height/4)    
        }
    }

    update(game) {
        this.game = game;
    }
}