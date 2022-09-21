import React, {useEffect} from 'react';
import {adminApi} from '../../network/admin';
import {api} from '../../network/network';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {changeMode} from '../../app/reducers/managerModeSlice';
import {onLoading} from "../../app/reducers/dialogSlice";
import {getOrgChartImage, updateOrgChart} from '../../app/reducers/companyModifySlice';
import {Box, Container, Typography, styled} from '@mui/material';
import EditButton from '../editButton';

interface propsType {
  success: () => void
}

export default function OrgChart({success}: propsType) {
  const dispatch = useAppDispatch();

  const orgChartForm = new FormData(); // 조직도 (전송 데이터)

  const managerMode = useAppSelector(state => state.manager.managerMode); // 관리자 모드 state
  const orgChart = useAppSelector(state => state.companyModify.companyImage.orgChartImage); // 조직도 state (받아온 데이터)

  // 조직도 받아오기
  useEffect(() => {
    adminApi.getOrgChart()
      .then(res => dispatch(getOrgChartImage({orgChartImage: res})))
      .catch(error => console.log(error))
  }, []);

  // 조직도 사진 업로드 -> 됐는지 확인해야함
  const updateOrgChartImage = (event: any) => {
    dispatch(updateOrgChart({file: event.target.files[0], path: URL.createObjectURL(event.target.files[0])}));
  };

  // 조직도 변경 요청
  const postOrgChart = () => {
    dispatch(onLoading());
    orgChartForm.append('file', orgChart.file);
    orgChartForm.append('where', 'orgChart');
    adminApi.postOrgChart(orgChartForm)
      .then(res => {
        dispatch(onLoading());
        success();
        dispatch(getOrgChartImage({orgChartImage: res}));
      })
      .catch(error => {
        dispatch(onLoading());
        console.log(error);
        if (error.response.status === 401) {
          localStorage.removeItem("login");
          const isLogin = localStorage.getItem("login");
          dispatch(changeMode({login: isLogin}));
        }
        ;
      })
  };

  return (
    <TotalBox>
      {/* 소제목 */}
      <Container sx={{display: 'flex', justifyContent: 'center'}}>
        <TitleTypography variant='h5'>
          조직도
        </TitleTypography>
      </Container>

      {/* 수정 버튼 */}
      <Spacing>
        {managerMode &&
            <Box sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                <label
                    className='imageUploadButton'
                    htmlFor='orgChartInput'
                    onChange={updateOrgChartImage}>
                    이미지 가져오기
                    <input
                        type='file'
                        accept='image/*'
                        id='orgChartInput'/>
                </label>
                <EditButton name='수정' onClick={postOrgChart}/>
            </Box>}
      </Spacing>

      {/* 조직도 */}
      <Box sx={{textAlign: 'center', mt: 1}}>
        {managerMode ?
          <Container
            sx={{
              border: '2px solid lightgrey',
              borderRadius: 1,
              alignItems: 'center',
              minHeight: 300,
              overflow: 'scroll'
            }}>
            <img src={orgChart.path === '' ? `${api.baseUrl()}/files/admin/${orgChart.serverFilename}` : orgChart.path}
                 alt='조직도' width={'80%'}/>
          </Container> :
          <img className='companyImage' src={`${api.baseUrl()}/files/admin/${orgChart.serverFilename}`} alt='조직도'/>
        }
      </Box>
    </TotalBox>
  )
};

const Spacing = styled(Container)(({theme}) => ({
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
  padding: 1,
  width: 'max-content',
  borderBottom: '3px solid #2E7D32',
})) as typeof Typography;