import React from 'react';
import {chunk, merge} from 'lodash';
import PropTypes from 'prop-types';
import './index.css';

class WindowItem extends React.Component {
  componentDidMount() {
    // let img = document.querySelector(`#window-${this.props.windowId}`);
    // img.src = 'data:image/png;base64,'+this.props.image;
  }

  render() {
    const className = this.props.active ? 'screen-item active' : 'screen-item';
    let name = this.props.name || 'No Title';
    name = name.length > 15 ? `${name.substring(0, 15)}...` : name;
    return (
      <div className={className}>
        <div className="screen-image">
          <div className="content" style={{backgroundImage: `url(data:image/png;base64,${this.props.image})`}}>
          </div>
        </div>
        <div className="screen-meta">{name}</div>
      </div>
    );
  }
}

WindowItem.propTypes = {
  windowId: PropTypes.number,
  name: PropTypes.string,
  ownerName: PropTypes.string,
  active: PropTypes.bool,
  // bmpWidth: PropTypes.number,
  // bmpHeight: PropTypes.number,
  image: PropTypes.string
}

class WindowPicker extends React.Component {
  state = {
    currentWindowId: -1,
  }

  handleSelect = windowId => {
    this.setState({
      currentWindowId: windowId
    });
  }

  handleSubmit = () => {
    this.props.onSubmit && this.props.onSubmit(this.state.currentWindowId);
  }

  handleCancel = () => {
    this.props.onCancel && this.props.onCancel();
  }

  render() {
    let chunkList = chunk(this.props.windowList, 1);
    const content = chunkList.map((chunk, index) => {
      return (
        chunk.map(item => (
          <div
            style={{
              width: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            key={item.windowId}
            onDoubleClick={() => this.handleSubmit(item.windowId)}
            onClick={() => this.handleSelect(item.windowId)}
            span={8}><WindowItem active={item.windowId === this.state.currentWindowId} {...item}/>
          </div>
        ))
      )
    })

    return (
      <div className="window-picker-mask">
        <div className='window-picker' style={this.props.style || {}}>
          <div className='header'>
            <div className="title">请选择需要共享的内容</div>
          </div>
          <div className='screen-container'>
            {content}
          </div>
        </div>
      </div>

    )
  }
}

WindowPicker.propTypes = {
  windowList: PropTypes.array,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
}

export default WindowPicker;