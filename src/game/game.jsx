import React, { Component } from 'react';
import Board from '../board/board.jsx';
import Player from '../player/player.jsx';
import GameDetails from '../gameDetails/gameDetails.jsx';
import Popup from '../popup/popup.jsx';
import {
  DIRECTIONS, MAX_TILE_DOT_NUMBER, INIT_PLAYER_TILES,
  BOARD_COLUMN_SIZE, BOARD_ROWS_SIZE, EMPTY_TILE, EMPTY_LEGAL_TILE, TICK_TIME_MILISECONDS
} from '../consts.js';
import './game.css';
import { MAX_PLAYER_HAND_TILES } from '../consts';

class Game extends Component {
  constructor (props) {
    super(props);
    const emptyBankTiles = this.initTilesBank();
    const initializedPlayers = [{name: 'Jogador 1', tiles: [], score: 0, drawsCount: 0, turnTimesSeconds: []}];
    const {bankTiles, players} = this.setPlayerInitTiles(initializedPlayers, emptyBankTiles);

    this.state = {
      turnCount: 0,
      cells: Array.from(Array(BOARD_COLUMN_SIZE * BOARD_ROWS_SIZE).keys()).map((index) => {
        return {...EMPTY_LEGAL_TILE, index};
      }),
      draggedTile: null,
      tilesOnBoard: [],
      bankTiles: bankTiles,
      players: players,
      stateHistory: [],
      stateHistoryIndex: -1,
      isGameEnded: false,
      isViewMode: false,
      isGameMode: true,
      timer: {isRunning: false, secondsElapsed: 0},
      lastTurnStartedTime: 0,
      isShowingPopup: false,
      textPopup: '',
    };

    this.getTileFromBank = this.getTileFromBank.bind(this);
    this.onTileStartDragging = this.onTileStartDragging.bind(this);
    this.onTileDropped = this.onTileDropped.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.goBackHistory = this.goBackHistory.bind(this);
    this.goForwardHistory = this.goForwardHistory.bind(this);
    this.timerInterval = setInterval(this.timerTick.bind(this), TICK_TIME_MILISECONDS);
    this.resetGame = this.resetGame.bind(this);
    this.closePopup = this.closePopup.bind(this);
  }

  componentDidMount () {
    window.scrollTo(500, 500); // scroll to center of screen
  }

  /**** Popup Handling ****/
  openPopup (text) {
    this.setState({isShowingPopup: true, textPopup: text});
  }

  closePopup () {
    this.setState({isShowingPopup: false, textPopup: ''});
  }

  /***********************/

  /**** Timer Handling ****/
  timerTick () {
    this.setState({timer: {...this.state.timer, secondsElapsed: this.state.timer.secondsElapsed + 1}});
  }

  timerReset () {
    this.timerStop();
    this.setState({timer: {isRunning: true, secondsElapsed: 0}});
    this.timerInterval = setInterval(this.timerTick.bind(this), TICK_TIME_MILISECONDS);
  }

  timerStop () {
    this.setState({timer: {...this.state.timer, isRunning: false}});
    clearInterval(this.timerInterval);
  }

  /***********************/

  /**** History ****/
  handleKeyDown (event) {
    let charCode = String.fromCharCode(event.which).toLowerCase();
    if ((event.ctrlKey || event.metaKey) && charCode === 'z') {
      this.goBackHistory();
    }
  }

  isHistoryEmpty () {
    return this.state.stateHistory.length === 0;
  }

  getUnusedTiles (player) {
    return player.tiles.filter((tile) => {return !tile.used;});
  }

  isAllowedToGetMoreTiles (player) {
    return this.getUnusedTiles(player).length < MAX_PLAYER_HAND_TILES;
  }

  goForwardHistory () {
    // We must be in View mode to go forward in history
    if (this.state.isViewMode) {
      // Make sure we have future history
      if (this.state.stateHistoryIndex < this.state.stateHistory.length - 1) {
        let newStateHistoryIndex = this.state.stateHistoryIndex + 1;
        this.setState({stateHistoryIndex: newStateHistoryIndex});
      }
    }
  }

