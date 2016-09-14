import {computed, observable, map, action} from 'mobx'

import createHistory from 'history/createBrowserHistory'


class History {
  @observable location
  @observable base = ''
  @observable params = map()

  history
  unlisten

  constructor () {
    this.history = createHistory()

    this.SetLocation(this.history.location)

    this.unlisten = this.history.listen(this.onHistoryChange)
  }

  onHistoryChange = (location, action) => {
    this.SetLocation(location)
  }

  @action SetLocation (location) {
    if (this.location === undefined) {
      let o = {}
      for (let key in location) {
        if (typeof location[key] === 'string') o[key] = location[key]
      }
      this.location = o
    } else {
      for (let key in location) {
        if (typeof location[key] === 'string') {
          this.location[key] = location[key]
        }
      }
    }
    let p = {}
    location.search.replace(/^\?/, '').split('&').map(kv => {
      let [k, v] = kv.split('=')
      p[k] = v === undefined ? true : v
      this.params.set(k, v)
    })

    this.params.keys().map(key => {
      if (!p[key]) this.params.delete(key)
    })
  }
  @computed get baseReplace () {
    return new RegExp(`^${this.base}`)
  }
  @computed get route () {
    return this.location.pathname.replace(this.baseReplace, '')
  }
  @computed get document () {
    return this.route.match(/[^/]*$/)[0]
  }
}

// Singleton
const history = new History()

window.h = history

export default history
