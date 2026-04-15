import React from 'react';
import {chunk, merge} from 'lodash';
import PropTypes from 'prop-types';
import './index.css';

class DisplayItem extends React.Component {
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
          <img className="content" src={this.props.image} alt=""/>
        </div>
        <div className="screen-meta">{name}</div>
      </div>
    );
  }
}

DisplayItem.propTypes = {
  displayId: PropTypes.number,
  name: PropTypes.string,
  ownerName: PropTypes.string,
  active: PropTypes.bool,
  // bmpWidth: PropTypes.number,
  // bmpHeight: PropTypes.number,
  image: PropTypes.string
}

class DisplayPicker extends React.Component {
  state = {
    currentDisplayId: -1,
  }

  handleSelect = displayId => {
    this.setState({
      currentDisplayId: displayId
    });
  }

  handleSubmit = () => {
    this.props.onSubmit && this.props.onSubmit(this.state.currentDisplayId);
  }

  handleCancel = () => {
    this.props.onCancel && this.props.onCancel();
  }

  render() {
    let chunkList = chunk(this.props.displayList, 1);
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
            key={item.displayId}
            onDoubleClick={() => this.handleSubmit(item.displayId)}
            onClick={() => this.handleSelect(item.displayId)}
            span={8}><DisplayItem active={item.displayId === this.state.currentDisplayId} {...item}/>
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

DisplayPicker.propTypes = {
  displayList: PropTypes.array,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
}

export default DisplayPicker;