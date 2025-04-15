import { BlackListStyled } from "./styled";

interface TitleProps {
  title: string;
  button?: string;
}

const BlackListComp = ({ title, button }: TitleProps) => {
  return (
    <BlackListStyled>
      {/* 타이틀 */}
      <div className="global_title">{title}</div>

      <div>블랙리스트 컴포임</div>
    </BlackListStyled>
  );
};

export default BlackListComp;
