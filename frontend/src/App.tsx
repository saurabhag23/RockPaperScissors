// HomePage.tsx
import styles from "./App.module.css";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/game");
  };

  return (
    <div className={styles.homePage}>
      <h1 className={styles.title}>ROCK PAPER SCISSORS</h1>
      <button className={styles.startButton} onClick={handleStart}>
        Start Game
      </button>
    </div>
  );
};

export default App;