  goBackHistory () {
    // Make sure we have some history to work with
    if (this.isHistoryEmpty()) {
      return;
    }
    // If we are in game mode, go back means Undo
    if (this.state.isGameMode) {
      // Get previous saved state
      let lastState = this.state.stateHistory.pop();
      // removing history and popup related items from new state
      delete lastState.stateHistory;
      delete lastState.textPopup;
      delete lastState.isShowingPopup;
      // Set as new state (while keeping our history safe)
      this.setState({...lastState});
    } else if (this.state.isViewMode) {
      // Otherwise, we are in View mode
      if (this.state.stateHistoryIndex > 0) {
        let newStateHistoryIndex = this.state.stateHistoryIndex - 1;
        this.setState({stateHistoryIndex: newStateHistoryIndex});
      } else {
        console.log(`Error: Ambigious mode! Check game state: ${this.state}`);
      }
    }
  }

  // Will update history with current state
  updateHistory () {
    // Create deepcopy of current state (TODO: find a better way to deepcopy)
    let newState = JSON.parse(JSON.stringify(this.state));
    // Get a copy of state history
    let clonedHistory = this.state.stateHistory.slice();
    // removing history and popup related items from new state and add new state to history
    delete newState.stateHistory;
    delete newState.textPopup;
    delete newState.isShowingPopup;
    clonedHistory.push(newState);
    // Update index to last state
    let newStateHistoryIndex = this.state.stateHistoryIndex + 1;

    // Update the new state history array
    this.setState({stateHistory: clonedHistory, stateHistoryIndex: newStateHistoryIndex});
  }

  /***********************/

  resetGame () {
    const emptyBankTiles = this.initTilesBank();
    const initializedPlayers = [{name: 'Jogador 1', tiles: [], score: 0, drawsCount: 0, turnTimesSeconds: []}];
    const {bankTiles, players} = this.setPlayerInitTiles(initializedPlayers, emptyBankTiles);

    this.setState({
      turnCount: 0,
      cells: Array.from(Array(BOARD_COLUMN_SIZE * BOARD_ROWS_SIZE).keys()).map((index) => {
        return {...EMPTY_LEGAL_TILE, index};
      }),
      draggedTile: null,
      tilesOnBoard: [],
      bankTiles: bankTiles,
      players: players,
      stateHistory: [],
      stateHistoryIndex: -1,
      isGameEnded: false,
      isViewMode: false,
      isGameMode: true,
      timer: {isRunning: false, secondsElapsed: 0},
      lastTurnStartedTime: 0,
      isShowingPopup: false,
      textPopup: '',
    });
    this.timerReset();
  }

  calculcatePlayerScore (indexPlayer) {
    const currentPlayer = this.state.players[indexPlayer];
    const currentPlayerTiles = currentPlayer.tiles;
    let playerSumPoints = 0;

    currentPlayerTiles.forEach((tile) => {
      if (tile.used)
        playerSumPoints += (tile.leftSideNum + this.rightSideNum);
    });

    return playerSumPoints;
  }

  turnEnded () {
    // Update turn count
    let currentTurnCount = this.state.turnCount + 1;

    // Update current player turn time
    const players = this.state.players;
    const currentPlayer = players[this.getCurrentPlayerIndex()];
    currentPlayer.turnTimesSeconds.push(this.state.timer.secondsElapsed - this.state.lastTurnStartedTime);

    // Update last turn started
    let newlastTurnStartedTime = this.state.timer.secondsElapsed;

    this.setState({players: players, turnCount: currentTurnCount, lastTurnStartedTime: newlastTurnStartedTime}, () => {
      // Then check if game has ended
      if (!this.checkGameEnded()) {
        // If game not ended, check that new current player can play (make a valid move)
        //  if he can't pass the turn
        const newCurrentPlayer = this.state.players[this.getCurrentPlayerIndex()];
        if (!this.isPlayerCanPlay(newCurrentPlayer)) {
          this.turnEnded();
        }
      }
    });

  }

  onTileStartDragging (draggedTile) {
    this.setState((_) => {
      return {draggedTile};
    });
  }

