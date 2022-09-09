const cannabis = (target, element, scope) => {
  const getEl = (x, strict) => {
    if (typeof x == 'string') {
      const e = document.getElementById(x)
      if (strict && !e) {
        throw `cannabis unable to find element: ${x}`
      }
      return e
    } else {
      return x
    }
  }

  target = getEl(target, true)
  element = getEl(element, true)

  const render = (target, element, scope, word) => {
    if (element.nodeType != 1) {
      target.appendChild(element.cloneNode(true))
    } else {
      var name = element.tagName.toLowerCase()
      const tag = name.indexOf('-') > -1 ? getEl(name) : null
      var context = null
      const remap = {}
      if (tag && tag.tagName.toLowerCase() == 'template') {
        const node = document.createElement('template')
        node.innerHTML = tag.innerHTML.trim()
        var slot = node.content.querySelector('slot')
        if (slot) {
          const newSlot = document.createElement('template')
          newSlot.innerHTML = element.innerHTML
          Array.from(slot.attributes).forEach(attr => {
            newSlot.setAttribute(attr.nodeName, attr.nodeValue)
          })
          slot.replaceWith(newSlot)
          slot = newSlot
        }
        Array.from(element.attributes).forEach(attr => {
          if (/^:?(html|text)$/.test(attr.nodeName)) {
            slot.setAttribute(attr.nodeName, attr.nodeValue)
            if (attr.nodeName.substr(0, 1) == ':') {
              node.setAttribute(':'+attr.nodeValue, attr.nodeValue)
            }
          } else {
            node.setAttribute(attr.nodeName, attr.nodeValue)
          }
        })
        context = {}
        name = 'template'
        element = node
      }
      const tpl = name == 'template'
      var e = tpl ? target : document.createElement(name)
      var loop = null
      var rows = null
      const set = (el, key, value) => {
        if (context) {
          context[key] = (context[key] || '') + value
        } else {
          el.setAttribute(key, (key.substr(0, 1) != ':' ?
            e.getAttribute(key) || '' : ''
          ) + value)
        }
      }
      var nextWord = undefined
      const rescope = (newScope) => {
        var r = {}
        if (
          (scope && typeof scope == "object") &&
          newScope && typeof newScope == "object"
        ) {
          r =  {...scope, ...newScope}
        } else {
          r =  newScope
        }
        if (context) {
          r = Object.keys(remap).reduce((x, key) => {
            x[remap[key]] = r[key]
            return x
          }, r)
        }
        return r
      }

      Array.from(element.attributes).forEach(attr => {
        if (attr.nodeName == 'switch') {
            nextWord = attr.nodeValue
        } else if (attr.nodeName == 'case') {
            if (word != attr.nodeValue) {
              e = null
            }
        } else if (e && attr.nodeName.substr(0, 1) != ':') {
          set(e, attr.nodeName, attr.nodeValue)
        } else if (e) {
          const key = attr.nodeName.substr(1)
          const prop = attr.nodeValue
          const res = !prop.length ? scope : scope ? scope[prop] : null
          const okay = res != null && res !== false
          const label = res === true ? '' : okay ? String(res) : ''

          if (context && [
            'if', 'not', 'with', 'each', 'switch', 'case'
          ].indexOf(key) == -1) {
            if (key) {
              context[key] = res
            } else {
              context = res
            }
          } else if (key == 'text') {
            e.appendChild(document.createTextNode(label))
          } else if (key == 'html') {
            e.innerHTML = e.innerHTML+label
          } else if (key == 'if' || key == 'not') {
            if ((res && key == 'not') || (!res && key == 'if')) {
              e = null
            }
          } else if (key == 'switch') {
            nextWord = res
          } else if (key == 'case') {
            if (word != res) {
              e = null
            }
          } else if (key == 'with') {
            scope = rescope(res)
          } else if (key == 'each') {
            if (res instanceof Array && res.length) {
              loop = tpl ? document.createElement(name) :
                e.cloneNode(true)
              loop.innerHTML = element.innerHTML
              rows = res
            }
            e = null
          } else if (!okay) {
            e.removeAttribute(key)
          } else {
            set(e, key, label)
          }
        } else if (loop) {
          if (context && attr.nodeName.substr(0, 1) == ':') {
            remap[attr.nodeValue] = attr.nodeName.substr(1)
          } else {
            set(loop, attr.nodeName, attr.nodeValue)
          }
        }
      })

      const getChild = (x) => Array.from((tpl ? x.content : x).childNodes)
      if (e != null) {
        getChild(element).forEach(child => {
          render(e, child, context || scope, nextWord)
        })

        if (target != e) {
          target.appendChild(e)
        }
      } else if (loop) {
        rows.forEach(row => {
          render(target, loop.cloneNode(true), rescope(row), nextWord)
        })
      }
    }
  }
  render(target, element, scope)
}
