import styled from "styled-components";

type ToastProps = {
  content?: string;
};

function Toast({ content }: ToastProps) {
  return (
    <Container>
      <Content>{content}</Content>
    </Container>
  );
}

const Content = styled.div`
  padding: 16px;
`;

const Container = styled.div`
  transform: translate(-50%, 0);
  pointer-events: none;
  background: white;
  color: black;
  border-radius: 6px;
  margin-bottom: 12px;
`;

export default Toast;
