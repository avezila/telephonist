import React, {Component, PropTypes} from 'react'
import {computed} from 'mobx'
import {observer} from 'mobx-react'
import minimatch from 'minimatch'
import classNames from 'classnames'

import history from 'side/History'


function isLeftClickEvent (event) {
  return event.button === 0
}

function isModifiedEvent (event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

export default
@observer
class Link extends Component {
  static propTypes = {
    isActive: PropTypes.oneOfType([
      PropTypes.instanceOf(RegExp),
      PropTypes.string,
      PropTypes.func,
    ]),
    className       : PropTypes.string,
    activeClassName : PropTypes.string,
    path            : PropTypes.string.isRequired,
    state           : PropTypes.object,
    onClick         : PropTypes.func,
  }

  handleClick = (event) => {
    if (this.props.onClick) this.props.onClick(event)

    if (event.defaultPrevented) return

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) return

    event.preventDefault()

    history.history.push(this.href, this.props.state)
  }

  @computed get isActive () {
    const {isActive} = this.props

    if (typeof isActive === 'function') {
      return isActive(history)
    } else if (isActive instanceof RegExp) {
      return isActive.test(history.route)
    } else if (typeof isActive === 'string') {
      return minimatch(history.route, isActive)
    } else if (typeof this.props.path === 'string') {
      return minimatch(history.route, this.props.path)
    }

    return false
  }

  @computed get className () {
    return classNames(
      this.props.className,
      this.isActive ? this.props.activeClassName || 'active' : ''
    )
  }

  @computed get href () {
    return `${history.base.replace(/\/$/, '')}/${this.props.path.replace(/^\//, '')}`
  }

  render () {
    let props = {...this.props}
    delete props.isActive
    delete props.className
    delete props.activeClassName
    delete props.path
    delete props.state
    delete props.onClick

    return (
      <a
        {...props}
        className={this.className}
        onClick={this.handleClick}
        href={this.href} />
    )
  }
}
