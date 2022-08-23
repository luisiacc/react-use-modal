import "react-app-polyfill/ie11"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { useModal, ModalController } from "../."

const App = () => {
  const modals = useModal()
  return <div></div>
}

ReactDOM.render(<App />, document.getElementById("root"))
