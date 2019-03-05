import React from 'react'
import { Input } from '@vkontakte/vkui'
import { AsYouType } from 'libphonenumber-js'
import PropTypes from 'prop-types'

function format(string) {
  const formater = new AsYouType('RU')
  return formater.input(string)
}

function getPlainNumberredValue(value) {
  return value.replace(/[^0-9]/g, '')
}

function getPlainNumberredValueWithPlus(value) {
  return `+${getPlainNumberredValue(value)}`
}

function valueIsNice(value) {
  return getPlainNumberredValue(value).length <= 11
}

class PhoneInput extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
  }

  static defaultProps = {
    placeholder: '',
    value: '',
    className: '',
  }

  constructor(props) {
    super(props)
    let { value } = this.props
    value = value || ''
    this.state = { value }
  }

  componentDidUpdate(prevProps) {
    const { value: newValue } = this.props
    const oldValue = prevProps.value
    if (oldValue !== newValue) this.changeValue(newValue)
  }

  onChange({ target }) {
    const { value } = target
    this.changeValue(value)
  }

  changeValue(value) {
    const { onChange } = this.props
    if (valueIsNice(value)) {
      const formattedValue = format(value)
      if (this.shouldChangeToFormatted(formattedValue, value)) {
        this.setState({ value: formattedValue })
        onChange(getPlainNumberredValueWithPlus(value))
      } else this.setState({ value })
    }
  }

  shouldChangeToFormatted(formattedValue, value) {
    const { value: stateValue } = this.state
    return !(
      formattedValue.length === stateValue.length &&
      value.length < formattedValue.length
    )
  }

  render() {
    const { onClick, className, placeholder } = this.props
    const { value } = this.state
    return (
      <Input
        type="tel"
        placeholder={format(placeholder)}
        onChange={(e) => this.onChange(e)}
        value={value}
        className={className}
        onClick={(e) => onClick(e)}
      />
    )
  }
}

export default PhoneInput
