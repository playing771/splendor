import { IGameStateDTO } from "../../../../../interfaces/api";
import { ETokenColor } from "../../../../../interfaces/token";

export const GameTableTokens = ({
  tokens,
}: {
  tokens: IGameStateDTO['state']['table']['tokens'];
}) => {
  const tokensList = Object.values(ETokenColor);
  return (
    <div className="GameTableTokens">
      {tokensList.map((color) => {
        return (
          <div
            key={color}
            className={`GameTableTokens_item GameTableTokens_item__${color}`}
          >
            {tokens[color]}
          </div>
        );
      })}
    </div>
  );
};