const pool = require("../config/database");
const Settings = require("../models/gameSettings")

function fromDBCardToCard(dbCard) {
    return new Card(dbCard.crd_id, dbCard.ugc_id,
        dbCard.crd_name, dbCard.crd_abl, dbCard.crd_atk, dbCard.crd_def, dbCard.crd_desc);
}

class Card {
    constructor(cardId, deckId, name, hability, attack, defence, description) {
        this.cardId = cardId;
        this.deckId = deckId;
        this.name = name;
        this.effect = hability;
        this.attack = attack;
        this.type = defence;
        this.description = description
    }

    static async genCard(playerId) {
        try {
            let [cards] = await pool.query(`select * from card `);
            let rndCard = fromDBCardToCard(cards[Math.floor(Math.random() * cards.length)]);
            // insert the card
            let [result] = await pool.query(`Insert into user_game_card (ugc_user_game_id,ugc_crd_id,ugc_pos_id)
                  values (?,?,?)`, [playerId, rndCard.cardId, true]);
            return { status: 200, result: rndCard };
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }


}

class MatchDecks {
    constructor(mycards, oppcards) {
        this.mycards = mycards;
        this.oppcards = oppcards;
    }

    // No verifications are made since this is consider to be an auxiliary method
    // We consider it will only be called at the right time
    static async genPlayerDeck(playerId) {
        try {
            let cards = [];
            for (let i = 0; i < Settings.initCards; i++) {
                let result = await Card.genCard(playerId);
                cards.push(result.result);
            }
            return { status: 200, result: cards };
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
            return { status: 200, result: { msg: "All cards removed" } };
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
            for (let dbcard of dbcards) {
                let card = fromDBCardToCard(dbcard);
                if (dbcard.ugc_user_game_id == game.player.id) {
                    playerCards.push(card);
                } else {
                    let c = new Card();
                    oppCards.push(c);
                }
            }
            return { status: 200, result: new MatchDecks(playerCards, oppCards) };
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

    static async playCard(game, deckId, position) {
        try {
            // Check board and hand position and players ids
            let [dbcards] = await pool.query(`
                SELECT *
                FROM card 
                INNER JOIN user_game_card ON ugc_crd_id = crd_id
                WHERE (ugc_pos_id = 2 OR ugc_pos_id = 3 OR ugc_pos_id = 4 OR ugc_pos_id = 5) AND (ugc_user_game_id = ? OR ugc_user_game_id = ?)
            `, [game.player.id, game.opponents[0].id]);

            // Get card information
            let [card] = await pool.query(`
                SELECT *
                FROM card
                INNER JOIN user_game_card ON ugc_crd_id = crd_id
                WHERE ugc_id = ?`,
                [deckId]);

            // await pool.query(`DELETE FROM user_game_card WHERE ugc_crd_id = ?`, [cardId]);
            await pool.query(`UPDATE user_game_card SET ugc_pos_id = ? WHERE ugc_id = ?`, [position + 2, deckId]);

            let playerCards = [];
            let oppCards = [];

            for (let i = 0; i < dbcards.length; i++) {
                let dbcard = dbcards[i];

                if (dbcard.ugc_user_game_id === game.player.id && dbcard.ugc_pos_id === 2) {
                    playerCards.push(dbcard);
                } else if (dbcard.ugc_user_game_id === game.opponents[0].id && (dbcard.ugc_pos_id === 3 || dbcard.ugc_pos_id === 4 || dbcard.ugc_pos_id === 5)) {
                    oppCards.push(dbcard);
                }
            }

            let matchDecks = new MatchDecks(playerCards, oppCards);

            return {
                status: 200,
                result: {
                    matchDecks: matchDecks,
                    movedCard: card
                }
            };
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    static async combatHandler(game) {
        try {
            let sql = `Select * from card_position
            left join user_game_card on ugc_pos_id = pos_id
            left join card on ugc_crd_id = crd_id
            where (pos_id = 3 or pos_id = 4 or pos_id = 5) and (ugc_user_game_id = ? or ugc_user_game_id IS NULL)  order by pos_id `;


            let [dbplayercards] = await pool.query(sql,
                [game.player.id]);
            let [dboppcards] = await pool.query(sql,
                [game.opponents[0].id]);

            for (let pos = 0; pos < 3; pos ++) {

                let pCard = dbplayercards[pos];
                let oCard = dboppcards[pos];
                
                if (pCard.ugc_id && oCard.ugc_id) {
                    if (pCard.attack > oCard.attack) {
                        damage = pCard.attack - oCard.attack;
                        player.hp = player.hp - damage
                    } else if (pCard.attack < oCard.attack) {
                        damage = oCard.attack - pCard.attack;
                        player.hp = player.hp - damage
                    } else {
                        (pCard.attack = oCard.attack)
                        return { status: 400, result: { msg: "Damage is the same, no damage dealt to the player" } };
                    }
                } else if (pCard.ugc_id == null) {
                    player.hp = player.hp - oCard.attack
                    return {status:400, result: {msg: "No cards at the player board, damage dealth to player"}};
                } else if (oCard.ugc_id == null) {
                    player.hp = player.hp - pCard.attack
                    return {status:400, result: {msg: "No cards at the opponent board, damage dealth to opponent"}};
                } else {
                    (pCard.ugc_id == null && oCard.ugc_id == null)
                }
            }

            //await pool.query(`DELETE FROM user_game_card WHERE ugc_crd_id = ?`, [cardId]);
            await pool.query(`UPDATE user_game_card SET ugc_pos_id = ? WHERE ugc_id = ?`, [position]);

            return { status: 200, result: new MatchDecks(playerCards, oppCards) };
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }
}


module.exports = MatchDecks;