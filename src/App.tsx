import Grid from "./components/Grid";

// const boardState = ["hello", "hell", "hel", "he", "h", ""];
const boardState = ["", "", "", "", "", ""];

function App() {
  return (
    <div style={{ display: "inline-block" }}>
      <Grid state={boardState} />
    </div>
  );
}
export default App;
