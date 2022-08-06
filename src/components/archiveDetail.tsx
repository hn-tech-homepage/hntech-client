import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { Box, Button, Container, Stack, styled, Typography } from '@mui/material';
import EditButton from './editButton';

export default function ArchiveDetail() {
  const navigate = useNavigate();

  const managerMode = useAppSelector(state => state.manager.managerMode); // 관리자 모드 state

  // 임시데이터
  const data = { title: 'ㅇㅇㅇ 자료', date: '2022.08.05', content: '설명' }

  return (
    <Container sx={{ mt: 5 }}>
      {/* 소제목 */}
      <Typography
        variant='h5'
        sx={{
          p: 1,
          width: 'max-content',
          borderBottom: '3px solid #2E7D32',
        }}>
        자료실
      </Typography>

      <Spacing>
        {managerMode &&
          <Box sx={{ textAlign: 'end' }}>
            {EditButton('수정', () => console.log('#'))}
            {EditButton('삭제', () => console.log('#'))}
          </Box>
        }
      </Spacing>

      <Box sx={{
        borderTop: '3px solid #2E7D32',
        borderBottom: '3px solid #2E7D32',
      }}>
        {/* 제목 */}
        <Box sx={{ borderBottom: '1px solid #3B6C46', p: 2 }}>
          <Typography sx={{
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            {data.title}
          </Typography>
        </Box>

        {/* 작성일 */}
        <Box
          sx={{
            p: 2,
            color: 'darkgrey',
            borderBottom: '1px solid #3B6C46'
          }}>
          <Typography sx={{ fontSize: 18, textAlign: 'end' }}>작성일 {data.date}</Typography>
        </Box>

        {/* 동영상 */}
        <Box sx={{ p: 3 }}>
          동영상
        </Box>

        {/* 자료 부가 설명 */}
        <Box sx={{ p: 3, minHeight: 200, borderBottom: '1px solid #3B6C46' }}>
          {data.content.split('\n').map((value, index) => (
            <Typography key={index} sx={{ fontSize: 18 }}>
              {value}
            </Typography>
          ))}
        </Box>

        {/* 첨부파일 */}
        <Stack direction='row' spacing={1} sx={{ p: 2, color: 'darkgrey' }}>
          <Typography>첨부파일</Typography>
          <Typography>|</Typography>
        </Stack>
      </Box>

      {/* 목록 버튼 */}
      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          size='small'
          onClick={() => navigate('/archive')}
          sx={{
            color: 'white',
            backgroundColor: '#2E7D32',
            fontWeight: 'bold'
          }}>
          목록
        </Button>
      </Box>
    </Container>
  )
};

const Spacing = styled(Container)(() => ({
  height: 50
})) as typeof Container;