import Grid from "./components/Grid";

const boardState = ["hello", "found", "great", "focus", "cheer", "apple"];
// const boardState = ["", "", "", "", "", ""];

function App() {
  return (
    <div style={{ display: "inline-block" }}>
      <Grid state={boardState} />
    </div>
  );
}
export default App;
