import React, { PureComponent } from 'react';
import './player.css';
import imgAvatar from '../images/hipster.png';
import Tile from '../tile/tile.jsx';
import { DIRECTIONS, MAX_PLAYER_HAND_TILES } from '../consts';

class Player extends PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      id: props.id,
      name: props.name,
      score: props.score,
    };
  }

  render () {
    let turnTimesSeconds = this.props.turnTimesSeconds;
    let avgTurnTimeSeconds = turnTimesSeconds.length === 0 ? 0 : turnTimesSeconds.reduce((a, b) => a + b, 0) / turnTimesSeconds.length;
    
    return (
      <div className='player' data-id={this.state.id}>
        <div className='details'>
          <span className='title'>{this.state.name}</span>
          <span className='score'>{`Pontos: ${this.props.score}`}</span>
          <span className='draws'>{`Dominós Utilizados: ${this.props.drawsCount}`}</span>
          <span className='avg-turn'>{`Tempo médio: ${parseInt(avgTurnTimeSeconds)}`}</span>
          {/* <div className='avatar'>
            <img src={imgAvatar} draggable="false"/>
          </div> */}
          {!this.props.isGameEnded &&
          <button className='get-tile' onClick={() => this.props.getTileFromBank()}
                  disabled={!this.props.isAllowedToGetMoreTiles}>
            {`Pegar Dominó`}
          </button>}
        </div>
        <div className='hand-deck'>
          {
            this.props.tiles.map(
              (tile, index) =>
                tile && !tile.used &&
                <Tile
                  key={index}
                  index={index}
                  draggable
                  onTileStartDragging={this.props.onTileStartDragging}
                  rightSideNum={tile.rightSideNum}
                  leftSideNum={tile.leftSideNum}
                  rightDominoText={tile.rightDominoText}
                  leftDominoText={tile.leftDominoText}
                  direction={DIRECTIONS.vertical}
                  isVisible={tile.isVisible}
                />
            )
          }
        </div>
      </div>
    );
  }
}

export default Player;