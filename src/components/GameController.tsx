import * as React from "react";

import "../styles.css";

type PlayerId = 0 | 1;

type Cell = PlayerId | null;
type Board = Array<Array<Cell>>;

type Result =
  | {
      type: "DRAW";
    }
  | {
      type: "WINNER";
      winner: PlayerId;
    };

type State =
  | {
      type: "NOT_STARTED";
    }
  | {
      type: "STARTED";
      currentPlayerId: PlayerId;
      board: Board;
    }
  | { type: "COMPLETED"; result: Result; board: Board };

class GameController extends React.PureComponent<{}, State> {
  state: State = { type: "NOT_STARTED" };

  render(): React.ReactNode {
    let board = null,
      current_player_id = null,
      result = null,
      start_game_button_title = null;
    switch (this.state.type) {
      case "NOT_STARTED":
        board = this._renderBoard(null);
        start_game_button_title = "Start Game";
        break;
      case "COMPLETED":
        start_game_button_title = "Restart Game";
        board = this._renderBoard(this.state.board);
        result =
          this.state.result.type === "DRAW"
            ? "Game is a draw."
            : "Winner is Player " +
              this._getPlayerNameById(this.state.result.winner);
        break;
      case "STARTED":
        start_game_button_title = "Restart Game";
        board = this._renderBoard(this.state.board);
        current_player_id = this._getPlayerNameById(this.state.currentPlayerId);
        break;
    }
    return (
      <div>
        <h1>Tic Tac Toe</h1>
        <div>
          <button className="Button" onClick={this._onResetGame}>
            {start_game_button_title}
          </button>
        </div>
        {board}
        {result && <h2>Game Result: {result}</h2>}
        {current_player_id && <h2>Current Player: {current_player_id}</h2>}
      </div>
    );
  }

  _onResetGame = (): void => {
    this.setState({
      type: "STARTED",
      currentPlayerId: Math.random() >= 0.5 ? 0 : 1,
      board: this._getEmptyBoard()
    });
  };

  _getEmptyBoard(): Board {
    return [[null, null, null], [null, null, null], [null, null, null]];
  }

  _renderBoard(board: Board | null): React.ReactNode {
    const boardData = board == null ? this._getEmptyBoard() : board;
    return boardData.map((row, rowIndex) => (
      <div className="Row">
        {row.map((col, colIndex) => (
          <div
            className="Cell"
            onClick={this._onClickCell.bind(
              this,
              rowIndex,
              colIndex,
              boardData
            )}
          >
            {col == null ? "" : this._getPlayerNameById(col)}
          </div>
        ))}
      </div>
    ));
  }

  _onClickCell = (row: number, col: number, board: Board): void => {
    if (this.state.type !== "STARTED" || board[row][col] != null) {
      return;
    }
    // for simplicity, we update input directly here
    board[row][col] = this.state.currentPlayerId;
    const result = this._tryCompleteGame();
    if (result == null) {
      this.setState({
        type: "STARTED",
        currentPlayerId: this.state.currentPlayerId === 0 ? 1 : 0,
        board
      });
    } else {
      this.setState({
        type: "COMPLETED",
        result,
        board
      });
    }
  };

  _tryCompleteGame(): Result | null {
    if (this.state.type !== "STARTED") {
      return null;
    }
    const board = this.state.board;
    for (let row = 0; row < board.length; row++) {
      let hasWonForTheRow = true;
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][0] == null || board[row][col] !== board[row][0]) {
          hasWonForTheRow = false;
          break;
        }
      }
      if (hasWonForTheRow) {
        return { type: "WINNER", winner: this.state.currentPlayerId };
      }
    }
    for (let col = 0; col < board[0].length; col++) {
      let hasWonForTheCol = true;
      for (let row = 0; row < board.length; row++) {
        if (board[0][col] == null || board[row][col] !== board[0][col]) {
          hasWonForTheCol = false;
          break;
        }
      }
      if (hasWonForTheCol) {
        return { type: "WINNER", winner: this.state.currentPlayerId };
      }
    }
    if (
      board[0][0] != null &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2]
    ) {
      return { type: "WINNER", winner: this.state.currentPlayerId };
    }
    if (
      board[0][2] != null &&
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0]
    ) {
      return { type: "WINNER", winner: this.state.currentPlayerId };
    }
    let hasDrawn = true;
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] == null) {
          hasDrawn = false;
          break;
        }
      }
      if (!hasDrawn) {
        break;
      }
    }
    if (hasDrawn) {
      return { type: "DRAW" };
    }
    return null;
  }

  _getPlayerNameById(id: PlayerId): string {
    switch (id) {
      case 0:
        return "O";
      case 1:
        return "X";
    }
  }
}

export default GameController;
