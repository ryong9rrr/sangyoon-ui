import Component from "./Component"
import { isDiff, spreadObject } from "./helpers"

export const modifyPropsOfChildren = <T>(
  obj: T,
  component: Component<unknown, unknown>,
) => {
  const children = component._children

  children.forEach((subComponent) => {
    spreadObject(obj).forEach(([key, value]) => {
      if (key in subComponent._props) {
        subComponent._prevProps = { ...subComponent._props }
        subComponent._props[key] = value
      }
    })
    modifyPropsOfChildren(subComponent._props, subComponent)
  })
}

export const rerenderChildren = (component: Component<unknown, unknown>) => {
  const children = component._children

  children.forEach((subComponent) => {
    subComponent._render()
    rerenderChildren(subComponent)
  })
}

export const callComponentDidUpdateOfChildren = (
  component: Component<unknown, unknown>,
) => {
  const children = component._children

  children.forEach((subComponent) => {
    callComponentDidUpdateOfChildren(subComponent)

    const prev = {
      state: { ...subComponent._prevState },
      props: { ...subComponent._prevProps },
    }

    const current = {
      state: { ...subComponent._state },
      props: { ...subComponent._props },
    }

    if (isDiff(prev, current)) {
      subComponent.componentDidUpdate()
    }
  })
}
