import React from 'react'
import { Cell, Div, List, Panel, Search } from '@vkontakte/vkui'
import PropTypes from 'prop-types'
import HeaderWithBackButton from '../helpers/HeaderWithBackButton'

class SweetSelect extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    backClickHandler: PropTypes.func.isRequired,
    header: PropTypes.node.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.exact({
        id: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
    onSelect: PropTypes.func.isRequired,
  }

  notFoundComponent = (
    <Div style={{ textAlign: 'center' }}>
      <p>Не найдено</p>
    </Div>
  )

  constructor(props) {
    super(props)
    this.state = { searchText: '' }
  }

  onSearchChange(text) {
    this.setState({ searchText: text })
  }

  get items() {
    const { searchText } = this.state
    const { items } = this.props
    const lowerSearchText = searchText.toLocaleLowerCase()
    return items.filter(
      ({ value }) => value.toLocaleLowerCase().indexOf(lowerSearchText) !== -1
    )
  }

  render() {
    const { id: panelId, backClickHandler, header, onSelect } = this.props
    return (
      <Panel id={panelId}>
        <HeaderWithBackButton
          onBackButtonClick={() => backClickHandler()}
          text={header}
          panelHeaderProps={{ noShadow: true }}
        />
        <Search onChange={() => this.onSearchChange()} />
        {this.items.length > 0 && (
          <List>
            {this.items.map((item) => (
              <Cell
                key={item.id}
                onClick={() => {
                  backClickHandler()
                  onSelect(item)
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
