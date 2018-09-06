import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
    Alert,
    Button,
    Cell,
    Div,
    Group,
    Input,
    Panel,
    ScreenSpinner,
    View
} from '@vkontakte/vkui'
import VKLogo from '@vkontakte/icons/dist/24/logo_vk'
import {HeaderWithBackButton} from './HeaderWithBackButton'
import './SendRequestView.css'
import {PhoneInput} from './PhoneInput'

let state = {
    name: '',
    phone: '',
    phoneNotValid: false,
    popout: null
}

export class SendRequestView extends Component {
    static propTypes = {onBack: PropTypes.func, id: PropTypes.string}

    constructor(props) {
        super(props)
        this.state = state
    }

    componentWillUnmount() {
        state = this.state
    }

    orComponent = (
        <Div className={'centered'}>
            <span>или</span>
        </Div>
    )

    vkConnectButton = (
        <Button className={'centered'}>
            <span className={'centered'}>
                <VKLogo />
                <span>Отправить заявку с данными профиля</span>
            </span>
        </Button>
    )

    sendButton = (
        <Button
            stretched
            size={'l'}
            onClick={() => this.validateAndShowErrorsAndSendForm()}
        >
            Отправить заявку
        </Button>
    )

    getPhoneComponent() {
        return (
            <div>
                <span>Телефон</span>
                <PhoneInput
                    placeholder={'+79211234567'}
                    value={this.state.phone}
                    onChange={(value) => {
                        this.setState({phoneNotValid: false})
                        return this.setState({phone: value})
                    }}
                />
                {this.state.phoneNotValid && (
                    <p className={'error-hint'}>Введите телефон</p>
                )}
            </div>
        )
    }

    getNameComponent() {
        return (
            <div>
                <span>Имя</span>
                <Input
                    type={'text'}
                    placeholder={'Иван'}
                    value={this.state.name}
                    onChange={(e) => this.setState({name: e.target.value})}
                />
            </div>
        )
    }

    getManualForm() {
        return (
            <Div>
                <Cell>{this.getNameComponent()}</Cell>
                <Cell>{this.getPhoneComponent()}</Cell>
                <Cell>{this.sendButton}</Cell>
            </Div>
        )
    }

    automaticButton = (
        <Div className={'centered'} style={{flexDirection: 'column'}}>
            {this.vkConnectButton}
        </Div>
    )

    panelHeader = (
        <HeaderWithBackButton
            onBackButtonClick={this.props.onBack}
            text={'Отправить заявку'}
        />
    )

    getForm() {
        return (
            <Group>
                {this.automaticButton}
                {this.orComponent}
                {this.getManualForm()}
            </Group>
        )
    }

    render() {
        return (
            <View
                id={this.props.id}
                activePanel={this.props.id + 'main'}
                header
                popout={this.state.popout}
            >
                <Panel id={this.props.id + 'main'}>
                    {this.panelHeader}
                    {this.getForm()}
                </Panel>
            </View>
        )
    }

    async validateAndShowErrorsAndSendForm() {
        const {name, phone} = this.state
        if (this.formIsValid()) {
            this.showSpinner()
            await this.sendRequest(name, phone)
            this.showFormSentAlert()
        } else {
            this.setState({phoneNotValid: true})
        }
    }

    sendRequest(name, phone) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(name)
                console.log(phone)
                resolve()
            }, 1000)
        })
    }

    showFormSentAlert() {
        this.setState({
            popout: this.getAlert()
        })
    }

    getAlert() {
        return (
            <Alert
                actions={[
                    {
                        title: 'OK',
                        autoclose: true,
                        style: 'primary'
                    }
                ]}
                onClose={() => this.setState({popout: null})}
            >
                <h2>Отправлено!</h2>
                <p>Мы свяжемся с вами в течении часа</p>
            </Alert>
        )
    }

    formIsValid() {
        return Boolean(this.removePlus(this.state.phone))
    }

    removePlus(phone) {
        return phone.replace(/[^0-9]/g, '')
    }

    showSpinner() {
        this.setState({popout: <ScreenSpinner />})
    }
}
