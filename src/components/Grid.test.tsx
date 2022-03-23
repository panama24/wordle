import { render } from "@testing-library/react";
import Grid, { GridRow, Tile } from "./Grid";

describe("Grid", () => {
  test("renders the correct number of rows", () => {
    const boardState = ["", "", "", "", "", ""];
    const { queryAllByRole } = render(<Grid state={boardState} />);
    expect(queryAllByRole("row")).toHaveLength(6);
  });
});

describe("GridRow", () => {
  test("renders the correct number of tiles within the rows when there are no letters", () => {
    const { queryAllByRole } = render(<GridRow letters="" />);
    expect(queryAllByRole("tile")).toHaveLength(5);
  });

  test("renders the correct number of tiles within the rows when there are letters", () => {
    const { queryAllByRole } = render(<GridRow letters="hello" />);
    expect(queryAllByRole("tile")).toHaveLength(5);
  });
});

describe("Tile", () => {
  test("renders correctly when there is no character", () => {
    const { queryByText } = render(<Tile state="transparent" />);
    expect(queryByText("h")).toBeNull();
    expect(queryByText("r")).toBeNull();
    expect(queryByText("g")).toBeNull();
    expect(queryByText("s")).toBeNull();
  });

  test("renders correctly when there is a character", () => {
    const { getByText } = render(<Tile char="h" state="transparent" />);
    expect(getByText("h")).toBeInTheDocument();
  });
});
