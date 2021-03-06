# react-use-modal

> A react library for managing the state of your modals

## Install

```bash
npm install --save react-use-modal
```

## Usage

This is just a showcase, please refer to the docs to see how to cover most use cases

```tsx
import React from "react"

import SomeModal from "some-modal"; // I'm just making this up, imagine is a real modal
import { useModal, ModalController } from "react-use-modal"

function Example(props: any) {
  const modals = useModal()

  const doSomething = (data: any) => {
    // ...
  }

  return (
    <>
      <button onClick={() => modals.push("some-modal")}>Show something</button>
      <ModalController name="some-modal" render={modal => (
        <SomeModal visible onCancel={modal.cancel} onSave={(someData: any) => {
          doSomething(someData)
          modal.submit();
        }}>
      )} />
    </>
  )
}
```

