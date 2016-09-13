import React, {Component, PropTypes} from 'react'

import Header from 'containers/Header'

import s from './Base.sass'


export default
class BaseLayout extends Component {
  static propTypes = {
    children: PropTypes.node,
  }
  render () {
    return (
      <div className={s.root}>
        <Header />
        <div className={s.content}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
