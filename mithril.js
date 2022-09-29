import tint from "./index.js"

const render = tint(m)

export default state => ({
  ...state,
  view: () => render(state.templateId, state)
})
