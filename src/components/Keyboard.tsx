import styled from "styled-components";
import { DEL, ENTER } from "../constants";

type KeyboardProps = {
  onCharKey: (key: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  state: Record<string, string | undefined>;
};

function Keyboard({ onCharKey, onDelete, onEnter, state }: KeyboardProps) {
  return (
    <Container>
      <Row>
        {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((char, i) => (
          <Key
            key={i}
            onClick={() => onCharKey(char)}
            state={state[char.toLowerCase()]}>
            {char}
          </Key>
        ))}
      </Row>
      <Row>
        {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((char, i) => (
          <Key
            key={i}
            onClick={() => onCharKey(char)}
            state={state[char.toLowerCase()]}>
            {char}
          </Key>
        ))}
      </Row>
      <Row>
        <Key onClick={onEnter}>{ENTER}</Key>
        {["Z", "X", "C", "V", "B", "N", "M"].map((char, i) => (
          <Key
            key={i}
            onClick={() => onCharKey(char)}
            state={state[char.toLowerCase()]}>
            {char}
          </Key>
        ))}
        <Key onClick={onDelete}>{DEL}</Key>
      </Row>
    </Container>
  );
}

const Row = styled.div`
  display: flex;
`;

const Key = styled.button<{ state?: string }>`
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 0.75rem;
  width: 42px;
  height: 58px;
  margin: 6px 5px 0 0;
  background: ${({ state }) => `${toBgFrom(state)}`};
`;

function toBgFrom(state?: string) {
  if (state === "correct") {
    return "#6aaa64";
  } else if (state === "present") {
    return "#c9b458";
  } else if (state === "absent") {
    return "#3a3a3c";
  }
  return "#818384";
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export default Keyboard;
