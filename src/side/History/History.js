import {computed, observable, map, action, autorun} from 'mobx'

import createHistory from 'history/createBrowserHistory'


export default
class History {
  static singletonInstance

  @observable props = map()
  @observable base = '/9r/telephonist' // format: '/telephonist'
  @observable path = '/'

  history
  unlisten

  constructor () {
    if (History.singletonInstance) return History.singletonInstance
    History.singletonInstance = this

    this.history = createHistory()
    window.h = this
    this.syncFromUrl()

    this.unlisten = this.history.listen(this.syncFromUrl)

    autorun(this.syncToBrowserUrl)
  }

  syncToBrowserUrl = () => {
    let {path, props} = this.fromUrl()
    let now = this.toHref(path, props)
    if (this.url === now) return
    this.history.push(this.url)
  }

  toHref (path = this.path, props = this.props.toJS(), base = this.base) {
    let pathname = '/' + [base, path].map(s => s.replace(/\/$/, '').replace(/^\//, ''))
      .filter(s => s)
      .join('/')

    let search = Object.keys(props)
      .sort()
      .filter(key => key && props[key])
      .map(key => props[key] === true ? key : `${key}=${encodeURIComponent(props[key])}`)
      .join('&')

    return [pathname, search].filter(v => v).join('?')
  }

  @computed get url () {
    return this.toHref()
  }

  @action syncFromUrl = (location) => {
    location = location || this.history.location
    let {props, path} = this.fromUrl(location)
    this.path = path

    this.props.keys().forEach(key => {
      if (!props[key]) this.props.delete(key)
    })
    this.props.merge(props)
  }

  fromUrl (location = this.history.location) {
    let path = '/' + this.base.split('/').reduce((p, b) => {
      return p.replace(new RegExp(`^/?${b}/?`), '')
    }, location.pathname).replace(/^\/+/, '').replace(/\/+$/, '')

    let props = {}
    location.search.replace(/^\?/, '')
    .split('&')
    .map(kv => kv.split('='))
    .filter(([k, v]) => k)
    .map(([k, v]) => {
      props[k] = v === undefined ? true : decodeURIComponent(v)
    })
    return {path, props}
  }
}
