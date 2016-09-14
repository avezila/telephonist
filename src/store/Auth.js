import {observable, map, autorun, action, runInAction} from 'mobx'

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
  @observable firstName = ''
  @observable lastName  = ''
  @observable access    = map()

  @observable status    = STATUS_INITIAL
  @observable tryed     = 0

  constructor () {
    autorun(this.LoadUser)
  }

  @action LoadUser = async () => {
    if ([STATUS_ERROR, STATUS_INITIAL].indexOf(this.status) < 0) return
    if (this.tryed > 2) return

    let user = await FetchUser()
    runInAction(() => {
      console.log('fetch user', user)
    })
  }
}

// singleton
const auth = new Auth()
export default auth
