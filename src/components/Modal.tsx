import styled from "styled-components";

type ModalProps = {
  content: any;
  close: () => void;
  isOpen: boolean;
};

function Modal({ content, close, isOpen }: ModalProps) {
  return (
    <Overlay visible={isOpen}>
      <Container>
        <span onClick={close}>X</span>
        <Content>
          <div>STATISTICS</div>
          <div style={{ display: "flex" }}>
            <div>Played</div>
            <div>Win %</div>
            <div>Current Streak</div>
            <div>Max Streak</div>
          </div>
          <div>GUESS DISTRIBUTION</div>
          <div>BAR CHART</div>
          <div>NEXT WORDLE</div>
          <div style={{ display: "flex" }}>
            <div>HH:MM:SS</div>
            <div>|</div>
            <div>Share</div>
          </div>
        </Content>
      </Container>
    </Overlay>
  );
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  background: #1a1a1b;
  color: white;
  width: 60%;
  height: 60%;
  padding: 24px;
  border-radius: 9px;
`;

const Overlay = styled.div<{ visible: boolean }>`
  display: ${({ visible }) => (visible ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 3;
  background: rgba(0, 0, 0, 0.5);
`;

export default Modal;
