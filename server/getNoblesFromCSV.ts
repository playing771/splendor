import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import { TCardCost } from '../interfaces/card';
import { EGemColor } from '../interfaces/gem';
import { INobleShape } from '../interfaces/noble';
import { v4 as uuidv4 } from 'uuid';

const pathToCSV = path.join('server', 'nobles.csv');

export const getNoblesFromCSV = () => {
  const noblesCSV = fs.readFileSync(pathToCSV).toString();

  const noblesDTO: Array<any> = parse(noblesCSV, {
    columns: false,
    skip_empty_lines: true,
  });

  const nobles: INobleShape[] = [];
  noblesDTO.forEach((nobleDto) => {
    
    const requirements: TCardCost = {};
    for (let index = 1; index < nobleDto.length; index += 2) {
      const color = nobleDto[index];
      if (!!color) {
        requirements[color as EGemColor] = Number(nobleDto[index + 1]);
      }
    }
    nobles.push({ requirements, score: Number(nobleDto[0]), id: uuidv4() });
  })
  
  return nobles;

};
