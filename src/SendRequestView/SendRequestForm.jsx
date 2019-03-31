import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, FormLayout, Group } from '@vkontakte/vkui'
import NameInput from '../helpers/NameInput/NameInput'
import PhoneInput from '../helpers/PhoneInput'

let state = {
  name: '',
  phone: '',
  phoneNotValid: false,
  shouldRequestPhone: true,
}

function removePlus(phone) {
  return phone.replace(/[^0-91]/g, '')
}

function formIsValid(phone) {
  const phoneNumbers = removePlus(phone)
  return phoneNumbers.length >= 7
}

class SendRequestForm extends Component {
  constructor(props) {
    super(props)
    const { initialName } = this.props
    this.state = { ...state, name: initialName }
  }

  componentDidMount() {
    this.setState({ ...state, shouldRequestPhone: true })
  }

  componentWillUnmount() {
    ;({ state } = this)
  }

  onPhoneRequest = () => {
    this.setState({ shouldRequestPhone: false })
  }

  async validateAndShowErrorsAndSendForm() {
    const { sendRequest } = this.props
    const { name, phone } = this.state
    if (formIsValid(phone)) sendRequest(name, phone)
    else this.setState({ phoneNotValid: true })
  }

  render() {
    const { name, phoneNotValid, shouldRequestPhone } = this.state
    return (
      <Group>
        <FormLayout>
          <NameInput
            top="Имя"
            onChange={(value) => this.setState({ name: value })}
            value={name}
          />
          <PhoneInput
            top="Телефон"
            placeholder="+79211234567"
            onChange={(value) => {
              this.setState({ phoneNotValid: false })
              return this.setState({ phone: value })
            }}
            bottom={phoneNotValid ? 'Неверный телефон' : ''}
            status={phoneNotValid ? 'error' : 'default'}
            shouldRequestPhone={shouldRequestPhone}
            onPhoneRequest={this.onPhoneRequest}
          />
          <Button
            level="commerce"
            size="xl"
            onClick={() => this.validateAndShowErrorsAndSendForm()}
          >
            Отправить заявку
          </Button>
        </FormLayout>
      </Group>
    )
  }
}

SendRequestForm.propTypes = {
  sendRequest: PropTypes.func.isRequired,
  initialName: PropTypes.string,
}

SendRequestForm.defaultProps = {
  initialName: '',
}

export default SendRequestForm
