class Single_Page_Application {

  constructor() {
    this.page = {},
    this.component = {},
    this.rebuildPage = true
  }

  start(params) {
    this.newDiv(document.body, 'spaBody')
    this.newDiv(document.body, 'spaFullBody')
    this.onload = true
    let setPage = window.location.hash.split('#')[1]
    window.location.hash = ''
    setPage ? this.setPage(setPage) : this.setPage(params.landingPage, true)
  }

  setPage(page, onload)  {
    this.currentPage = page
    window.location.hash = '#'+page
    if (onload) this.page[page]({ id: page, parent: ".spa-css-"+page })
  }

  hashChange(event) {
    const page = window.location.hash.split('#')[1]
    if (window.location.hash !== '#'+this.currentPage) {
      this.currentPage = window.location.hash.split('#')[1]
    }
    if (!this.onload) {
      const cp = this.currentPage
      this.page[cp]({ id: page, parent: ".spa-css-"+cp })
    }
    this.onload = false
  }

  buildPage(params) {
    const sfullB = document.getElementById('spaFullBody')
    const sBody = document.getElementById('spaBody')
    if (params.fullPage) {
      while (sfullB.hasChildNodes()) { sfullB.removeChild(sfullB.lastChild) }
      return this.setSwapPage(params, spaFullBody)
    } else {
      let ap = document.getElementById('activePage')
      if (ap) { while (ap.hasChildNodes()) { ap.removeChild(ap.lastChild) } }
      else { ap = this.newDiv(sBody, 'activePage') }
      return this.setSwapPage(params, ap)
    }
  }

  setSwapPage(params, page) {
    this.classSwap(params, page)
    spaFullBody.style.display = params.fullPage ? '' : 'none'
    spaBody.style.display = params.fullPage ? 'none' : ''
    return page
  }

  buildComponent(params) {
    params.parent = '.spa-css-'+params.id
    if (params.preserve && document.getElementById(params.id)) {
      return false
    } else {
      const spaBody = document.getElementById('spaBody')
      const component = document.createElement('div')
      if (params.preserve) component.id = params.id
      params.className = 'spa-css-'+params.id
      component.classList.add(params.className)
      spaBody.appendChild(component)
      return component
    }
  }

  localizeCss(folders = ['-components','-pages']) {
    for (const s of document.scripts) {
      let dir = s.src.split('/')
      const script = dir.pop().split('.js')[0]
      dir = dir.join('/')+'/'+script+'.css'
      dir = dir.split(window.location.origin)[1]
      if (dir) {
        dir = dir.split(window.location.pathname)[1]
        if (folders.includes(dir.split('/')[0])) {
          const sheetToAdd = document.createElement('link')
          sheetToAdd.setAttribute('rel', 'stylesheet')
          sheetToAdd.setAttribute('id', 'style-'+script)
          sheetToAdd.setAttribute('type', 'text/css')
          sheetToAdd.setAttribute('href', dir)
          document.getElementsByTagName('head')[0].appendChild(sheetToAdd)
          const img = document.createElement("img")
          img.onerror = function() {
            document.body.removeChild(img);
            spa.localizeAllSelectors(script)
          }
          document.body.appendChild(img)
          img.src = dir
        }
      }
    }
  }

  localizeAllSelectors(id) {
    let sheet;
    for (const i in document.styleSheets) {
      const s = document.styleSheets[i]
      if (s.ownerNode && s.ownerNode.id === 'style-'+id) {
        sheet = document.styleSheets[i]
      }
    }
    const len = sheet.cssRules.length
    for (var i = 0; i < len; i++) {
      const rule = sheet.cssRules[i].cssText
      sheet.deleteRule(i)
      sheet.insertRule('.'+'spa-css-'+id+' '+rule, i);
    }
  }

  classSwap(params, activePage) {
    params.className = 'spa-css-'+params.id
    activePage.classList.add(params.className)
    activePage.classList.remove('spa-css-'+this.previousCss)
    this.previousCss = params.id
  }

  newDiv(parent, id) {
    const newElm = document.createElement('div')
    newElm.id = id
    parent.appendChild(newElm)
    return newElm
  }

}
