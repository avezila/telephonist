import React, {Component} from 'react'
import {useStrict} from 'mobx'
import {Provider as MobxProvider} from 'mobx-react'

import History from 'side/History'
import Auth from 'store/Auth'
import Router from 'containers/Router'


useStrict(true)

export default
class RootContainer extends Component {
  history = new History()
  auth = new Auth()

  render () {
    return (
      <MobxProvider history={this.history} auth={this.auth}>
        <Router />
      </MobxProvider>
    )
  }
}
