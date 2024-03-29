import React from 'react';
import {adminApi} from '../../network/admin';
import {api} from '../../network/network';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {getCompanyInfoImage, updateCompanyInfo} from '../../app/reducers/companyModifySlice';
import {changeMode} from '../../app/reducers/adminSlice';
import {onLoading} from "../../app/reducers/dialogSlice";
import {Box, Container, Typography, styled} from '@mui/material';
import EditButton from '../editButton';

interface propsType {
  success: () => void,
  errorToast: (message: string) => void
}

export default function CompanyInfo({success, errorToast}: propsType) {
  const dispatch = useAppDispatch();

  const managerMode = useAppSelector(state => state.manager.managerMode); // 관리자 모드 state
  const companyInfo = useAppSelector(state => state.companyModify.companyImage.compInfoImage); // CI 소개 state (받아온 데이터)

  // CI 사진 업로드
  const updateCompanyInfoImage = (event: any) => {
    dispatch(updateCompanyInfo({file: event.target.files[0], path: URL.createObjectURL(event.target.files[0])}));
  };

  // CI 변경 요청
  const postCompanyInfo = () => {
    dispatch(onLoading());
    const ciForm = new FormData();

    ciForm.append('file', companyInfo.file);
    ciForm.append('where', 'ci');

    adminApi.postCompanyInfo(ciForm)
      .then(res => {
        dispatch(onLoading());
        success();
        dispatch(getCompanyInfoImage({companyInfoImage: res}));
      })
      .catch(error => {
        dispatch(onLoading());
        console.log(error);
        if (error.response.status === 401) {
          errorToast('로그인이 필요합니다.');
          localStorage.removeItem("login");
          const isLogin = localStorage.getItem("login");
          dispatch(changeMode({login: isLogin}));
        }
      })
  };

  return (
    <TotalBox>
      {/* 소제목 */}
      <Container sx={{display: 'flex', justifyContent: 'center'}}>
        <TitleTypography>
          CI 소개
        </TitleTypography>
      </Container>

      {/* 수정 버튼 */}
      <Spacing>
        {managerMode &&
          <Box sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
            <label className='imageUploadButton' htmlFor='orgChartInput'>
              이미지 가져오기
              <input
                type='file'
                accept='image/*'
                id='orgChartInput'
                onChange={updateCompanyInfoImage}/>
            </label>
            <EditButton name='수정' onClick={postCompanyInfo}/>
          </Box>}
      </Spacing>

      {/* CI */}
      <Box sx={{textAlign: 'center', mt: 1}}>
        {managerMode ?
          <Container
            sx={{
              border: '2px solid lightgrey',
              borderRadius: 1,
              alignItems: 'center',
              height: 500,
              overflow: 'auto'
            }}>
            <img
              src={companyInfo.path === '' ? `${api.baseUrl()}/files/admin/${companyInfo.serverFilename}` : companyInfo.path}
              alt='Company Info' width={'80%'}/>
          </Container> :
          <Box sx={{width: '60vw', m: 'auto'}}>
            <img src={`${api.baseUrl()}/files/admin/${companyInfo.serverFilename}`}
                 alt='Company Info' style={{maxWidth: '100%'}}/>
          </Box>
        }
      </Box>
    </TotalBox>
  )
};

const Spacing = styled(Container)(() => ({
  height: 50
})) as typeof Container;

const TotalBox = styled(Box)(({theme}) => ({
  [theme.breakpoints.down('md')]: {
    padding: 10,
  },
  padding: 20,
  paddingBottom: 0
})) as typeof Box;

const TitleTypography = styled(Typography)(({theme}) => ({
  [theme.breakpoints.down('md')]: {
    fontSize: 18
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 14
  },
  fontSize: 22,
  fontWeight: 'bold',
  color: '#2b2b2b',
  padding: 1,
  width: 'max-content',
  borderBottom: '3px solid #2E7D32'
})) as typeof Typography;