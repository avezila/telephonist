import React, {Component} from 'react'
import {observer} from 'mobx'

import s from './Header.sass'


export default
@observer
class Header extends Component {
  render () {
    return (
      <div className={s.root}>
        Телефонист
      </div>
    )
  }
}
