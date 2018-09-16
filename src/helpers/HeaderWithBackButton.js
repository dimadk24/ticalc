import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {HeaderButton, PanelHeader} from '@vkontakte/vkui'
import BackButton from './BackButton'

export class HeaderWithBackButton extends Component {
    static propTypes = {
        onBackButtonClick: PropTypes.func.isRequired,
        text: PropTypes.string.isRequired,
        panelHeaderProps: PropTypes.object
    }

    render() {
        return (
            <PanelHeader
                {...this.props.panelHeaderProps}
                left={
                    <HeaderButton onClick={this.props.onBackButtonClick}>
                        <BackButton />
                    </HeaderButton>
                }
            >
                {this.props.text}
            </PanelHeader>
        )
    }
}
