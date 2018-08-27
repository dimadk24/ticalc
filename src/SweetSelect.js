import React from 'react'
import {
    HeaderButton,
    Panel,
    PanelHeader,
    Search,
    Cell,
    List,
    Div
} from '@vkontakte/vkui'
import BackButton from './BackButton'
import PropTypes from 'prop-types'

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

    render() {
        return (
            <Panel id={this.props.id}>
                <PanelHeader
                    noShadow={true}
                    left={
                        <HeaderButton
                            onClick={() => this.props.backClickHandler()}
                        >
                            <BackButton />
                        </HeaderButton>
                    }
                >
                    {this.props.header}
                </PanelHeader>
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
                {!this.items.length && (
                    <Div style={{textAlign: 'center'}}>
                        <p>Не найдено</p>
                    </Div>
                )}
            </Panel>
        )
    }
}

export default SweetSelect
