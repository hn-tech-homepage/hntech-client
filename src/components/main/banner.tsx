import React, { useEffect } from 'react';
import { api } from '../../network/network';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Box, styled, Typography } from '@mui/material';
import { useAppSelector } from '../../app/hooks';

SwiperCore.use([Navigation, Pagination, Autoplay])

export default function Banner() {
  const banner = useAppSelector(state => state.manager.banner); // 배너 정보 state

  return (
    <TotalBox>
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}>
        {banner?.map((item: {
          id: number,
          originalFilename: string,
          savedPath: string,
          serverFilename: string
        }, index: number) => (
          <SwiperSlide key={index}>
            <BannerBox sx={{ width: '100%', height: '80vh ' }}>
              <img src={`${api.baseUrl()}/files/admin/${item.serverFilename}`} width={'100%'} height={'100%'} />
            </BannerBox>
          </SwiperSlide>
        ))}
      </Swiper>
    </TotalBox>
  )
};
const TotalBox = styled(Box)(({ theme }) => ({
  // screen width - xs: 0px ~, sm: 600px ~, md: 960px ~, lg: 1280px ~, xl: 1920px ~
  [theme.breakpoints.down('lg')]: {
    width: '100% !important',
    height: '50% !important'
  },
  [theme.breakpoints.down('md')]: {
    width: '100% !important',
    height: '50% !important'
  },
  [theme.breakpoints.down('sm')]: {
    width: '100% !important',
    height: '50% !important'
  },
  height: '50%'
})) as typeof Box;

const BannerBox = styled(Box)(({ theme }) => ({
  // screen width - xs: 0px ~, sm: 600px ~, md: 960px ~, lg: 1280px ~, xl: 1920px ~
  [theme.breakpoints.down('lg')]: {
    height: '100% !important'
  },
  [theme.breakpoints.down('md')]: {
    height: '100% !important'
  },
  [theme.breakpoints.down('sm')]: {
    height: '100% !important'
  },
  height: '100%'
})) as typeof Box;

const MainTypography = styled(Typography)(({ theme }) => ({
  // screen width - xs: 0px ~, sm: 600px ~, md: 960px ~, lg: 1280px ~, xl: 1920px ~
  [theme.breakpoints.down('lg')]: {
    fontSize: '30px !important'
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '25px !important'
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '20px !important'
  },
  fontSize: 40,
  color: '#FCFCFC'
})) as typeof Typography;