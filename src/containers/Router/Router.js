import React, {Component, PropTypes} from 'react'
import {computed, autorun, action} from 'mobx'
import {observer, inject} from 'mobx-react'

import {BaseLayout, Login} from 'components'
import {Tasks, AllTasks, Offers, OffersFilter} from 'components/Telephonist'
import {Error404} from 'components/Errors'
import {STATUS_PRELOADED} from 'store/Auth'


const Components = {
  BaseLayout, Login, Tasks, AllTasks, Offers, OffersFilter, Error404
}


@inject('history', 'auth')
@observer
class Router extends Component {
  static propTypes = {
    history : PropTypes.object.isRequired,
    auth    : PropTypes.object.isRequired,
  }

  constructor (props) {
    super(props)
    autorun(this.redirector)
  }

  @action redirector = () => {
    if (this.props.history.path === '/') {
      this.props.history.path = '/tasks'
    }
  }

  @computed get layouts () {
    return {
      base: {
        BaseLayout: {
          children: {},
        }
      },
      login: {
        _base: {
          Login: {},
        },
      },
      tasks: {
        _base: {
          Tasks: {},
        },
      },
      allTasks: {
        _base: {
          AllTasks: {},
        },
      },
      task: {
        _base: {
          Task: {},
        },
      },
      offers: {
        _base: {
          OffersFilter : {},
          Offers       : {},
        },
      },
      error404: {
        _base: {
          Error404: {},
        },
      },
    }
  }

  @computed get layout () {
    let {auth, history} = this.props

    if (auth.status < STATUS_PRELOADED) return 'base'

    switch (history.path) {
      case '/' :
        return 'tasks'
      case '/login' :
        return 'login'
      case '/tasks' :
        return 'tasks'
      case '/all-tasks' :
        return 'allTasks'
      case '/offers' :
        return 'offers'
    }
    if (history.path.match(/^\/task\/\w+/)) {
      return 'task'
    }

    return 'error404'
  }

  renderLevel (layouts, level, _children = []) {
    let out = []

    let index = 0
    for (let key in level) {
      let o = level[key]
      let children = this.renderLevel(layouts, o, _children)
      let m1 = key.match(/^([A-Z].+)/)
      let m2 = key.match(/^_(.+)/)
      if (m1) {
        index++
        out.push(React.createElement(Components[key], {
          key      : key + index,
          children : children,
          ...o.props,
        }))
      } else if (key === 'children') {
        out = out.concat(_children)
      } else if (m2) {
        m2 = m2[1]
        out.push(this.renderLevel(layouts, layouts[m2], children))
      }
    }

    if (out.length === 1) return out[0]
    return out
  }

  render () {
    let layouts = this.layouts
    let layout  = layouts[this.layout]
    console.log(layout)

    return this.renderLevel(layouts, layout)
  }
}

export default Router
