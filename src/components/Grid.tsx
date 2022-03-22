import styled from "styled-components";
import { MAX_GUESSES, MAX_WORD_LENGTH } from "../constants";

type GridProps = {
  state: string[];
};

function Grid({ state }: GridProps) {
  return (
    <GridContainer data-testid="grid">
      {state.map((letters: string, i: number) => (
        <GridRow letters={letters} key={i} />
      ))}
      {Array(MAX_GUESSES - state.length).map((letters: string, i: number) => (
        <GridRow letters={letters} key={i} />
      ))}
    </GridContainer>
  );
}

type GridRowProps = {
  letters: string;
};

export function GridRow({ letters }: GridRowProps) {
  return (
    <Row role="row">
      {letters.split("").map((char, i) => (
        <Tile key={i} char={char} />
      ))}
      {Array(MAX_WORD_LENGTH - letters.length)
        .fill(null)
        .map((_, i) => (
          <Tile key={i} />
        ))}
    </Row>
  );
}

type TileProps = {
  char?: string;
};

export function Tile({ char }: TileProps) {
  return <TileContainer role="tile">{char}</TileContainer>;
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
  border: 2px solid #3a3a3c;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 9px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-gap: 9px;
  padding: 5px;
  background: #121213;
  box-sizing: border-box;
`;

export default Grid;
