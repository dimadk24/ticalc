import React from 'react'
import { Cell, Div, List, Panel, Search } from '@vkontakte/vkui'
import PropTypes from 'prop-types'
import PanelHeader from '../helpers/PanelHeader'

function normalizeSearchValue(text, { shouldLowerCase, shouldTrimBoth }) {
  let normalizedText
  if (shouldTrimBoth) normalizedText = text.trim()
  else normalizedText = text.trimLeft()
  if (shouldLowerCase) normalizedText = normalizedText.toLowerCase()
  return normalizedText
}

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
    const normalizedText = normalizeSearchValue(text, {
      shouldLowerCase: false,
    })
    this.setState({ searchText: normalizedText })
  }

  get items() {
    const { searchText } = this.state
    const { items } = this.props
    const normalizedSearchText = normalizeSearchValue(searchText, {
      shouldLowerCase: true,
      shouldTrimBoth: true,
    })
    return items.filter(({ value }) =>
      normalizeSearchValue(value, {
        shouldLowerCase: true,
        shouldTrimBoth: true,
      }).includes(normalizedSearchText)
    )
  }

  render() {
    const { searchText } = this.state
    const { id: panelId, backClickHandler, header, onSelect } = this.props
    return (
      <Panel id={panelId}>
        <PanelHeader
          onBackButtonClick={() => backClickHandler()}
          text={header}
          panelHeaderProps={{ noShadow: true }}
        />
        <Search
          onChange={(value) => this.onSearchChange(value)}
          value={searchText}
          maxLength={35}
        />
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
