import {observable, map, autorun, action} from 'mobx'

import FetchUser from 'side/Fetch/User'

export const LOGGED_OUT = 'LOGGED_OUT'
export const TELEPHONIST_BASIC_ACCESS = 'TELEPHONIST_BASIC_ACCESS'
export const TELEPHONIST_FULL_ACCESS  = 'TELEPHONIST_FULL_ACCESS'

export const STATUS_INITIAL = -2
export const STATUS_LOADING = -1
export const STATUS_ERROR   = 1
export const STATUS_PRELOADED  = 2
export const STATUS_LOADED  = 3


export default
class Auth {
  static singletonInstance

  @observable firstName = ''
  @observable lastName  = ''
  @observable access    = map()
  @observable loggedIn  = false

  @observable status    = STATUS_INITIAL
  @observable tryed     = 0

  constructor () {
    if (Auth.singletonInstance) return Auth.singletonInstance
    Auth.singletonInstance = this

    this.LoadFromLocal()
    autorun(this.LoadUser)
  }
  LoadFromLocal () {
    let data
    try {
      data = JSON.parse(localStorage.getItem('auth'))
    } catch (e) {
      return
    }
    if (!data) return

    this.fromJson(data)
  }
  LoadUser = async () => {
    if ([STATUS_ERROR, STATUS_PRELOADED, STATUS_INITIAL].indexOf(this.status) < 0) return
    if (this.tryed > 2) {
      return this.FailedLoad()
    }

    try {
      let user = await FetchUser()
      this.FetchedUser(user)
    } catch (e) {
      this.FetchedUser({error: e})
    }
  }
  @action FailedLoad () {
    localStorage.removeItem('auth')
  }
  @action FetchedUser (o) {
    let {error} = o
    if (error) {
      console.error(error)
      this.tryed++
      this.status = STATUS_ERROR
      return
    }

    this.tryed = 0
    this.status = STATUS_LOADED

    this.fromJson(o)

    console.log('write', JSON.stringify(this.toJson))
    localStorage.setItem('auth', JSON.stringify(this.toJson))
  }
  @action fromJson ({access = [], firstname, lastname, error, loggedIn}) {
    if (this.status < STATUS_PRELOADED) this.status = STATUS_PRELOADED
    this.firstName = firstname
    this.lastName  = lastname
    this.loggedIn  = loggedIn

    this.access.clear()
    access.forEach(role => this.access.set(role, true))
  }
  get toJson () {
    return {
      firstname : this.firstName,
      lastname  : this.lastName,
      loggedIn  : this.loggedIn,
      access    : this.access.keys().slice(),
    }
  }
}
