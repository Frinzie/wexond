import Component from 'inferno-component'

import { observer } from 'inferno-mobx'
import Store from '../../store'

import MenuItem from '../MenuItem'

@observer
export default class Menu extends Component {
  constructor () {
    super()

    this.state = {
      marginTop: 0,
      opacity: 0,
      height: 0,
      left: 0,
      top: 0,
      pointerEvents: false,
      items: []
    }

    this.items = []
  }

  addItem = (item) => {
    this.items.push(item)
  }

  show = () => {
    // Remove height transition to quickly set height to 0.
    this.menu.style.transition = '0.27s margin-top, 0.2s opacity'
    this.setState({height: 0})

    // Store the new calculated height,
    // to help with calculating new position of menu.
    this.newHeight = this.menu.scrollHeight

    // Need to use little timeout
    // for setting height and transitions.
    setTimeout(() => {
      // Revert height transition.
      this.menu.style.transition = '0.3s max-height, 0.27s margin-top, 0.2s opacity'
      this.setState({
        marginTop: 0,
        opacity: 1,
        height: this.newHeight,
        pointerEvents: true
      })
    }, 10)
  }

  hide = () => {
    this.setState({
      marginTop: -20,
      opacity: 0,
      pointerEvents: false
    })
  }

  render () {
    const {
      height,
      marginTop,
      opacity,
      left,
      top,
      items,
      pointerEvents
    } = this.state

    const menuStyle = {
      maxHeight: height,
      marginTop: marginTop,
      opacity: opacity,
      left: left,
      top: top,
      pointerEvents: (pointerEvents) ? 'auto' : 'none'
    }

    const onMouseDown = (e) => {
      e.stopPropagation()
    }

    const menuEvents = {
      onMouseDown: onMouseDown
    }

    return (
      <div {...menuEvents} className='menu' style={menuStyle} ref={(r) => { this.menu = r }}>
        {this.props.children}  
        <div className='items'>
          {
            items.map((data, key) => {
              // Default values for an item.
              if (data.visible == null) data.visible = true
              if (data.type == null) data.type = 'item'

              if (data.type === 'separator') {
                const separatorStyle = {
                  display: (data.visible) ? 'block' : 'none'
                }

                return <div style={separatorStyle} key={key} className='separator' />
              } else if (data.type === 'item') {
                const methodsToPass = {
                  onClick: data.onClick,
                  addItem: this.addItem,
                  hide: this.hide
                }

                return (
                  <MenuItem enabled={data.enabled} visible={data.visible} key={key} {...methodsToPass}>
                    {data.title}
                  </MenuItem>
                )
              }
            })
          }
        </div>
      </div>
    )
  }
}
