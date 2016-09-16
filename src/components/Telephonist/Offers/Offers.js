import React, {Component} from 'react'
import classNames from 'classnames'

import s from './Offers.sass'


export default
class Offers extends Component {
  row (id) {
    return (
      <div key={id} className={classNames(s.row, s.body)}>
        <div className={classNames(s.col, s.index)}>1</div>
        <div className={classNames(s.wrapper, s.attributes)}>
          <div className={classNames(s.wrapper, s.address_space)}>
            <div className={classNames(s.column, s.address)}>г. Москва, ул. Мясницкая, д. 29</div>
            <div className={classNames(s.column, s.space)}>360 кв. м.</div>
          </div>
          <div className={classNames(s.wrapper, s.price_type)}>
            <div className={classNames(s.column, s.type)}>Офисное</div>
            <div className={classNames(s.column, s.price)}>12 032 000 руб.</div>
          </div>
          <div className={classNames(s.wrapper, s.date_action)}>
            <div className={classNames(s.column, s.date)}>05.08.2016</div>
            <div className={classNames(s.column, s.action)}>Выбрать действия^</div>
          </div>
        </div>
      </div>
    )
  }
  render () {
    let rows = []
    for (let i = 0; i < 10; i++) {
      rows.push(this.row(i))
    }

    return (
      <div className={s.root}>
        <div className={s.content}>
          <div className={classNames(s.row, s.header)}>
            <div className={classNames(s.column, s.index)}>#</div>
            <div className={classNames(s.wrapper, s.attributes)}>
              <div className={classNames(s.wrapper, s.address_space)}>
                <div className={classNames(s.column, s.address)}>Адрес</div>
                <div className={classNames(s.column, s.space)}>Общая площадь</div>
              </div>
              <div className={classNames(s.wrapper, s.price_type)}>
                <div className={classNames(s.column, s.type)}>Тип объекта оценки</div>
                <div className={classNames(s.column, s.price)}>Цена</div>
              </div>
              <div className={classNames(s.wrapper, s.date_action)}>
                <div className={classNames(s.column, s.date)}>Дата объявления</div>
                <div className={classNames(s.column, s.action)}>Действия</div>
              </div>
            </div>
          </div>
          {rows}
        </div>
      </div>
    )
  }
}
