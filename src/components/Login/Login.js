import React, {Component, PropTypes} from 'react'
import classNames from 'classnames'
import {inject, observer} from 'mobx-react'

import s from './Login.sass'


export default
@inject('history')
@observer
class LoginContainer extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  }
  render () {
    return (
      <form
        name='login'
        action={this.props.history.url}
        className={classNames(s.root, 'input-group')}>
        <h3 className={s.header}>SRG</h3>
        <div className={s.row}>
          <input
            name='login'
            className='form-control'
            type='text'
            placeholder='Логин'
            autoFocus
          />
        </div>
        <div className={s.row}>
          <input
            name='password'
            type='password'
            className='form-control'
            placeholder='Пароль'
          />
        </div>
        <div className={s.row}>
          <button
            type='submit'
            className='btn btn-primary'>
            Войти
          </button>
        </div>
      </form>
    )
  }
}
