import React from 'react';
import DotContainer from '../dotContainer/dotContainer.jsx';
import './tile.css';

function Tile ({draggable, index, rightSideNum, leftSideNum, direction, onTileStartDragging, isVisible=false, shouldGlow=false, leftDominoText="", rightDominoText=""}) {
  return (
    <div aba={index} className={'tile'}
         direction={direction}
         glow={shouldGlow ? "true" : "false"}
         visible={isVisible ? "true" : "false"}
         onMouseDown={() => {
           draggable && onTileStartDragging({rightSideNum, leftSideNum, index, leftDominoText, rightDominoText});
         }}
         draggable={draggable}
    >
      <DotContainer dominoText={leftDominoText} dotsNumber={leftSideNum}/>
      <hr/>
      <DotContainer dominoText={rightDominoText} dotsNumber={rightSideNum}/>
    </div>
  );
}

export default Tile;