  getPlayerIndexWithMostScore () {
    let indexPlayer = 0;
    let maxScore = 0;
    this.state.players.forEach((player, i) => {
      if (player.score > maxScore) {
        indexPlayer = i;
      }
    });

    return indexPlayer;
  }

  isPlayerCanPlay (player) {
    // Check:
    //  - First drop (board is empty).
    //  - Player can draw from bank (bank isn't emtpy).
    //  - OR player has a legal move - can drop one of his unused tiles on the board.
    
    const {cells, tilesOnBoard, bankTiles} = this.state;

    // The board is empty, any cell is legal
    if (tilesOnBoard.length === 0) {
      return true;
    }
    // Check there are still some tiles in the bank
    if (bankTiles.length > 0) {
      return true;
    }
    // Go over all player's unused tiles and try to find a legal cell to drop in ==> Legal Drop
    const legalCells = this.state.cells.filter((cell) => {return cell.legal && !cell.tile;});
    const unusedPlayerTiles = this.getUnusedTiles(player);
    for (const unusedPlayerTile of unusedPlayerTiles) {
      for (const cell of legalCells) {
        if (this.isLegalDrop(cells, cell.index, unusedPlayerTile)) {
          return true;
        }
      }
    }
    // none of the options (first drop, draw from bank, legal drop)
    //  were available. Therefore, this player cannot make any valid move
    return false;
  }

  isExistsPlayerThatCanPlay () {
    for (let player of this.state.players) {
      if (this.isPlayerCanPlay(player)) {
        return true;
      }
    }
    return false;
  }

  checkGameEnded () {
    // Game ends when:
    //  - One of the player used all of his tiles --> the winner is the player who used all of his tiles first.
    //  - All players have no tile to drop        --> the winner is the player with the highest score.
    let winnerPlayer = null;

    // Get first player that used all of his tiles
    const playerWhoUsedAllTiles = this.state.players.filter((player) => {return this.getUnusedTiles(player).length === 0; })[0];
    const isExistsPlayerThatCanPlay = this.isExistsPlayerThatCanPlay();

    if (playerWhoUsedAllTiles || !isExistsPlayerThatCanPlay) {
      // If a player finished all tiles - he is the winner, else - if no player can play, then the winner is the one with the highest score.
      const playerWithHighestScore = this.state.players[this.getPlayerIndexWithMostScore()];
      winnerPlayer = playerWhoUsedAllTiles ? playerWhoUsedAllTiles : playerWithHighestScore;

      // Game ended, save current state and update flag
      let isGameEnded = true;
      let isViewMode = true;
      let isGameMode = false;
      this.timerStop();
      this.setState({isGameEnded: isGameEnded, isViewMode: isViewMode, isGameMode: isGameMode}, () => {
        // last move in the game must be kept
        this.updateHistory();
      });

      this.openPopup(`Jogo acabou! ${winnerPlayer.name} é o vencedor com um total de ${winnerPlayer.score} pontos!`);
      return true;
    }
    return false;
  }

  onTileDropped (droppedCellIndex, event) {
    if (this.state.isGameEnded) {
      this.openPopup('O jogo acabou, você não pode fazer mais movimentos!');
      return;
    }

    const indexCurrentPlayer = this.getCurrentPlayerIndex();
    const {cells, players, tilesOnBoard} = this.state;
    const {tiles} = players[indexCurrentPlayer];
    const {rightSideNum, leftSideNum, index, leftDominoText, rightDominoText} = this.state.draggedTile;

    const isFirstDropped = tilesOnBoard.length === 0;
    const isEqualNumbersTile = leftSideNum === rightSideNum;
    const droppedCellDirection = cells[droppedCellIndex].direction;
    const potentialDirection = isEqualNumbersTile && !isFirstDropped ? this.getOppositeDirection(droppedCellDirection) : droppedCellDirection;
    const newTile = {
      rightSideNum,
      leftSideNum,
      direction: potentialDirection,
      draggable: false,
      cellIndex: droppedCellIndex,
      isVisible: true,
      leftDominoText: leftDominoText,
      rightDominoText: rightDominoText
    };

    if (isFirstDropped || this.isLegalDrop(cells, droppedCellIndex, newTile)) {
      // Save current state, before any modifications
      this.updateHistory();
      this.checkToEnableScrolling(event);

      // Update score
      players[indexCurrentPlayer].score += (rightSideNum + leftSideNum);

      tilesOnBoard.push(newTile);
      cells[droppedCellIndex].tile = newTile;
      tiles[index].used = true;

      if (isFirstDropped) // all places are illegal
        this.initIllegalCells(cells);

      // this.moveAllTilesOnBoardRight(droppedCellIndex, cells, tilesOnBoard);

      this.setLegalCells(cells, tilesOnBoard);

      this.setState((_) => ({cells, players, tilesOnBoard}), () => {
        // End turn
        this.turnEnded();
      });
    }
  }

