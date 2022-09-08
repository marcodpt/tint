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
      const tpl = element.tagName == 'TEMPLATE'
      var e = tpl ? target : document.createElement(element.tagName)
      var loop = null
      var rows = null
      const set = (el, key, value) => {
        el.setAttribute(key, (key.substr(0, 1) != ':' ?
          e.getAttribute(key) || '' : ''
        ) + value)
      }
      var nextWord = undefined
      const rescope = (newScope) => {
        if (
          scope && typeof scope == "object" &&
          newScope && typeof newScope == "object"
        ) {
          return {...scope, ...newScope}
        } else {
          return newScope
        }
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

          if (key == 'text') {
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
              loop = tpl ? document.createElement(element.tagName) :
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
          set(loop, attr.nodeName, attr.nodeValue)
        }
      })

      const getChild = (x) => Array.from((tpl ? x.content : x).childNodes)
      if (e != null) {
        getChild(element).forEach(child => {
          render(e, child, scope, nextWord)
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
