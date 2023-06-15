const pool = require("../config/database");
const MatchDecks = require("./deckModels");
const Settings = require("../models/gameSettings");

async function checkEndGame(game) {
    return game.player.hp <= 0 || game.opponents[0].hp <= 0
  }

class Play {
    // At this moment I do not need to store information so we have no constructor

    // Just a to have a way to determine end of game


    // we consider all verifications were made
    static async startGame(game) {
        try {
            // Randomly determines who starts    
            let myTurn = (Math.random() < 0.5);
            let p1Id = myTurn ? game.player.id : game.opponents[0].id;
            let p2Id = myTurn ? game.opponents[0].id : game.player.id;
            // Player that start changes to the state Playing and order 1 
            await pool.query(`Update user_game set ug_state_id=?,ug_order=? where ug_id = ?`, [2, 1, p1Id]);
            // Player that is second changes to order 2
            await pool.query(`Update user_game set ug_order=? where ug_id = ?`, [2, p2Id]);

            // Changing the game state to start
            await pool.query(`Update game set gm_state_id=? where gm_id = ?`, [2, game.id]);

            // ---- Specific rules for each game start bellow
            await MatchDecks.genPlayerDeck(p1Id)

        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }


    // This considers that only one player plays at each moment, 
    // so ending my turn starts the other players turn
    // We consider the following verifications were already made:
    // - The user is authenticated
    // - The user has a game running
    // NOTE: This might be the place to check for victory, but it depends on the game
    // Function to handle the end of a turn
    // Function to handle the end of a turn
    // Function to handle the end of a turn
// Function to handle the end of a turn
static async endTurn(game) {
    try {
        // Get the current turn number
        const currentTurn = game.turn;

        // Determine the next player based on the turn number
        const nextPlayer = currentTurn % 2 === 0 ? game.player : game.opponents[0];
        const currentPlayer = currentTurn % 2 === 0 ? game.opponents[0] : game.player;

        
        

        // Check if the current turn is divisible by 2
        if (currentTurn % 2 === 0) {
            await MatchDecks.combatHandler(game);
            await MatchDecks.giveRandomCard(game);
        }

        // Change player state to waiting (1)
        await pool.query(`UPDATE user_game SET ug_state_id = ? WHERE ug_id = ?`,
            [1, currentPlayer.id]);

        // Change opponent state to playing (2)
        await pool.query(`UPDATE user_game SET ug_state_id = ? WHERE ug_id = ?`,
            [2, nextPlayer.id]);

        // Increase the number of turns and continue
        await pool.query(`UPDATE game SET gm_turn = gm_turn + 1 WHERE gm_id = ?`,
            [game.id]);

        return { status: 200, result: { msg: "Your turn ended." } };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}




} 



module.exports = Play;