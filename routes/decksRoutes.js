const express = require('express');
const router = express.Router();
const MatchDecks = require("../models/deckModels");
const auth = require("../middleware/auth");


router.get('/auth', auth.verifyAuth, async function (req, res, next) {
    try {
        console.log("Get decks of the game for authenticated user");
        if (!req.game || req.game.opponents.length == 0) {
            res.status(400).send({msg:"Your are not in a game or are still waiting for another player."});
        } 
        let result = await MatchDecks.getMatchDeck(req.game);
        res.status(result.status).send(result.result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/auth/board', auth.verifyAuth, async function (req, res, next) {
    try {
        console.log("Get decks of the game for authenticated user");
        if (!req.game || req.game.opponents.length == 0) {
            res.status(400).send({msg:"Your are not in a game or are still waiting for another player."});
        } 
        let result = await MatchDecks.getBoardDeck(req.game);
        res.status(result.status).send(result.result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/auth/deck', auth.verifyAuth, async function (req, res, next) {
    try {
        console.log("Get decks of the game for authenticated user");
        if (!req.game || req.game.opponents.length == 0) {
            res.status(400).send({msg:"Your are not in a game or are still waiting for another player."});
        } 
        let result = await MatchDecks.getRandomDeck(req.game);
        res.status(result.status).send(result.result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.patch('/play', auth.verifyAuth, async function (req, res, next) {
    try {
        console.log("Play card with id: ",req.body.deckId);
        if (!req.game || req.game.opponents.length == 0) {
            res.status(400).send({msg:"Your are not in a game or are still waiting for another player."});
        } 
        let result = await MatchDecks.getPlaceDeck(req.game,req.body.deckId);
        res.status(result.status).send(result.result);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.patch('/updatecard', auth.verifyAuth, async function (req, res, next) {
    try {
      const { deckId, position } = req.body;
      console.log("Play card with id:", deckId);
  
      if (!req.game || req.game.opponents.length == 0) {
        return res.status(400).send({ msg: "You are not in a game or are still waiting for another player." });
      }
  
      const playResponse = await MatchDecks.playCard(req.game, deckId, position);
      const { matchDecks, movedCard } = playResponse.result;
      return res.status(playResponse.status).send({ matchDecks, movedCard });
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  });

module.exports = router;