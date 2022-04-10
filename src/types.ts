export type ModalData = Record<string, any> | null

export type ModalRenderObject = {
  name: string
  data: ModalData
  submit: () => void
  cancel: () => void
  update: (data: ModalData) => void
  relay: (name: string, data: ModalData) => void
  replace: (name: string, data: ModalData) => void
}

export type ModalRenderCallback = (
  modalObject: ModalRenderObject
) => React.ReactNode

export type ModalContextType = {
  anyOpen: boolean
  push: (name: string, data?: ModalData) => void
  relay: (name: string, data?: ModalData) => void
  update: (data: ModalData) => void
  isRegistered: (name: string) => boolean
  isOpen: (name: string) => boolean
  register: (obj: {
    name: string
    render: ModalRenderCallback
    replace: boolean
  }) => void
  pop: (name: string | null, relay?: boolean) => void
}

export type ModalStackItem = {
  id: string
  name: string
  data: ModalData
  relay: boolean
}
