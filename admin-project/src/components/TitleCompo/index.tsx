import clsx from "clsx";
import { TitleCompoStyled } from "./stlyed";
import { Button } from "antd";

interface TitleProps {
  title: string;
  button?: string;
}

const TitleCompo = ({ title, button }: TitleProps) => {
  return (
    <TitleCompoStyled className={clsx("title-compo")}>
      {title} {button ? <Button>{button}</Button> : <></>}
    </TitleCompoStyled>
  );
};

export default TitleCompo;
