import * as React from "react"

export type ModalData = Record<string, any> | null

export interface ModalRenderObject {
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

export interface ModalContextType {
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

export interface ModalStackItem {
  id: string
  name: string
  data: ModalData
  relay: boolean
}

export interface ModalControllerProps {
  name: string
  render: ModalRenderCallback
  dependencies?: ReadonlyArray<unknown>
}

const ModalContext = React.createContext<ModalContextType>(
  {} as ModalContextType
)

export function ModalProvider(props: { children: React.ReactNode }) {
  const [stack, setStack] = React.useState<ModalStackItem[]>([])
  const renderers = React.useRef<Record<string, ModalRenderCallback>>({})

  const top: ModalStackItem = React.useMemo(
    () =>
      stack.length === 0
        ? { id: "", name: "", data: null, relay: false }
        : stack[stack.length - 1],
    [stack]
  )

  /**
   * Returns if a certain modal is open
   * @param name Name of the modal
   */
  const isOpen = React.useCallback(
    (name: string) => !!stack.find((x) => x.name === name),
    [stack]
  )

  /**
   * Pushes a new modal to the stack
   * @param name Name of the modal to push
   * @param data Data relative to the pushed modal
   * @param relay Whether the previous modal is relaying control to this modal on success
   */
  const push = React.useCallback(
    (name: string, data: ModalData = null, relay: boolean = false) => {
      if (isOpen(name)) {
        throw new Error(`There is already a modal with this name (${name})`)
      }
      setStack([...stack, { id: uuid(), name, data, relay }])
    },
    [isOpen, stack]
  )

  /**
   * Pops some modals from the stack
   * @param name Name of the modal to pop, for verification purposes only [optional]
   * @param relay Whether to chain-pop all relayed modals
   */
  const pop = React.useCallback(
    (name: string | null = null, relay: boolean = false) => {
      let pointer = stack.length - 1
      if (pointer >= 0 && (name === null || stack[pointer].name === name)) {
        while (relay && pointer >= 0 && stack[pointer].relay) {
          pointer--
        }
        setStack(stack.slice(0, pointer))
      }
    },
    [stack]
  )

  /**
   * Pops all relayed modals from the stack and pushes a new modal
   * @param name Name of the modal to push
   * @param data Data relative to the pushed modal
   * @param relay Whether the last modal is relaying control to this modal on success
   */
  const popThenPush = React.useCallback(
    (name: string, data: ModalData = null, relay: boolean = false) => {
      let pointer = stack.length - 1
      while (pointer >= 0 && stack[pointer].relay) {
        pointer--
      }
      if (stack.slice(0, pointer).find((x) => x.name === name)) {
        throw new Error(`There is already a modal with this name (${name})`)
      }
      if (stack.length) {
        setStack([
          ...stack.slice(0, pointer),
          { id: uuid(), name, data, relay }
        ])
      }
    },
    [stack]
  )

  /**
   * Registers a new modal to render
   * @param name Name of the modal to register
   * @param render Function that renders the modal
   */
  const register = React.useCallback(
    ({
      name,
      render,
      replace = true
    }: {
      name: string | number
      render: ModalRenderCallback
      replace: boolean
    }) => {
      // right now this replace is not really necessary because the only place where it's called it's called with
      // `true`, we can just always set the `render` and don't have the `if` statement, but it will be used in the
      // future for modals inside list elements, just leaving it here so we know this is the way
      if (!renderers.current[name] || replace) {
        renderers.current[name] = render
      }
    },
    []
  )

  const context: ModalContextType = React.useMemo(
    () => ({
      anyOpen: !!stack.length,
      push: (name, data = null) => push(name, data, false), // Pushes new modal
      relay: (name, data = null) => push(name, data, true), // Pushes new modal relaying control
      update: (data) =>
        popThenPush(top.name, { ...top.data, ...data }, top.relay), // Updates top of stack
      isRegistered: (name) => !!renderers.current[name],
      isOpen,
      register,
      pop
    }),
    [
      isOpen,
      pop,
      popThenPush,
      push,
      register,
      stack.length,
      top.data,
      top.name,
      top.relay
    ]
  )

  const modal = renderers.current[top.name]?.({
    name: top.name,
    data: top.data,
    submit: () => pop(top.name, true), // Closes the modal in success
    cancel: () => pop(top.name, false), // Closes the modal in abort
    update: (data) =>
      popThenPush(top.name, { ...top.data, ...data }, top.relay), // Updates top of stack
    relay: (name, data = null) => push(name, data, true), // Pushes new modal relaying control
    replace: (name, data = null) => popThenPush(name, data, top.relay) // Replaces top of the stack plus all relayed
  })

  return (
    <ModalContext.Provider value={context}>
      {props.children}
      {!!modal && <React.Fragment key={top.id}>{modal}</React.Fragment>}
    </ModalContext.Provider>
  )
}

export function useModal() {
  return React.useContext(ModalContext)
}

export function withModal<Props>(WrappedComponent: React.ComponentType<Props>) {
  function WithModal(props: Props) {
    return <WrappedComponent {...props} modals={useModal()} />
  }
  WithModal.displayName = `WithModal(${WrappedComponent.displayName})`
  return WithModal
}

export function ModalController({
  name,
  render,
  dependencies = []
}: ModalControllerProps) {
  const modals = useModal()

  React.useEffect(() => {
    modals.register({ name, render, replace: true })
    // eslint-disable-next-line
  }, dependencies)

  return null
}

function uuid() {
  return Math.random().toString(16).substr(2, 10)
}
