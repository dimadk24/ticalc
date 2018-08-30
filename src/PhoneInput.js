import React from 'react'
import {Input} from '@vkontakte/vkui'
import {AsYouType} from 'libphonenumber-js'
import PropTypes from 'prop-types'

class PhoneInput extends React.Component {
    static propTypes = {
        placeholder: PropTypes.string,
        value: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        className: PropTypes.string
    }

    constructor(props) {
        super(props)
        const value = this.props.value || ''
        this.state = {value: value}
    }

    onChange(e) {
        const value = e.target.value
        if (this.valueIsNice(value)) {
            const formattedValue = this.format(value)
            if (this.shouldChangeToFormatted(formattedValue, value)) {
                this.setState({value: formattedValue})
                this.props.onChange(this.getPlainNumberredValueWithPlus(value))
            } else this.setState({value: value})
        }
    }

    shouldChangeToFormatted(formattedValue, value) {
        return !(
            formattedValue.length === this.state.value.length &&
            value.length < formattedValue.length
        )
    }

    getPlainNumberredValue(value) {
        return value.replace(/[^0-9]/g, '')
    }

    format(string) {
        const formater = new AsYouType('RU')
        return formater.input(string)
    }

    render() {
        return (
            <Input
                type={'tel'}
                placeholder={this.format(this.props.placeholder)}
                onChange={(e) => this.onChange(e)}
                value={this.state.value}
                className={this.props.className}
            />
        )
    }

    valueIsNice(value) {
        return this.getPlainNumberredValue(value).length <= 12
    }

    getPlainNumberredValueWithPlus(value) {
        return '+' + this.getPlainNumberredValue(value)
    }

    isDigitOrPlus(text) {
        return '+1234567890'.includes(text)
    }
}

export {PhoneInput}
