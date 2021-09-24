import React from 'react';
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
      return "transporte de nutrientes e gases - 0";
    case 1:
      return "respiração e transpiração - 1";
    case 2:
      return "hormônios - 2";
    case 3:
      return "células - 3";
    case 4:
      return "sustentação - 4";
    case 5:
      return "reprodução (sistema genital) - 5";
    case 6:
      return "produção e consumo de energia - 6";
    default:
      return "   ";
  }
}

const DotContainer = ({dotsNumber}) => {
  const extraAttrs = {['dots-number']: dotsNumber};

  return (
    <div className='dot-container' {...extraAttrs}>
      {
        textForDots(dotsNumber) 
      }
    </div>
  );
};

export default DotContainer;
