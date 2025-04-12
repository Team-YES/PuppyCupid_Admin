import clsx from "clsx";
import { TitleCompoStyled } from "./styled";
import { Button } from "antd";

interface TitleProps {
  title: string;
  button?: string;
}

// 대시보드
const TitleCompo = ({ title, button }: TitleProps) => {
  return (
    <TitleCompoStyled className={clsx("title-compo")}>
      {title} {button ? <Button>{button}</Button> : <></>}
    </TitleCompoStyled>
  );
};

export default TitleCompo;
