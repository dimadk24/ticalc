import React from 'react'
import PropTypes from 'prop-types'
import { Input } from '@vkontakte/vkui'

function normalizeName(name) {
  return (
    name
      // remove any non-(letter or space)
      .replace(/[^A-Za-zА-Яa-я ]/g, '')
      // allow 1 space in the center or end
      .replace(/ {2,}/, ' ')
      .trimLeft()
  )
}

function NameInput({ onChange, value }) {
  const _onChange = (newValue) => onChange(normalizeName(newValue))
  return (
    <div>
      <span>Имя</span>
      <Input
        type="text"
        placeholder="Иван"
        onChange={(e) => _onChange(e.target.value)}
        value={value || ''}
      />
    </div>
  )
}

NameInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
}

NameInput.defaultProps = {
  value: '',
}

export default NameInput
