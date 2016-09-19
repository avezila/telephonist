import React, {Component, PropTypes} from 'react'
import {observer, inject} from 'mobx-react'

import Link from 'side/Link'

import s from './Header.sass'


export default
@inject('auth')
@observer
class Header extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
  }
  loggedIn () {
    let {auth} = this.props
    return (
      <div className={s.right_group}>
        <div className={s.text}>
          {`${auth.firstName} ${auth.lastName}`}
        </div>
        <Link className={s.glyph} path='/login'>
          <i className='fa fa-sign-out' aria-hidden='true' />
        </Link>
      </div>
    )
  }
  loggedOut () {
    return (
      <div className={s.right_group}>
        <Link className={s.link} path='/login'>Войти</Link>
      </div>
    )
  }
  render () {
    let {auth} = this.props

    return (
      <div className={s.root}>
        <Link className={s.logo} path='/tasks'>Телефонист</Link>
        <Link className={s.link} activeClassName={s.active} path='/tasks'>Мои задачи</Link>
        <Link className={s.link} activeClassName={s.active} path='/all-tasks'>Все задачи</Link>
        <Link className={s.link} activeClassName={s.active} path='/offers'>Реестр объявлений</Link>
        {auth.loggedIn ? this.loggedIn() : this.loggedOut()}
      </div>
    )
  }
}
