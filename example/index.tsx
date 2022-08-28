// import "react-app-polyfill/ie11"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { useModal, ModalController, ModalProvider } from "../."

const App = () => {
  return (
    <ModalProvider>
      <Stuff />
    </ModalProvider>
  )
}

function Stuff() {
  const modals = useModal()
  return (
    <div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => modals.push("one")}>Do me </button>
      </div>
      <ModalController
        name="one"
        render={(modal) => (
          <div
            style={{
              border: "1px solid black",
              margin: "20px",
              padding: "20px"
            }}
          >
            <span style={{ margin: "10px" }}>I'm the one</span>
            <button onClick={modal.submit}>x</button>
          </div>
        )}
      />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
