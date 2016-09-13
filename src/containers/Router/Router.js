import React, {Component} from 'react'
import {observer} from 'mobx-react'

import LoginLayout from 'layouts/Login'
import FilterTasks from 'layouts/Telephonist/FilterTasks'
import history from 'side/History'


@observer
class Router extends Component {
  render () {
    switch (history.route) {
      case '/login' :
        return <LoginLayout />
    }
    return <FilterTasks />
  }
}

export default Router
