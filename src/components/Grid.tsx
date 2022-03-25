import styled from "styled-components";
import { GameState, MAX_GUESSES, MAX_WORD_LENGTH, Score } from "../constants";

type GridProps = {
  state: any;
};

function Grid({ state }: GridProps) {
  const {
    gameState: { boardState, scores },
  } = state;
  const emptyRows = Array(MAX_GUESSES - boardState.length);
  return (
    <GridContainer data-testid="grid">
      {boardState.map((letters: string, i: number) => (
        <GridRow key={i} letters={letters} scores={scores[i]} />
      ))}
      {emptyRows.map((letters: string, i: number) => (
        <GridRow key={i} letters={letters} scores={scores[i]} />
      ))}
    </GridContainer>
  );
}

type GridRowProps = {
  letters: string;
  scores: Score;
};

export function GridRow({ letters, scores }: GridRowProps) {
  const empties = Array(MAX_WORD_LENGTH - letters.length);
  return (
    <Row role="row">
      {letters.split("").map((char, i) => (
        <Tile
          key={i}
          char={char}
          state={scores[i] === null ? "tbd" : scores[i]}
        />
      ))}
      {empties.fill(null).map((_, i) => (
        <Tile key={i} state="empty" />
      ))}
    </Row>
  );
}

type TileProps = {
  char?: string;
  state: any;
};

export function Tile({ char, state }: TileProps) {
  return (
    <TileContainer role="tile" data-state={state}>
      {char}
    </TileContainer>
  );
}

const TileContainer = styled.div`
  width: 64px;
  height: 64px;
  color: white;
  font-size: 36px;
  font-weight: bold;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;

  &[data-state="empty"] {
    border: 2px solid #3a3a3c;
  }
  &[data-state="tbd"] {
    border: 2px solid #565758;
  }
  &[data-state="correct"] {
    background: #6aaa64;
    border: 2px solid #6aaa64;
  }
  &[data-state="present"] {
    background: #c9b458;
    border: 2px solid #c9b458;
  }
  &[data-state="absent"] {
    background: #3a3a3c;
    border: 2px solid #3a3a3c;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 5px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-gap: 5px;
  padding: 5px;
  background: #121213;
  box-sizing: border-box;
`;

export default Grid;
