import * as React from "react";
import { render } from "react-dom";

type PlayerId = 0 | 1;

type State =
  | {
      type: "NOT_STARTED";
    }
  | {
      type: "STARTED";
      currentPlayerId: PlayerId;
    }
  | { type: "COMPLETED"; winner: PlayerId | null };

class GameController extends React.PureComponent<void, State> {}
