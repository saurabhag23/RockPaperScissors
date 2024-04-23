const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors()); // Add this line
app.use(express.json());

const uri =
  "mongodb+srv://agrawalsaurabh916:newProject@ropasci.fweya7d.mongodb.net/?retryWrites=true&w=majority&appName=RoPaSci";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const roundSchema = new mongoose.Schema({
  userChoice: String,
  serverChoice: String,
  result: String,
});

const gameSchema = new mongoose.Schema({
  rounds: [roundSchema],
  userScore: Number,
  serverScore: Number,
  noOfDraws: Number,
  finalResult: String,
});

const Game = mongoose.model("Game", gameSchema);

let currentGame = new Game({
  rounds: [],
  userScore: 0,
  serverScore: 0,
  noOfDraws: 0,
  finalResult: "",
});

app.post("/play", async (req, res) => {
  const choices = ["rock", "paper", "scissors"];
  const serverChoice = choices[Math.floor(Math.random() * choices.length)];

  let userChoice = req.body.userChoice;

  let result;
  if (userChoice === serverChoice) {
    result = "draw";
  } else if (
    (userChoice === "rock" && serverChoice === "scissors") ||
    (userChoice === "paper" && serverChoice === "rock") ||
    (userChoice === "scissors" && serverChoice === "paper")
  ) {
    result = "win";
  } else {
    result = "lose";
  }

  const round = {
    userChoice,
    serverChoice,
    result,
  };
  currentGame.rounds.push(round);

  // Update scores based on the result of the round
  if (result === "win") {
    currentGame.userScore += 1;
  } else if (result === "lose") {
    currentGame.serverScore += 1;
  } else {
    currentGame.noOfDraws += 1;
  }

  // Calculate final result based on the scores
  currentGame.finalResult =
    currentGame.userScore > currentGame.serverScore ? "You Win" : "You Lose";

  await currentGame.save();

  res.json({ userChoice, serverChoice, result });
});

app.get("/history", async (req, res) => {
  const history = await Game.find();
  res.json(history);
});

app.post("/newgame", async (req, res) => {
  currentGame = new Game({
    rounds: [],
    userScore: 0,
    serverScore: 0,
    noOfDraws: 0,
    finalResult: "",
  });
  res.json({ message: "New game started" });
});

app.post("/endgame", async (req, res) => {
  // Calculate final result based on the scores

  await currentGame.save();
  const returnGame = currentGame;

  // Start a new game
  currentGame = new Game({
    rounds: [],
    userScore: 0,
    serverScore: 0,
    noOfDraws: 0,
    finalResult: "",
  });

  res.json(returnGame);
});

app.listen(3000, () => console.log("Server running on port 3000"));
