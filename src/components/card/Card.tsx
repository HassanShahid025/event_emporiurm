import "./card.scss";

export const Card = ({children,cardClass}:any) => {
  return (
    <div className={`card ${cardClass}`}>{children}</div>
  )
};