  isLegalDrop (cells, droppedCellIndex, newTile) {
    const {rightSideNum, leftSideNum, index, leftDominoText, rightDominoText} = this.state.draggedTile;

    let legal = this.checkAlDroppedSides(cells, droppedCellIndex, rightSideNum, leftSideNum);
    if (legal)
      return legal;
    legal = this.checkAlDroppedSides(cells, droppedCellIndex, leftSideNum, rightSideNum);

    if (legal) { // rotate tile
      newTile.rightSideNum = leftSideNum;
      newTile.leftSideNum = rightSideNum;
      newTile.rightDominoText = leftDominoText;
      newTile.leftDominoText = rightDominoText;

      return legal;
    }

    return false;
  }

  checkAlDroppedSides (cells, droppedCellIndex, rightSideNum, leftSideNum) {
    const upCell = cells[droppedCellIndex - BOARD_COLUMN_SIZE];
    const downCell = cells[droppedCellIndex + BOARD_COLUMN_SIZE];
    const leftCell = cells[droppedCellIndex - 1];
    const rightCell = cells[droppedCellIndex + 1];
    const upLegalDrop = !upCell || !upCell.tile || upCell.tile && leftSideNum === upCell.tile.rightSideNum;
    const downLegalDrop = !downCell || !downCell.tile || downCell.tile && rightSideNum === downCell.tile.leftSideNum;
    const leftLegalDrop = !leftCell || !leftCell.tile || leftCell.tile && leftSideNum === leftCell.tile.rightSideNum;
    const rightLegalDrop = !rightCell || !rightCell.tile || rightCell.tile && rightSideNum === rightCell.tile.leftSideNum;

    return upLegalDrop && downLegalDrop && leftLegalDrop && rightLegalDrop;
  }

  checkToEnableScrolling (event) {
    if (event.clientY < 250 || event.clientY > 500) {
      document.body.style['overflow-y'] = 'scroll';
    }

    if (event.clientX < 250 || event.clientX > 850) {
      document.body.style['overflow-x'] = 'scroll';
    }
  }

  initIllegalCells (cells) {
    const tilesOnBoard = this.state.tilesOnBoard.map((tile) => tile.cellIndex);
    cells.forEach((cell, i) => {
      if (!tilesOnBoard.includes(i)) {
        cell.legal = false;
        cell.direction = null;
      }
    });
  }

