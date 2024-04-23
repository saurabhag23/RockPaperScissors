import { useState } from "react";
import styles from "./Game.module.css";

interface Round {
  userChoice: string;
  serverChoice: string;
  result: string;
}

interface Game {
  rounds: Round[];
  userScore: number;
  serverScore: number;
  noOfDraws: number;
  finalResult: string;
}

function Game() {
  const [, setChoice] = useState<string | null>(null);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [result, setResult] = useState<Round | null>(null);
  const [history, setHistory] = useState<Game[]>([]);
  const [gameEnded, setGameEnded] = useState<boolean>(false);

  const choices = [
    { name: "rock", icon: "✊" }, // Raised Fist
    { name: "paper", icon: "✋" }, // Raised Hand
    { name: "scissors", icon: "✌" }, // Victory Hand
  ];

  const fetchHistory = async () => {
    const response = await fetch("http://localhost:3000/history");
    const data = await response.json();
    console.log("response", data);
    setHistory(data);
  };

  const endGame = async () => {
    const response = await fetch("http://localhost:3000/endgame", {
      method: "POST",
    });
    const data: Game = await response.json();
    console.log("game", data);
    setCurrentGame(data);
    fetchHistory(); // Fetch the updated history
    setGameEnded(true);
  };

  const play = async (userChoice: string) => {
    const response = await fetch("http://localhost:3000/play", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userChoice }),
    });
    const data: Round = await response.json();
    setResult(data);
  };

  const playAgain = () => {
    setGameEnded(false);
    setChoice(null);
    setResult(null);
  };

  const getEmoji = (result) => {
    switch (result) {
      case "win":
        return "😃";
      case "lose":
        return "😢";
      default:
        return "😐";
    }
  };

  return (
    <div className={styles.Wrapper}>
      <div className={styles.App}>
        <h1>Rock, Paper, Scissors!</h1>
        <div className={styles.buttonContainer}>
          {choices.map((choice) => (
            <button
              className={styles.choiceButton}
              key={choice.name}
              onClick={() => play(choice.name)}
            >
              {choice.icon}
            </button>
          ))}
        </div>
        {result && (
          <>
            <div className={styles.result}>
              <div className="">
                <p className={styles.resultText}>
                  Result: {result.result} {getEmoji(result.result)}
                </p>
                <div className={styles.gameDisplay}>
                  <div className={styles.gameDisplayCol}>
                    <span>You</span>
                    <span className={styles.gameDisplayIcon}>
                      {choices.find((e) => e.name == result.userChoice).icon}
                    </span>
                  </div>
                  <div className={styles.gameDisplayCol}>
                    <span>Server</span>
                    <span className={styles.gameDisplayIcon}>
                      {choices.find((e) => e.name == result.serverChoice).icon}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.buttons}>
              <button className={styles.playAgainButton} onClick={playAgain}>
                New Game
              </button>
              <button
                className={styles.endGameButton}
                onClick={() => endGame()}
              >
                End Game
              </button>
            </div>
          </>
        )}

        {gameEnded && (
          <div className={styles.gameResults}>
            {currentGame && (
              <div className={styles.currentGame}>
                <h1>{currentGame.finalResult}</h1>
                <div className={styles.currentGameScores}>
                  <h3>Your Score: {currentGame.userScore}</h3>
                  <h3>Server Score: {currentGame.serverScore}</h3>
                  <h3>Draws: {currentGame.noOfDraws}</h3>
                </div>
              </div>
            )}

            {history.length > 0 && (
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>Game</th>
                    <th>Final Result</th>
                    <th>Your Score</th>
                    <th>Server Score</th>
                    <th>Draws</th>
                  </tr>
                </thead>
                <tbody>
                  {history
                    .slice(-5)
                    .reverse()
                    .map((game, index) => (
                      <tr key={index}>
                        <td>Game {index + 1}</td>
                        <td>{game.finalResult}</td>
                        <td>{game.userScore}</td>
                        <td>{game.serverScore}</td>
                        <td>{game.noOfDraws}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;
