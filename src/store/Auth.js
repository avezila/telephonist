import {observable, map, autorun, action} from 'mobx'

import FetchUser from 'side/Fetch/User'

export const LOGGED_OUT = 'LOGGED_OUT'
export const TELEPHONIST_BASIC_ACCESS = 'TELEPHONIST_BASIC_ACCESS'
export const TELEPHONIST_FULL_ACCESS  = 'TELEPHONIST_FULL_ACCESS'

export const STATUS_INITIAL = -2
export const STATUS_LOADING = -1
export const STATUS_LOADED  = 1
export const STATUS_ERROR   = 2


export default
class Auth {
  static singletonInstance

  @observable firstName = ''
  @observable lastName  = ''
  @observable access    = map()

  @observable status    = STATUS_INITIAL
  @observable tryed     = 0

  constructor () {
    if (Auth.singletonInstance) return Auth.singletonInstance
    Auth.singletonInstance = this

    autorun(this.LoadUser)
  }

  LoadUser = async () => {
    if ([STATUS_ERROR, STATUS_INITIAL].indexOf(this.status) < 0) return
    if (this.tryed > 2) return

    try {
      let user = await FetchUser()
      this.FetchedUser(user)
    } catch (e) {
      this.FetchedUser({error: e})
    }
  }

  @action FetchedUser ({access, firstname, lastname, error}) {
    if (error) {
      console.error(error)
      this.tryed++
      this.status = STATUS_ERROR
      return
    }
    console.log('ok')
    this.tryed = 0
    this.status = STATUS_LOADED

    this.firstName = firstname
    this.lastName  = lastname

    this.access.clear()
    access.forEach(role => this.access.set(role, true))
  }
}
