import React, {Component} from 'react'
import {computed, autorun, action} from 'mobx'
import {observer} from 'mobx-react'

import history from 'side/History'
import {BaseLayout, Login} from 'components'
import {Tasks, AllTasks, Offers, OffersFilter} from 'components/Telephonist'
import {Error404} from 'components/Errors'

const Components = {
  BaseLayout, Login, Tasks, AllTasks, Offers, OffersFilter, Error404
}


@observer
class Router extends Component {
  constructor (props) {
    super(props)
    autorun(this.redirector)
  }

  @action redirector = () => {
    if (history.route === '/') {
      history.history.push('/tasks')
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
    switch (history.route) {
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
    if (history.route.match(/^\/task\/\w+/)) {
      return 'task'
    }

    return 'error404'
  }

  renderLevel (layouts, level, _children = []) {
    console.log('in', ...arguments)
    let out = []

    let index = 0
    for (let key in level) {
      let o = level[key]
      let children = this.renderLevel(layouts, o, _children)
      console.log(key)
      let m1 = key.match(/^([A-Z].+)/)
      let m2 = key.match(/^_(.+)/)
      if (m1) {
        index++
        console.log('m1', key, children)
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
    console.log(out)

    if (out.length === 1) return out[0]
    return out
  }

  render () {
    let layouts = this.layouts
    let layout  = layouts[this.layout]

    return this.renderLevel(layouts, layout)
  }
}

export default Router
