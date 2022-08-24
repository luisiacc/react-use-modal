import * as React from "react"
import {
  ModalController as OriginalModalController,
  ModalControllerProps,
  useModal
} from "../base"
import { useLocation } from "react-router-dom"

export function ModalController(props: ModalControllerProps) {
  const modals = useModal()
  const location = useLocation()

  React.useEffect(() => {
    modals.pop(props.name)
  }, [location?.pathname])

  return <OriginalModalController {...props} />
}
