import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Cell} from '@vkontakte/vkui'
import './indicators.css'

class MoneyIndicator extends Component {
    static propTypes = {
        text: PropTypes.string,
        value: PropTypes.number,
        additionalClassesAsStr: PropTypes.string
    }

    render() {
        return (
            <Cell
                indicator={this.props.value + ' руб'}
                className={`info + ${this.props.additionalClassesAsStr}`}
            >
                {this.props.text}
            </Cell>
        )
    }
}

class SummaryMoneyIndicator extends Component {
    static propTypes = {
        text: PropTypes.string,
        value: PropTypes.number
    }

    render() {
        return (
            <MoneyIndicator
                text={this.props.text}
                value={this.props.value}
                additionalClassesAsStr={'summary'}
            />
        )
    }
}

export {MoneyIndicator, SummaryMoneyIndicator}