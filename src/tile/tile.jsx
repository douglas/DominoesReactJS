import React from 'react';
import DotContainer from '../dotContainer/dotContainer.jsx';
import './tile.css';

function textForDots (dotsNumber) {
  switch(dotsNumber) {
    case 0:
      var caracteristicas = [
        'transporte de nutrientes e gases - 0',
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
        'respiração e transpiração - 1',
        'respiração',
        'inspiração',
        'expiração',
        'Pulmão',
        'estômatos',
        'brônqueos',
        'folha'
      ];
      return caracteristicas[Math.floor(Math.random() * caracteristicas.length)]
    case 2:
      var caracteristicas = [
        'hormônios - 2',
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
        'células - 3',
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
        'sustentação - 4',
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
        'reprodução (sistema genital) - 5',
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
        'produção e consumo de energia - 6',
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

function Tile ({draggable, index, rightSideNum, leftSideNum, direction, onTileStartDragging, isVisible=false, shouldGlow=false, leftDominoText="", rightDominoText=""}) {
  leftDominoText = leftDominoText || textForDots(leftSideNum);
  rightDominoText = rightDominoText || textForDots(rightSideNum);

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