  setLegalCells (cells, tilesOnBoard) {
    tilesOnBoard.forEach((tile) => {
      const {rightSideNum, leftSideNum, cellIndex} = tile;
      const verticalCellJump = tile.direction === DIRECTIONS.vertical ? BOARD_COLUMN_SIZE : 1;
      const horizontalCellJump = tile.direction === DIRECTIONS.vertical ? 1 : BOARD_COLUMN_SIZE;
      const upCellIndex = cellIndex - verticalCellJump;
      const downCellIndex = cellIndex + verticalCellJump;
      const leftCellIndex = cellIndex - horizontalCellJump;
      const rightCellIndex = cellIndex + horizontalCellJump;
      const horizontalIndicesDirection = tile.direction === DIRECTIONS.vertical ? DIRECTIONS.horizontal : DIRECTIONS.vertical;
      const verticalIndicesDirection = tile.direction === DIRECTIONS.vertical ? DIRECTIONS.vertical : DIRECTIONS.horizontal;
      const horizontalIndices = [
        {
          index: leftCellIndex,
          direction: horizontalIndicesDirection
        }, {
          index: rightCellIndex,
          direction: horizontalIndicesDirection
        }
      ];

      let legalIndices = [
        {
          index: upCellIndex,
          direction: verticalIndicesDirection
        }, {
          index: downCellIndex,
          direction: verticalIndicesDirection
        }
      ];

      legalIndices = [...(rightSideNum === leftSideNum ? horizontalIndices : []), ...legalIndices];

      legalIndices.forEach((legal) => {
        if (cells[legal.index] && !cells[legal.index].tile) {
          cells[legal.index].legal = true;
          cells[legal.index].direction = legal.direction;
        }
      });
    });
  }

  getCurrentPlayerIndex () {
    return this.state.turnCount % this.state.players.length;
  }

  textForDots (dotsNumber) {
    switch(dotsNumber) {
      case 0:
        var caracteristicas = [
          'carboidrato',
          'músculos esqueléticos',
          'trabalho mecânico',
          'coração',
          'esportes',
          'glicose',
          'proteínas'
        ];
        return caracteristicas[Math.floor(Math.random() * caracteristicas.length)]
      case 1:
        var caracteristicas = [
          'respiração',
          'inspiração',
          'expiração',
          'pulmão',
          'estômatos',
          'brônqueos',
          'folha'
        ];
        return caracteristicas[Math.floor(Math.random() * caracteristicas.length)]
      case 2:
        var caracteristicas = [
          'hormônios',
          'auxina',
          'giberelina',
          'citocinina',
          'insulina',
          'prolactina',
          'adrenalina'
        ];
        return caracteristicas[Math.floor(Math.random() * caracteristicas.length)]
      case 3:
        var caracteristicas = [
          'célula animal',
          'célula vegetal',
          'citoplasma',
          'parede celular',
          'organelas',
          'ribossomos',
          'núcleo'
        ];
        return caracteristicas[Math.floor(Math.random() * caracteristicas.length)]
      case 4:
        var caracteristicas = [
          'tecido',
          'esclerêquima',
          'esqueleto',
          'cartilagem',
          'tendões',
          'orgãos'
        ];
        return caracteristicas[Math.floor(Math.random() * caracteristicas.length)]
      case 5:
        var caracteristicas = [
          'útero',
          'assexuada',
          'embrião',
          'feto',
          'sexuada',
          'gametas'
        ];
        return caracteristicas[Math.floor(Math.random() * caracteristicas.length)]
      case 6:
        var caracteristicas = [
          'xilema',
          'floema',
          'seiva bruta',
          'seiva elaborada',
          'intestino delgado',
          'transporte pelo sangue'
        ];
        return caracteristicas[Math.floor(Math.random() * caracteristicas.length)]
      default:
        return "   ";
    }
  }

  textForBombPiece (dotsNumber) {
    switch(dotsNumber) {
      case 0:
        return "Transporte de nutrientes e gases"
      case 1:
        return "Respiração e transpiração"
      case 2:
        return "Hormônios"
      case 3:
        return "Células"
      case 4:
        return "Sustentação"
      case 5:
        return "Reprodução (sistema genital)"
      case 6:
        return "Produção e consumo de energia"
      default:
        return "   ";
    }
  }

  popRandomTile (tilesArr, setVisible = true) {
    if (tilesArr.length > 0) {
      const randomIndex = Math.floor(Math.random() * tilesArr.length);
      let tile = tilesArr.splice(randomIndex, 1)[0];
      if (setVisible)
        tile.isVisible = true;
      return tile;
    } else {
      this.openPopup('Acabaram as peças de Dominó =(');
      return null;
    }
  }

