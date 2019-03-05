import React from 'react'
import PropTypes from 'prop-types'
import { Cell } from '@vkontakte/vkui'
import './indicators.css'

function MoneyIndicator({ text, value, additionalClassesAsStr }) {
  return (
    <Indicator
      text={text}
      value={`${value} руб`}
      additionalClassesAsStr={`money ${additionalClassesAsStr || ''}`}
    />
  )
}

MoneyIndicator.propTypes = {
  text: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  additionalClassesAsStr: PropTypes.string,
}

MoneyIndicator.defaultProps = {
  additionalClassesAsStr: '',
}

function SummaryMoneyIndicator({ text, value }) {
  return (
    <MoneyIndicator
      text={text}
      value={value}
      additionalClassesAsStr="summary"
    />
  )
}

SummaryMoneyIndicator.propTypes = {
  text: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
}

function Indicator({ text, value, onClick, additionalClassesAsStr }) {
  return (
    <Cell onClick={onClick && (() => onClick())}>
      <div className={`indicator ${additionalClassesAsStr || ''}`}>
        <div className="text-wrapper">
          <span>{text}</span>
        </div>
        <div className="value-wrapper">
          <span className="value">{value}</span>
        </div>
      </div>
    </Cell>
  )
}

Indicator.propTypes = {
  text: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  additionalClassesAsStr: PropTypes.string,
}

Indicator.defaultProps = {
  onClick: () => {},
  additionalClassesAsStr: '',
}

export { MoneyIndicator, SummaryMoneyIndicator, Indicator }
