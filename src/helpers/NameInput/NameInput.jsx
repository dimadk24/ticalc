import React, { useState } from 'react'
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

function NameInput({ onChange, initialValue }) {
  const [value, setValue] = useState(initialValue || '')
  const _onChange = (newValue) => {
    const normalizedValue = normalizeName(newValue)
    setValue(normalizedValue)
    onChange(normalizedValue)
  }
  return (
    <div>
      <span>Имя</span>
      <Input
        type="text"
        placeholder="Иван"
        onChange={(e) => _onChange(e.target.value)}
        value={value}
      />
    </div>
  )
}

NameInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  initialValue: PropTypes.string,
}

NameInput.defaultProps = {
  initialValue: '',
}

export default NameInput
