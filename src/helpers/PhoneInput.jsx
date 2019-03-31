import React from 'react'
import { Input } from '@vkontakte/vkui'
import { AsYouType } from 'libphonenumber-js'
import PropTypes from 'prop-types'
import { getInfoFromVKConnect } from './helpers'

function getPhoneInfo() {
  return getInfoFromVKConnect('VKWebAppGetPhoneNumber')
}

function format(string) {
  let localString = string
  if (!localString.startsWith('+') && localString !== '')
    localString = `+${localString}`
  const formatter = new AsYouType('RU')
  return formatter.input(localString)
}

function getPlainNumberredValue(value) {
  return value.replace(/[^0-9]/g, '')
}

function getPlainNumberredValueWithPlus(value) {
  return `+${getPlainNumberredValue(value)}`
}

function valueIsNice(value) {
  const maxRussianPhoneLength = 11
  const maxBelorussianPhoneLength = 12
  const numbers = getPlainNumberredValue(value)
  const isBelorussianPhone = numbers.startsWith('375')
  if (isBelorussianPhone) return numbers.length <= maxBelorussianPhoneLength
  return numbers.length <= maxRussianPhoneLength
}

let state = {
  value: '',
  requestedPhone: false,
}

class PhoneInput extends React.Component {
  static propTypes = {
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    shouldRequestPhone: PropTypes.bool,
    onPhoneRequest: PropTypes.func,
  }

  static defaultProps = {
    placeholder: '',
    className: '',
    shouldRequestPhone: false,
    onPhoneRequest: () => {},
  }

  constructor(props) {
    super(props)
    this.state = state
  }

  componentDidMount() {
    this.setState(state)
  }

  componentWillUnmount() {
    ;({ state } = this)
  }

  onChange({ target }) {
    this.changeValue(target.value)
  }

  async onClick() {
    const { shouldRequestPhone, onPhoneRequest } = this.props
    if (shouldRequestPhone) {
      if (onPhoneRequest) onPhoneRequest()
      const { phone_number: phoneNumber } = await getPhoneInfo()
      this.changeValue(`+${phoneNumber}`)
    }
  }

  changeValue(value) {
    const { onChange } = this.props
    if (valueIsNice(value)) {
      const formattedValue = format(value)
      this.setState({ value: formattedValue })
      onChange(getPlainNumberredValueWithPlus(value))
    }
  }

  render() {
    const { className, placeholder } = this.props
    const { value } = this.state
    return (
      <Input
        type="tel"
        placeholder={format(placeholder)}
        onChange={(e) => this.onChange(e)}
        value={value}
        className={className}
        onClick={(e) => this.onClick(e)}
      />
    )
  }
}

export default PhoneInput
