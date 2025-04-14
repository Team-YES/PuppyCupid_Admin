import clsx from "clsx";
import { TitleCompoStyled } from "./styled";
import { Button } from "antd";
import ExampleChart from "@/components/InquiryChart";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getAdminInquiries, Inquiry } from "@/reducers/getAdminInquiries";
import { useEffect, useState } from "react";

interface TitleProps {
  title: string;
  button?: string;
}

// 대시보드
const TitleCompo = ({ title, button }: TitleProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // 최초 마운트 시 데이터 불러오기
  useEffect(() => {
    dispatch(getAdminInquiries());
  }, [dispatch]);

  // 조회
  const inquiryData = useSelector(
    (state: RootState) => state.adminInquiries.inquiries
  );

  // 데이터 저장
  const [info, setInfo] = useState<Inquiry[]>([]);

  console.log("대시보드 문의정보", info);

  useEffect(() => {
    setInfo(inquiryData); // Redux 데이터 → 로컬 상태 복사
  }, [inquiryData]);

  return (
    <TitleCompoStyled className={clsx("title-compo")}>
      <div className="global_title">
        {title} {button ? <Button>{button}</Button> : <></>}
      </div>
      <div>
        <ExampleChart info={info} />
      </div>
    </TitleCompoStyled>
  );
};

export default TitleCompo;
