import {View, Panel, Group, Cell, Button} from '@vkontakte/vkui'
import React from 'react'
import {HeaderWithBackButton} from './../helpers/HeaderWithBackButton'
import PropTypes from 'prop-types'
import './ThankYouView.css'

class ThankYouView extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        onBack: PropTypes.func.isRequired
    }

    render() {
        return (
            <View id={this.props.id} activePanel={`${this.props.id}main`}>
                <Panel id={`${this.props.id}main`}>
                    <HeaderWithBackButton
                        onBackButtonClick={() => this.props.onBack()}
                        text={'Спасибо'}
                    />
                    <Group>
                        <Cell multiline>
                            <div>Спасибо!</div>
                            <div>
                                Наш менеджер свяжется с Вами в ближайшее время.
                            </div>
                        </Cell>
                        <Cell multiline>
                            <span>
                                А пока зайдите в наше сообщество ВКонтакте:
                            </span>
                            <a href="//vk.com/ya.service.nissan" className={"not-link"}>
                                <Button stretched size={'xl'}>
                                    Перейти
                                </Button>
                            </a>
                        </Cell>
                    </Group>
                </Panel>
            </View>
        )
    }
}

export {ThankYouView}
