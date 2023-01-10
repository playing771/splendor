import { Card, ICardProps } from '.';

interface IProps extends ICardProps {
  onBuyClick: (cardId: string) => void;
  onHoldClick: (cardId: string) => void;
}

export const CardWithActions = ({ onBuyClick, onHoldClick, ...props }: IProps) => {

  const onBuyClickHandle = () => {
    onBuyClick(props.id)

  }
  const onHoldClickHandle = () => {
    onHoldClick(props.id)
  }

  return <Card {...props}>
    <button onClick={onBuyClickHandle}>Buy</button>
    <button onClick={onHoldClickHandle}>Hold</button>
  </Card>
};
