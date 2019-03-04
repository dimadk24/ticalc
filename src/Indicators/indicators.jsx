import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Cell} from '@vkontakte/vkui'
import './indicators.css'

class MoneyIndicator extends Component {
  static propTypes = {
    text: PropTypes.string,
    value: PropTypes.number,
    additionalClassesAsStr: PropTypes.string
  }

  render() {
    return (
      <Indicator
        text={this.props.text}
        value={`${this.props.value} руб`}
        additionalClassesAsStr={`money
                ${this.props.additionalClassesAsStr || ''}`}
      />
    )
  }
}

class SummaryMoneyIndicator extends Component {
  static propTypes = {
    text: PropTypes.string,
    value: PropTypes.number
  }

  render() {
    return (
      <MoneyIndicator
        text={this.props.text}
        value={this.props.value}
        additionalClassesAsStr={'summary'}
      />
    )
  }
}

class Indicator extends Component {
  static propTypes = {
    text: PropTypes.string,
    value: PropTypes.string,
    onClick: PropTypes.func,
    additionalClassesAsStr: PropTypes.string
  }

  render() {
    return (
      <Cell onClick={this.props.onClick && (() => this.props.onClick())}>
        <div className={`indicator ${this.props.additionalClassesAsStr || ''}`}>
          <div className={'text-wrapper'}>
            <span>{this.props.text}</span>
          </div>
          <div className={'value-wrapper'}>
            <span className={'value'}>{this.props.value}</span>
          </div>
        </div>
      </Cell>
    )
  }
}

export {MoneyIndicator, SummaryMoneyIndicator, Indicator}
