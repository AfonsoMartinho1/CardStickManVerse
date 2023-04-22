// All the variables for the game UI
// we only have one game info so everything is static
class GameInfo  {
    // settings variables
    static width = 1350;
    static height = 730;

    static loading = true;

    // data
    static game;
    static matchDecks;
    static matchBoard;
    static matchPlace;
    static images = {};
    static sounds = {};

    // rendererers
    static playerDeck;
    static oppDeck;
    static playerBoard;
    static oppBoard;
    static playerPlace;
    static oppPlace;
    static scoreBoard;
    static scoreWindow;

    // buttons
    static endturnButton;

    // Write your UI settings for each game state here
    // Call the method every time there is a game state change
    static prepareUI() {
        if (GameInfo.game.player.state == "Playing") { 
            GameInfo.endturnButton.show();
        } else if (GameInfo.game.player.state == "Waiting") {
            GameInfo.endturnButton.hide();
        }  else if (GameInfo.game.player.state == "Score") {
            GameInfo.endturnButton.hide();
            GameInfo.scoreWindow.open();
        }
    }
}