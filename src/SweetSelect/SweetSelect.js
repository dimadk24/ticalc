import React from 'react'
import {Cell, Div, List, Panel, Search} from '@vkontakte/vkui'
import PropTypes from 'prop-types'
import {HeaderWithBackButton} from '../helpers/HeaderWithBackButton'

class SweetSelect extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        backClickHandler: PropTypes.func,
        header: PropTypes.node,
        items: PropTypes.arrayOf(
            PropTypes.exact({
                id: PropTypes.number.isRequired,
                value: PropTypes.string.isRequired
            })
        ).isRequired,
        onSelect: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {searchText: ''}
    }

    onSearchChange(text) {
        this.setState({searchText: text})
    }

    get items() {
        const searchText = this.state.searchText.toLocaleLowerCase()
        return this.props.items.filter(
            ({value}) => value.toLocaleLowerCase().indexOf(searchText) !== -1
        )
    }

    notFoundComponent = (
        <Div style={{textAlign: 'center'}}>
            <p>Не найдено</p>
        </Div>
    )

    render() {
        return (
            <Panel id={this.props.id}>
                <HeaderWithBackButton
                    onBackButtonClick={() => this.props.backClickHandler()}
                    text={this.props.header}
                    panelHeaderProps={{noShadow: true}}
                />
                <Search onChange={this.onSearchChange.bind(this)} />
                {this.items.length > 0 && (
                    <List>
                        {this.items.map((item) => (
                            <Cell
                                key={item.id}
                                onClick={() => {
                                    this.props.backClickHandler()
                                    this.props.onSelect(item)
                                }}
                            >
                                {item.value}
                            </Cell>
                        ))}
                    </List>
                )}
                {!this.items.length && this.notFoundComponent}
            </Panel>
        )
    }
}

export default SweetSelect
