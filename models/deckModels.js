const pool = require("../config/database");
const Settings = require("../models/gameSettings")

function fromDBCardToCard(dbCard) {
    return new Card(dbCard.crd_id,dbCard.ugc_id,
        dbCard.crd_name, dbCard.crd_abl, dbCard.crd_atk,dbCard.crd_def,dbCard.crd_desc);
}

class Card {
    constructor(cardId,deckId,name,hability,attack, defence, description) {
        this.cardId = cardId;
        this.deckId = deckId;
        this.name = name;
        this.effect = hability;
        this.note = attack;
        this.type = defence;
        this.description = description
    }

    static async genCard(playerId) {
        try {
            let [cards] = await pool.query(`select * from card `);
            let rndCard = fromDBCardToCard(cards[Math.floor(Math.random() * cards.length)]);
            // insert the card
            let [result] = await pool.query(`Insert into user_game_card (ugc_user_game_id,ugc_crd_id,ugc_pos_id)
                  values (?,?,?)`, [playerId,rndCard.cardId,true]);
            return {status:200, result: rndCard};
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    
}

class MatchDecks {
    constructor(mycards,oppcards) {
        this.mycards = mycards;
        this.oppcards = oppcards;
    }

    // No verifications are made since this is consider to be an auxiliary method
    // We consider it will only be called at the right time
    static async genPlayerDeck(playerId) {
        try {
            let cards =[];
            for (let i=0; i < Settings.initCards; i++) {
                let result = await Card.genCard(playerId);
                cards.push(result.result);
            }
            return {status:200, result: cards};
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    // No verifications are made since this is consider to be an auxiliary method
    // We consider it will only be called at the right time
    static async resetPlayerDeck(playerId) {
        try {
            let [result] = await pool.query(`delete from user_game_card where ugc_user_game_id = ?`, [playerId]);
            return {status:200, result: {msg:"All cards removed"}};
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    static async getMatchDeck(game) {
        try {
            let [dbcards] = await pool.query(`Select * from card
            inner join user_game_card on ugc_crd_id = crd_id
            where (ugc_pos_id = 2) and (ugc_user_game_id = ? or ugc_user_game_id = ?)`, 
                [game.player.id, game.opponents[0].id]);
            let playerCards = [];
            let oppCards = [];
            for(let dbcard of dbcards) {
                let card = fromDBCardToCard(dbcard);
                if (dbcard.ugc_user_game_id == game.player.id) {
                    playerCards.push(card);
                } else {
                    let c = new Card();
                    oppCards.push(c);
                }
            }
            return {status:200, result: new MatchDecks(playerCards,oppCards)};
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
        
    }

    static async getBoardDeck(game) {
        try {
            let [dbcards] = await pool.query(`Select * from card
            inner join user_game_card on ugc_crd_id = crd_id
            where (ugc_pos_id = 3 or ugc_pos_id = 4 or ugc_pos_id = 5) and (ugc_user_game_id = ? or ugc_user_game_id = ?)`, 
                [game.player.id, game.opponents[0].id]);
            let playerCards = [];
            let oppCards = [];
            for(let dbcard of dbcards) {
                let card = fromDBCardToCard(dbcard);
                if (dbcard.ugc_user_game_id == game.player.id) {
                    playerCards.push(card);
                } else {
                    oppCards.push(card);
                }
            }
            return {status:200, result: new MatchDecks(playerCards, oppCards)};
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    static async getPlaceDeck(game) {
        try {
          const [dbcards] = await pool.query(`Select * from card
          inner join user_game_card on ugc_crd_id = crd_id
          where (ugc_pos_id = 3 or ugc_pos_id = 4 or ugc_pos_id = 5) and (ugc_user_game_id = ? or ugc_user_game_id = ?)`
          , [game.player.id, game.opponents[0].id]);
      
          if (!dbcards.length) {
            return { status: 404, result: 'Cards not found' };
          }
      
          const playerCards = [];
          const oppCards = [];
      
          for (let dbcard of dbcards) {
            let card = fromDBCardToCard(dbcard);
            if (dbcard.ugc_user_game_id == game.player.id) {
              playerCards.push(card);
            } else {
              oppCards.push(card);
            }
          }
      
          return { status: 200, result: new MatchDecks(playerCards, oppCards) };
        } catch (err) {
          console.log(err);
          return { status: 500, result: err };
        }
      }

}




module.exports = MatchDecks;