import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import { ICardShape, TCardCost } from '../../../interfaces/card';
import { EDeckLevel } from '../../../interfaces/devDeck';
import { ETokenColor } from '../../../interfaces/token';

const pathToCSV = path.join('server', 'cards.csv');

export const getCardsFromCSV = () => {
  const cardsCSV = fs.readFileSync(pathToCSV).toString();

  const cardsDTO: Array<{
    Level: string;
    Color: string;
    Score: string;
    Black: string;
    Blue: string;
    Green: string;
    Red: string;
    White: string;
  }> = parse(cardsCSV, {
    columns: true,
    skip_empty_lines: true,
  });

  const cards: ICardShape[] = cardsDTO.map((dto, index) => ({
    id: `${dto.Level}_${dto.Color}_${dto.Score}_${index}`,
    color: ETokenColor[dto.Color],
    cost: Object.values(ETokenColor).reduce((acc, color) => {
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
