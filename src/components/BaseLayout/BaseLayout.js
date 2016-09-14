import React, {Component, PropTypes} from 'react'
import 'todc-bootstrap/dist/css/bootstrap.css'
import 'todc-bootstrap/dist/css/bootstrap-theme.css'
import 'todc-bootstrap/dist/css/todc-bootstrap.css'
import 'react-bootstrap-multiselect/css/bootstrap-multiselect.css'

import Header from 'components/Header'
import 'styles/core'

import s from './BaseLayout.sass'


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
