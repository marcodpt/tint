import {h, text, patch} from "https://unpkg.com/superfine"
import tint from "./index.js"

const render = tint(h, text)

export default state => {
  const setState = state => {
    const node = document.getElementById(state.nodeId)
    const rootTag = node.tagName
    const rootAttributes = Array.from(node.attributes).reduce((X, {
      nodeName,
      nodeValue
    }) => ({
      ...X,
      [nodeName]: nodeValue
    }), {})

    return patch(node, render(
      state.templateId,
      state,
      rootTag,
      rootAttributes
    ))
  }

  setState(state)
  return setState
}
