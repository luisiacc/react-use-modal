import * as React from "react"
import * as ReactDOM from "react-dom"
import { ModalController, ModalProvider } from "../src"

const MockModal = () => (
  <ModalProvider>
    <ModalController name="mock-name" render={() => <div />} />
  </ModalProvider>
)

describe("it", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div")
    ReactDOM.render(<MockModal />, div)
    ReactDOM.unmountComponentAtNode(div)
  })
})
