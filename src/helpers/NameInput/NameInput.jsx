import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Input } from '@vkontakte/vkui'

function NameInput({ onChange, initialValue }) {
  const [value, setValue] = useState(initialValue || '')
  const _onChange = (newValue) => {
    setValue(newValue)
    onChange(newValue)
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
