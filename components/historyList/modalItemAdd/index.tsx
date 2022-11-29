import React, { useRef, useState, useEffect } from "react";
import Modal from "../../layout/modal/index";
import { setData } from "../../../firebase/firestore";
import { BtnClose, BtnApply, ModalAccountAdd } from "./style";

interface memberListInit {
  map: any;
  id?: string | undefined;
  userId?: number | undefined;
  userName?: string | undefined;
  imgUrl?: string | undefined;
}

interface ModalProps {
  onClose: () => void;
  userListData: memberListInit;
}

interface historyItemhData {
  dateTime?: string | undefined;
  calculation: number;
  targetId?: number;
  description?: string | undefined;
}
const ModalHistoryAdd = (props: ModalProps) => {
  const [userList, setUserList] = useState<memberListInit>(props?.userListData);
  const [isModalView, setModalView] = useState<boolean>(false);
  const refInputDate = useRef<HTMLInputElement | null>(null);
  const refInputName = useRef<HTMLSelectElement | null>(null);
  const refInputPrice = useRef<HTMLInputElement | null>(null);
  const refInputComment = useRef<HTMLInputElement | null>(null);
  const validationCheck = () => {
    const patternNum = /[0-9]/;
    const patternDate = /[0-9]{4}[-]{1}[0-9]{2}[-]{1}[0-9]{2}/;
    const inputDate = refInputDate.current;
    const inputName = refInputName.current;
    const inputPrice = refInputPrice.current;
    const inputComment = refInputComment.current;

    if (inputDate?.value === "") {
      alert("날짜를 입력해 주세요.");
      console.log(refInputDate.current?.value);
      return false;
    }
    if (inputDate && !patternDate.test(inputDate.value)) {
      alert("날짜를 YYYY-MM-DD 타입으로 입력해 주세요.");
      return false;
    }
    if (inputName?.value === "") {
      alert("이름을 입력해 주세요.");
      console.log(refInputDate.current?.value);
      return false;
    }
    if (inputPrice?.value === "") {
      alert("금액을 입력해 주세요.");
      console.log(refInputDate.current?.value);
      return false;
    }
    if (inputPrice && !patternNum.test(inputPrice.value)) {
      alert("금액에는 숫자만 입력해 주세요.");
      return false;
    }
    if (inputComment?.value === "") {
      alert("내용을 입력해 주세요.");
      return false;
    }
    return true;
  };

  const dataPush = () => {
    if (validationCheck()) {
      let db: historyItemhData = {
        dateTime: refInputDate.current?.value,
        calculation: Number(refInputPrice.current?.value),
        description: refInputComment.current?.value,
      };
      if (Number(refInputName.current?.value) !== -1)
        db.targetId = Number(refInputName.current?.value);

      setData("accountList", db).then((data) => {
        props.onClose();
      });
    }
  };

  useEffect(() => {
    setModalView(true);
  }, []);

  return (
    <Modal onClose={props.onClose}>
      <BtnClose onClick={props.onClose}>닫기</BtnClose>
      <ModalAccountAdd className={isModalView ? `active` : ``}>
        <h1>입출금 기록 추가</h1>
        <dl>
          <dt>날짜</dt>
          <dd>
            <input
              type="text"
              placeholder="날짜를 입력해주세요. YYYY-MM-DD"
              maxLength={10}
              ref={refInputDate}
            />
          </dd>
          <dt>이름</dt>
          <dd>
            <div className="select-box">
              <select ref={refInputName}>
                <option value={-1}>지출</option>
                {userList &&
                  userList.map((item: memberListInit, idx: number) => {
                    return (
                      <option key={idx} value={item.id}>
                        {item.userName}
                      </option>
                    );
                  })}
              </select>
            </div>
          </dd>
          <dt>금액</dt>
          <dd>
            <input
              type="text"
              placeholder="금액을 입력해주세요."
              ref={refInputPrice}
            />
          </dd>
          <dt>내용</dt>
          <dd>
            <input
              type="text"
              placeholder="내용을 입력해주세요."
              ref={refInputComment}
            />
          </dd>
        </dl>
        <BtnApply onClick={() => dataPush()}>적용하기</BtnApply>
      </ModalAccountAdd>
    </Modal>
  );
};

export default ModalHistoryAdd;
