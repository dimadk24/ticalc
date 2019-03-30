import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, FormLayout, Group } from '@vkontakte/vkui'
import NameInput from '../helpers/NameInput/NameInput'
import { getInfoFromVKConnect } from '../helpers/helpers'
import PhoneInput from '../helpers/PhoneInput'

let state = {
  name: '',
  phone: '',
  phoneNotValid: false,
}

function getPhoneInfo() {
  return getInfoFromVKConnect('VKWebAppGetPhoneNumber')
}

function removePlus(phone) {
  return phone.replace(/[^0-91]/g, '')
}

function formIsValid(phone) {
  return Boolean(removePlus(phone))
}

class SendRequestForm extends Component {
  constructor(props) {
    super(props)
    const { initialName } = this.props
    this.state = { ...state, name: initialName }
    this.requestedPhone = false
  }

  componentDidMount() {
    this.setState(state)
  }

  componentWillUnmount() {
    ;({ state } = this)
  }

  async onPhoneInputClick() {
    if (!this.requestedPhone) {
      this.requestedPhone = true
      const { phone_number: phone } = await getPhoneInfo()
      this.setState({ phone })
    }
  }

  async validateAndShowErrorsAndSendForm() {
    const { sendRequest } = this.props
    const { name, phone } = this.state
    if (formIsValid(phone)) sendRequest(name, phone)
    else this.setState({ phoneNotValid: true })
  }

  render() {
    const { name, phone, phoneNotValid } = this.state

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
            value={phone}
            onChange={(value) => {
              this.setState({ phoneNotValid: false })
              return this.setState({ phone: value })
            }}
            onClick={() => this.onPhoneInputClick()}
            bottom={phoneNotValid ? 'Неверный телефон' : ''}
            status={phoneNotValid ? 'error' : 'default'}
          />
          <Button
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
