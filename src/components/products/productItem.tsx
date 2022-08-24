import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clickProductItemGoBack } from '../../app/reducers/dialogSlice';
import { getCurrentProductData, getProductDetail, getProductList } from '../../app/reducers/productSlice';
import { Box, Button, styled, Typography } from '@mui/material';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CancelModal from '../cancelModal';
import { productApi } from '../../network/product';
import { api } from '../../network/network';

export default function ProductItem() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const managerMode = useAppSelector(state => state.manager.managerMode); // 관리자 모드 state
  const productItemState = useAppSelector(state => state.dialog.productItemState); // 제품 삭제 dialog
  const productList = useAppSelector(state => state.product.productList); // 제품 목록
  const currentProductCategoryName = useAppSelector(state => state.category.currentProductCategoryName); // 현재 선택된 카테고리 state
  const currentProductData = useAppSelector(state => state.product.currentProductData); // 선택된 제품 정보

  //제품 목록 받아오기
  useEffect(() => {
    productApi.getAllProducts(currentProductCategoryName)
      .then(res => dispatch(getProductList({ productList: res })))
      .catch(error => console.log(error))
  }, []);

  // 제품 정보 받아오기
  const getProduct = (productId: number) => {
    productApi.getProduct(productId)
      .then(res => {
        dispatch(getProductDetail({ detail: res }));
        navigate('/product-detail');
      })
  };

  // 수정 요청
  const modifyProduct = () => {
    navigate('/product-modify');
    // 뭐 보내야 정보 받아올거아냐
  };

  // 제품 삭제
  const deleteProduct = (productId: number) => {
    productApi.deleteProduct(productId)
      .then(res => console.log(res))
      .catch(error => console.log(error))
  };

  return (
    <Box sx={{ p: 1, display: 'flex', flexWrap: 'wrap' }}>
      {productList.map((item: {
        id: number,
        image: {
          id: number,
          originalFilename: string,
          savedPath: string,
          serverFilename: string
        },
        productName: string
      }) => (
        <TotalBox key={item.id}>
          <ContainerBox>
            <ProductButton
              onClick={() => getProduct(item.id)}>
              <img className='productImage' src={`${api.baseUrl()}/files/product/${item.image.serverFilename}`} width='100%' alt='제품 이미지' />
              <Typography sx={{
                width: '100%',
                borderRadius: 1,
                backgroundColor: 'rgba(57, 150, 82, 0.2)'
              }}>
                {item.productName}
              </Typography>
            </ProductButton>

            {/* 수정 버튼 */}
            {managerMode &&
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  onClick={() => {
                    dispatch(getCurrentProductData({ productData: item }))
                    dispatch(clickProductItemGoBack());
                  }}
                  sx={{ color: 'red', padding: 0 }}>
                  <RemoveCircleRoundedIcon sx={{ fontSize: 25 }} />
                </Button>
                <Button
                  onClick={modifyProduct}
                  sx={{ color: 'green', padding: 0 }}>
                  <CreateRoundedIcon sx={{ fontSize: 25 }} />
                </Button>
              </Box>
            }
          </ContainerBox>
        </TotalBox>
      ))
      }

      {
        managerMode &&
        <AddButton onClick={() => navigate('/product-form')}>
          <AddRoundedIcon sx={{ color: '#042709', fontSize: 100, opacity: 0.6 }} />
        </AddButton>
      }
      {/* 삭제 버튼 Dialog */}
      <CancelModal
        openState={productItemState}
        title='제품 삭제'
        text1='해당 제품이 삭제됩니다.'
        text2='삭제하시겠습니까?'
        yesAction={() => deleteProduct(currentProductData.id)}
        closeAction={() => dispatch(clickProductItemGoBack())} />
    </Box >
  )
};

const TotalBox = styled(Box)(({ theme }) => ({
  // screen width - xs: 0px ~, sm: 600px ~, md: 960px ~, lg: 1280px ~, xl: 1920px ~
  [theme.breakpoints.down('lg')]: {
    width: '30% !important'
  },
  [theme.breakpoints.down('md')]: {
    width: '45% !important'
  },
  [theme.breakpoints.down('sm')]: {
    width: '90% !important'
  },
  width: '19%',
  margin: 3,
})) as typeof Box;

const ContainerBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
})) as typeof Box;

// Item 버튼
const ProductButton = styled(Button)(() => ({
  margin: 10,
  width: '100%',
  color: '#0F0F0F',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid rgba(57, 150, 82, 0.2)',
  borderRadius: 10,
  transition: '0.5s',
  '&: hover': {
    transform: 'scale(1.04)',
    fontWeight: 'bold'
  }
})) as typeof Button;

// 추가 버튼
const AddButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    width: '30% !important'
  },
  [theme.breakpoints.down('md')]: {
    width: '45% !important'
  },
  [theme.breakpoints.down('sm')]: {
    width: '90% !important'
  },
  margin: 10,
  width: '18%',
  color: '#0F0F0F',
  backgroundColor: 'rgba(57, 150, 82, 0.1)',
  borderRadius: 10,
  transition: '0.5s',
  '&: hover': {
    transform: 'scale(1.02)',
    backgroundColor: 'rgba(57, 150, 82, 0.2)',
  }
})) as typeof Button;