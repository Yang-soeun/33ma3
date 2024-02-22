import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import OptionType from "../../../components/post/OptionType";
import { IP } from "../../../constants/url";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import SubmitButton from "../../../components/button/SubmitButton";
import OfferModal from "./OfferModal";
import ResultModal from "./ResultModal";
import { CENTER_TYPE, MEMBER_TYPE } from "../../../constants/options";

const AverageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 55px;
`;

const TextContainer = styled.div`
  color: ${({ theme }) => theme.colors.text_strong};
  font-size: ${({ theme }) => theme.fontSize.medium};
  font-weight: 500;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BoldText = styled.p`
  color: ${(props) =>
    props.color === "red"
      ? props.theme.colors.text_red
      : props.theme.colors.text_strong};
  font-weight: 700;
`;

const Text = styled.div`
  display: flex;
  gap: 5px;
`;

function AuctionAverageStatus({ curAvgPrice, curOfferDetail, postId }) {
  const webSocket = useRef();
  const selectedMine = useRef();
  const [avgPrice, setAvgPrice] = useState(curAvgPrice);
  const [offerDetail, setOfferDetail] = useState(curOfferDetail);
  const { memberId, memberType } = useRouteLoaderData("root");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [endMessage, setEndMessage] = useState();
  const navigate = useNavigate();

  // TODO: 웹 소켓 연결
  useEffect(function () {
    function connectWebSocket() {
      webSocket.current = new WebSocket(
        `ws://${IP}/connect/post/${postId}/${memberId}`
      );

      webSocket.current.onopen = () => {
        console.log("WebSocket 연결! - 평균 버전");
      };

      webSocket.current.onclose = (event) => {
        console.log("close");
        console.log(event.code);
        if (event.code !== 4000 && event.code !== 1000) {
          console.log("재연결");
          setTimeout(connectWebSocket, 500);
        }
      };

      webSocket.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);
        if (data.message && data.message.startsWith("SELECT")) {
          setEndMessage(data);
        } else {
          setAvgPrice(JSON.parse(event.data).avgPrice);
        }
      };
    }

    connectWebSocket();

    return () => {
      if (webSocket.current.readyState === WebSocket.OPEN) {
        const closeMessage = {
          type: "post",
          roomId: postId,
          memberId: memberId,
        };
        webSocket.current.send(JSON.stringify(closeMessage));
        webSocket.current.close(4000, "close");
      }
    };
  }, []);

  // type 이 center인 경우 경매 참여하기 or 수정하기 버튼 보여주기
  // type 이 user인 경우 평균만 보여주기
  return (
    <>
      {isModalOpen && (
        <OfferModal
          postId={postId}
          handleClose={() => setIsModalOpen(false)}
          offerDetail={offerDetail}
          updateOfferDetail={setOfferDetail}
        />
      )}
      {endMessage && (
        <ResultModal
          handleClose={() => window.location.reload()}
          endMessage={endMessage}
        />
      )}
      <AverageContainer>
        {(Number(memberType) === MEMBER_TYPE || offerDetail) && (
          <OptionType title={"경매 현황"}>
            <TextContainer>
              {offerDetail && (
                <Text>
                  <p>내가 제시한 금액은 </p>
                  <BoldText className="show" key={Math.random()}>
                    {offerDetail.price}만원
                  </BoldText>
                  <p>입니다.</p>
                </Text>
              )}
              <Text>
                {avgPrice === 0 ? (
                  "아직 경매가 시작되지 않았습니다."
                ) : (
                  <>
                    <p>현재 제시 금액의 </p>
                    <BoldText color="red" className="show" key={Math.random()}>
                      평균가는 {avgPrice}만원
                    </BoldText>
                    <p>입니다. {offerDetail && "수정하시겠습니까?"}</p>
                  </>
                )}
              </Text>
            </TextContainer>
          </OptionType>
        )}
        {Number(memberType) === CENTER_TYPE &&
          (offerDetail ? (
            <SubmitButton onClick={() => setIsModalOpen(true)}>
              수정하기
            </SubmitButton>
          ) : (
            <SubmitButton onClick={() => setIsModalOpen(true)}>
              경매 참여하기
            </SubmitButton>
          ))}
      </AverageContainer>
    </>
  );
}

export default AuctionAverageStatus;
