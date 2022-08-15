import React from 'react';
import { api } from '../../network/network';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { clickNoticeFormGoBack } from '../../app/reducers/dialogSlice';
import { resetNoticeContent } from '../../app/reducers/questionContentSlice';
import {
  Container,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import EditButton from '../editButton';
import Form from './form';

export default function NoticeForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const fileForm = new FormData();

  const noticeFormState = useAppSelector(state => state.dialog.noticeFormState); // 글쓰기 취소 state
  const noticeContent = useAppSelector(state => state.questionContent.noticeContent); // 공지사항 글쓰기 내용 state
  const files = useAppSelector(state => state.notice.files); // 전송할 파일 state

  const postNotice = () => {
    files.map(item => fileForm.append('files', item))
    api.postUploadAllFiles(fileForm)
      .then(res => {
        console.log(resizeBy);
        alert('등록되었습니다.');
        console.log(noticeContent); // 보내기
        navigate('/question');
      })
  };

  return (
    <Container sx={{ mt: 5 }}>
      {/* 소제목 */}
      <Typography variant='h5' p={1}>공지사항</Typography>

      <Spacing />

      {/* 공지사항 글쓰기 폼 */}
      <Form />

      <Spacing />

      {/* 버튼 */}
      <Spacing sx={{ textAlign: 'center' }}>
        {EditButton('작성완료', postNotice)}
        {EditButton('취소', () => dispatch(clickNoticeFormGoBack()))}
      </Spacing>

      {/* 취소 버튼 Dialog */}
      <Dialog
        open={noticeFormState}
        onClose={() => dispatch(clickNoticeFormGoBack())}>
        <DialogTitle>
          {'작성 취소'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            작성중인 내용이 사라집니다.
          </DialogContentText>
          <DialogContentText>
            취소하시겠습니까?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => {
            dispatch(clickNoticeFormGoBack());
            dispatch(resetNoticeContent());
            navigate(-1);
          }}
          >
            네
          </Button>
          <Button onClick={() => dispatch(clickNoticeFormGoBack())}>아니오</Button>
        </DialogActions>
      </Dialog>
    </Container >
  )
};

const Spacing = styled(Container)(() => ({
  height: 30
})) as typeof Container;