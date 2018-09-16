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
import {HeaderWithBackButton} from '../helpers/HeaderWithBackButton'
import './SendRequestView.css'
import {PhoneInput} from '../helpers/PhoneInput'
import {getInfoFromVKConnect, getUserInfo} from '../helpers/helpers'
import axios from 'axios'

let state = {
    name: '',
    phone: '',
    phoneNotValid: false,
    popout: null
}

function removePlus(phone) {
    return phone.replace(/[^0-9]/g, '')
}

function formIsValid(phone) {
    return Boolean(removePlus(phone))
}

function getPhoneInfo() {
    return getInfoFromVKConnect('VKWebAppGetPhoneNumber')
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
        <Button
            className={'centered'}
            onClick={() => this.sendAutomaticRequest()}
        >
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
        if (formIsValid(phone)) {
            this.showSpinner()
            await this.sendRequest(name, phone)
            this.showFormSentAlert()
        } else {
            this.setState({phoneNotValid: true})
        }
    }

    showAlert(header, text) {
        this.setState({
            popout: this.getAlert(header, text)
        })
    }

    showFormSentAlert() {
        this.showAlert(
            'Спасибо!',
            'Наш менеджер свяжется с вами в ближайшее время'
        )
    }

    getAlert(header, text) {
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
                <h2>{header}</h2>
                <p>{text}</p>
            </Alert>
        )
    }

    showSpinner() {
        this.setState({popout: <ScreenSpinner />})
    }

    async sendAutomaticRequest() {
        const [{first_name: name}, {phone_number: phone}] = await Promise.all([
            getUserInfo(),
            getPhoneInfo()
        ])
        this.showSpinner()
        try {
            await this.sendRequest(name, phone)
        } catch (err) {}
        this.showFormSentAlert()
    }

    getInput(text) {
        if (text === 'Выбрать') return ''
        else return text
    }

    sendRequest(name, phone) {
        const { model, modification, oldness } = this.getInput();
        const { works, materials } = this.getCalculationResults();
        return axios.get('https://dimadk.tk/request.php', {
            params: {
                model: model,
                modification: modification,
                oldness: oldness,
                works: works,
                materials: materials,
                name: name,
                phone: phone
            }
        })
    }

    getCalculationResults() {
        const works = window.JSON.stringify(window.calculationResults.works);
        const materials = window.JSON.stringify(window.calculationResults.materials);
        return { works, materials };
    }

    getInput() {
        const model = this.getInput(window.input.model.text);
        const modification = this.getInput(window.input.modification.text);
        const oldness = this.getInput(window.input.oldness.text);
        return { model, modification, oldness };
    }
}
