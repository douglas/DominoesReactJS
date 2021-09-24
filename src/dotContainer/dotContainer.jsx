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

class DotContainer extends PureComponent {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const extraAttrs = {['dots-number']: this.props.dotsNumber};

    return (  
      <div className='dot-container' {...extraAttrs}>
        {
          textForDots(this.props.dotsNumber) 
        }
      </div>
    );
  }
}

export default DotContainer;
