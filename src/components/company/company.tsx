import React from 'react';
import {useAppSelector} from '../../app/hooks';
import {Box, Container, styled, Typography} from '@mui/material';
import CompanySideMenu from './companySideMenu';
import Introduce from './introduce';
import History from './history';
import OrgChart from './orgChart';
import CompanyInfo from './companyInfo';
import Location from './location';

interface propsType {
  success: () => void
}

export default function Company({success}: propsType) {
  const mode = useAppSelector(state => state.company.mode);

  return (
    <CompanyBox>
      {/* 회사소개 사이드 메뉴 */}
      <SideMenuBox>
        <CompanySideMenu/>
      </SideMenuBox>

      <ContentsBox>

        {/* 회사 이념 (?) - 보류 */}
        <Container sx={{display: 'flex', justifyContent: 'center'}}>
          <img className='CIImage' src='/images/logo-letter.png' alt='회사 이념'/>
          <Box sx={{ml: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <CompanyTypography>HUMAN N TECHNOLOGY</CompanyTypography>
          </Box>
        </Container>

        {/* 컴포넌트 (페이지) */}
        {mode === 'INTRODUCE' && <Introduce success={success}/>}

        {mode === 'HISTORY' && <History success={success}/>}

        {mode === 'CHART' && <OrgChart success={success}/>}

        {mode === 'INFORMATION' && <CompanyInfo success={success}/>}

        {mode === 'LOCATION' && <Location/>}

      </ContentsBox>
    </CompanyBox>
  )
};

const CompanyBox = styled(Box)(({theme}) => ({
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    margin: 0
  },
  display: 'flex',
  marginTop: 50
})) as typeof Box;

const SideMenuBox = styled(Box)(({theme}) => ({
  [theme.breakpoints.down('md')]: {
    flex: 0.2
  },
  flex: 0.2
})) as typeof Box;

const ContentsBox = styled(Box)(({theme}) => ({
  [theme.breakpoints.down('md')]: {
    flex: 0.8
  },
  flex: 0.8
})) as typeof Box;

const CompanyTypography = styled(Typography)(({theme}) => ({
  [theme.breakpoints.down('md')]: {
    fontSize: 18,
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  },
  color: 'rgb(43, 88, 53)',
  fontSize: '30px',
  fontWeight: 'bold'
})) as typeof Typography;
