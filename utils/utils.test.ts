import { EGemColor } from '../interfaces/gem';
import { createPlayerGems, getGemsDiff } from './cost';

describe('utilities functionality', () => {
  it('getGemsDiff', () => {
    expect(
      getGemsDiff(
        {
          [EGemColor.Black]: 1,
          [EGemColor.Red]: 2,
          [EGemColor.Green]: 3,
        },
        createPlayerGems(2, 2, 1, 1, 1, 2)
      )
    ).toEqual({
      gems: {
        [EGemColor.Gold]: 2,
        [EGemColor.Red]: 0,
        [EGemColor.Blue]: 1,
        [EGemColor.White]: 1,
        [EGemColor.Black]: 0,
        [EGemColor.Green]: -1
      },
      hasDiff: false
    });
  });
});
