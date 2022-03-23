import styled from "styled-components";
import { DEL, ENTER } from "../constants";

type KeyboardProps = {
  onCharKey: (key: string) => void;
  onDelete: () => void;
  onEnter: () => void;
};

function Keyboard({ onCharKey, onDelete, onEnter }: KeyboardProps) {
  return (
    <Container>
      <Row>
        {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((char, i) => (
          <Key key={i} onClick={() => onCharKey(char)}>
            {char}
          </Key>
        ))}
      </Row>
      <Row>
        {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((char, i) => (
          <Key key={i} onClick={() => onCharKey(char)}>
            {char}
          </Key>
        ))}
      </Row>
      <Row>
        <Key onClick={onEnter}>{ENTER}</Key>
        {["Z", "X", "C", "V", "G", "H", "M"].map((char, i) => (
          <Key key={i} onClick={() => onCharKey(char)}>
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

const Key = styled.button`
  background: #818384;
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
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export default Keyboard;
