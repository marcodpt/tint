import tint from "./index.js"

const compile = tint(m)

export default (element, {state, ...options}) => {
  const render = compile(element)
  return ({
    ...(options || {}),
    view: () => render(state)
  })
}
