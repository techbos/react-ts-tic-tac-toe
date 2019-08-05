import * as React from "react";
import { render } from "react-dom";
import GameController from "./components/GameController";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <GameController />
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
