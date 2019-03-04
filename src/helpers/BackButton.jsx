import React from 'react'
import {IOS, platform} from '@vkontakte/vkui/'
import Icon24Back from '@vkontakte/icons/dist/24/back'
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back'

class BackButton extends React.Component {
  constructor(props) {
    super(props)
    this.osname = platform()
  }

  render() {
    if (this.osname === IOS) return <Icon28ChevronBack />
    return <Icon24Back />
  }
}

export default BackButton
