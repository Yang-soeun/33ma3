import React, { useState } from "react";
import styled from "styled-components";
import SubmitButton from "../button/SubmitButton";
import Logo from "../../assets/33MA3_logo.png";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { BASE_URL } from "../../constants/url";
import { useSearchParams } from "react-router-dom";
import { getMemberId } from "../../utils/auth";
import OfferSelectModal from "./OfferSelectModal";
import StarRating from "./StarRating";

const CommentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-size: ${(props) => props.theme.fontSize.regular};
  padding: 20px;
  border-radius: ${(props) => props.theme.radiuses.radius_s};
  box-shadow: ${(props) => props.theme.boxShadow.up};
  box-sizing: border-box;
`;

const WriterContainer = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
`;

const Writer = styled.div`
  display: flex;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text_weak};
  gap: 10px;
  align-items: center;
`;

const Description = styled.p`
  width: 100%;
  font-weight: 700;
  line-height: normal;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const ImgContainer = styled.div`
  width: 30px;
  height: 30px;
  border-radius: ${({ theme }) => theme.radiuses.radius_s};
  overflow: hidden;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

function Comment({ offerInfo, disabled }) {
  // TODO: 문의 기능 구현
  const navigate = useNavigate();
  const { accessToken } = useRouteLoaderData("root");
  const [searchParams] = useSearchParams();
  const urlPostId = searchParams.get("post_id");
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleCreateChatRoom() {
    fetch(`${BASE_URL}chatRoom/${urlPostId}/${offerInfo.memberId}`, {
      method: "POST",
      headers: {
        Authorization: accessToken,
        Accept: "application/json",
      },
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        const clientId = getMemberId();
        const roomId = data.data;
        navigate(
          `/chat-room?mode=chat&client-id=${clientId}&center-id=${offerInfo.centerId}&room-id=${roomId}&room-name=${offerInfo.centerName}`
        );
      })
      .catch((error) => console.log(error));
  }

  return (
    <CommentContainer>
      {isModalOpen && (
        <OfferSelectModal
          handleClose={() => setIsModalOpen(false)}
          offerInfo={offerInfo}
        />
      )}
      <WriterContainer>
        <Writer>
          {!disabled ? (
            <ImgContainer>
              <Img src={offerInfo.profile} />
            </ImgContainer>
          ) : (
            <img src={Logo} style={{ width: "28px", height: "36px" }} />
          )}
          {!disabled ? offerInfo.centerName : "익명"}
        </Writer>
        {!disabled && (
          <ButtonContainer>
            <SubmitButton
              size={"small"}
              children={"문의"}
              onClick={handleCreateChatRoom}
            />
            <SubmitButton
              size={"small"}
              children={"낙찰"}
              onClick={() => setIsModalOpen(true)}
            />
          </ButtonContainer>
        )}
      </WriterContainer>
      <Description>{offerInfo.contents}</Description>
      {!disabled && <StarRating score={offerInfo.score} />}
    </CommentContainer>
  );
}

export default Comment;