  initTilesBank () {
    const bankTiles = [];
    for (let i = 0; i <= MAX_TILE_DOT_NUMBER; i++) {
      for (let j = i; j <= MAX_TILE_DOT_NUMBER; j++) {
        if (i == j) {
          var bombPieceText = this.textForBombPiece(i);
          bankTiles.push({rightSideNum: i, leftSideNum: j, rightDominoText: bombPieceText, leftDominoText: bombPieceText, used: false, isVisible: false},);
        } else {
          bankTiles.push({rightSideNum: i, leftSideNum: j, rightDominoText: this.textForDots(i), leftDominoText: this.textForDots(j), used: false, isVisible: false},);
        }
      }
    }
    return bankTiles;
  }

  getTileFromBank () {
    if (this.state.isGameEnded) {
      this.openPopup('O jogo acabou pois as peças acabaram =(');
      return;
    }

    // Save current state, before any modifications
    this.updateHistory();

    const indexCurrentPlayer = this.getCurrentPlayerIndex();
    const {bankTiles, players} = this.state;
    const {tiles} = players[indexCurrentPlayer];

    // Push tile from bank to player's hand
    let newTile = this.popRandomTile(bankTiles);
    // Check first that we have a new tile
    if (newTile) {
      tiles.push(newTile);
      players[indexCurrentPlayer].drawsCount += 1;
      this.setState((prevState) => ({bankTiles, players}), () => {
        // End turn
        this.turnEnded();
      });
    }
  }

  setPlayerInitTiles (players, bankTiles) {
    players.forEach((_, i) => {
      const playerTiles = players[i].tiles;

      for (let i = 0; i < INIT_PLAYER_TILES; i++) {
        // Push tile from bank to player's hand
        playerTiles.push(this.popRandomTile(bankTiles));
      }
    });

    return {players, bankTiles};
  }

  getOppositeDirection (direction) {
    if (direction === DIRECTIONS.vertical)
      return DIRECTIONS.horizontal;
    return DIRECTIONS.vertical;
  }

  render () {
    // Actual game state
    let isActualViewMode = this.state.isViewMode;
    let isActualGameEnded = this.state.isGameEnded;
    let actualTurnCount = this.state.turnCount;
    let isHistoryEmpty = this.isHistoryEmpty();
    let shouldDisableBackward = isHistoryEmpty || (isActualViewMode && this.state.stateHistoryIndex == 0);
    let shouldDisableForward = !isActualViewMode || (isActualViewMode && this.state.stateHistoryIndex === this.state.stateHistory.length - 1);

    // Current state that we want to present to the user (to support the View Mode feature)
    let currentStateToShow = isActualViewMode ? this.state.stateHistory[this.state.stateHistoryIndex] : this.state;

    return (
      <>
        {
          this.state.isShowingPopup &&
          <Popup close={this.closePopup}>
            {this.state.textPopup}
          </Popup>
        }
        <div className='game' onKeyDown={this.handleKeyDown}>
          <GameDetails isViewMode={isActualViewMode}
                       gameState={currentStateToShow}
                       totalTurnCount={actualTurnCount}
                       shouldDisableBackward={shouldDisableBackward}
                       shouldDisableForward={shouldDisableForward}
                       goBackHistory={this.goBackHistory}
                       goForwardHistory={this.goForwardHistory}
                       resetGame={this.resetGame}
                       secondsElapsed={currentStateToShow.timer.secondsElapsed}
                       usedTiles={currentStateToShow.tilesOnBoard.length}/>
          <Board cells={currentStateToShow.cells} onTileDropped={this.onTileDropped} shouldGlow={isActualGameEnded}/>
          {
            currentStateToShow.players.map((player, i) => {
              return <Player key={`player-${i}`}
                             name={player.name} id={i}
                             tiles={player.tiles}
                             onTileStartDragging={this.onTileStartDragging}
                             score={player.score}
                             getTileFromBank={this.getTileFromBank}
                             drawsCount={player.drawsCount}
                             turnTimesSeconds={player.turnTimesSeconds}
                             isGameEnded={this.state.isGameEnded}
                             isAllowedToGetMoreTiles={this.isAllowedToGetMoreTiles(player)}/>;
            })
          }
        </div>
      </>
    );
  }
}

export default Game;