import Modal from "./Modal";
import { fireEvent, render } from "@testing-library/react";

describe("Modal", () => {
  it("renders children and a close button", () => {
    const close = jest.fn();
    const reset = jest.fn();

    const { getByText } = render(
      <Modal close={close} isOpen={true} reset={reset}>
        <div>hello</div>
      </Modal>
    );

    expect(getByText("hello")).toBeTruthy();

    fireEvent.click(getByText("X"));

    expect(close).toHaveBeenCalledTimes(1);
  });
});
