import React, { Component } from 'react';
import Timer from '../timer/timer.jsx';
import './gameDetails.css';

class GameDetails extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <div className='game-details'>
        <div className='mode-status'>
          {this.props.isViewMode ? `Modo de Visualização` : `Modo de Jogo`}
        </div>
        <div className='game-moves'>
          {`Movimentos: ${this.props.gameState.turnCount}/${this.props.totalTurnCount}`}
        </div>
        <div className='tiles-on-board'>
          {`Dominós: ${this.props.usedTiles}/28`}
        </div>
        <div className='emptyDiv'/>
        <button className='history-back' onClick={() => this.props.goBackHistory()}
                disabled={this.props.shouldDisableBackward}>
          {this.props.isViewMode ? `Anterior` : `Desfazer`}
        </button>
        <button className='history-forward' onClick={() => this.props.goForwardHistory()}
                disabled={this.props.shouldDisableForward}
                style={{visibility: this.props.isViewMode ? 'visible'  : 'hidden'}}>
          {`Próximo`}
        </button>
        <div className='game-reset'>
          <button className='game-reset-btn' onClick={() => this.props.resetGame()}>
            {this.props.isViewMode ? `Novo Jogo` : `Reiniciar Jogo`}
          </button>
        </div>
        <div className='emptyDiv'/>
        <Timer secondsElapsed={this.props.secondsElapsed}/>
      </div>
    );
  }
}

export default GameDetails;