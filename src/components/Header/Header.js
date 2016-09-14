import React, {Component} from 'react'
import {observer} from 'mobx-react'

import Link from 'side/Link'

import s from './Header.sass'


export default
@observer
class Header extends Component {
  render () {
    return (
      <div className={s.root}>
        <div className={s.logo}>Телефонист</div>
        <Link className={s.link} activeClassName={s.active} path='/tasks'>Мои задачи</Link>
        <Link className={s.link} activeClassName={s.active} path='/all-tasks'>Все задачи</Link>
        <Link className={s.link} activeClassName={s.active} path='/offers'>Реестр объявлений</Link>
      </div>
    )
  }
}
