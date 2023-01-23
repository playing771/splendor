import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ICardShape, TCardCost } from '../../interfaces/card';
import { EDeckLevel } from '../../interfaces/devDeck';
import { EGemColor } from '../../interfaces/gem';
import { INobleShape } from '../../interfaces/noble';

const pathToCardsCSV = path.join('server', 'cards.csv');

export const getCardsFromCSV = () => {
  const cardsCSV = fs.readFileSync(pathToCardsCSV).toString();

  const cardsDTO: Array<{
    Level: string;
    Color: EGemColor;
    Score: string;
  } & Record<EGemColor,string>> = parse(cardsCSV, {
    columns: true,
    skip_empty_lines: true,
  });

  const cards: ICardShape[] = cardsDTO.map((dto, index) => ({
    id: `${dto.Level}_${dto.Color}_${dto.Score}_${index}`,
    color: EGemColor[dto.Color],
    cost: Object.values(EGemColor).reduce((acc, color) => {
      const price = Number.parseFloat(dto[color]) || 0;
      acc[color] = price;
      return acc;
    }, {} as TCardCost),
    score: Number.parseFloat(dto.Score),
    lvl:
      dto.Level === '1'
        ? EDeckLevel.First
        : dto.Level === '2'
        ? EDeckLevel.Second
        : EDeckLevel.Third,
  }));

  return cards;
};

const pathToNoblesCSV = path.join('server', 'nobles.csv');

export const getNoblesFromCSV = () => {
  const noblesCSV = fs.readFileSync(pathToNoblesCSV).toString();

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