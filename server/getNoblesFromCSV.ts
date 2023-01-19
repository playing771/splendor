import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import { TCardCost } from '../interfaces/card';
import { INobleShape } from '../interfaces/noble';

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
    for (let index = 0; index < nobleDto.length; index += 2) {
      const color = nobleDto[index];
      if (!!color) {
        requirements[color] = Number(nobleDto[index + 1]);
      }
    }
    nobles.push({ requirements, score: 3 });
  })

  return nobles;

};
