import React, { PureComponent } from 'react';
import './dotContainer.css'


const MAX_DOTS = 9;

/*
Number: 3
Indices: 0, 4, 8
-------------
| X |   |   |
-------------
|   | X |   |
-------------
|   |   | X |
-------------
*/



class DotContainer extends PureComponent {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const extraAttrs = {['dots-number']: this.props.dotsNumber};

    return (  
      <div className='dot-container' {...extraAttrs}>{this.props.dominoText}</div>
    );
  }
}

export default DotContainer;
