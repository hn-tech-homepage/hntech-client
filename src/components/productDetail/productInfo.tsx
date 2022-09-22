import React from 'react';
import {useNavigate} from 'react-router-dom';
import {productApi} from '../../network/product';
import {api} from '../../network/network';
import {useAppSelector, useAppDispatch} from '../../app/hooks';
import {getProductList, nextImage, prevImage} from '../../app/reducers/productSlice';
import {getProductContent} from '../../app/reducers/productFormSlice';
import {clickProductInfoGoBack} from '../../app/reducers/dialogSlice';
import {
  Box,
  Button,
  Container,
  MobileStepper,
  styled,
  Typography
} from '@mui/material';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import EditButton from '../editButton';
import CancelModal from '../cancelModal';

interface propsType {
  successDelete: () => void
}

export default function ProductInfo({successDelete}: propsType) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const managerMode = useAppSelector(state => state.manager.managerMode); // 관리자 모드 state
  const productInfoState = useAppSelector(state => state.dialog.productInfoState); // 제품 삭제 dialog state
  const activeStep = useAppSelector(state => state.product.activeStep); // 제품 이미지 step state
  const {category, description, files, id, productName} = useAppSelector(state => state.product.productDetail); // 제품 정보
  const {docFiles, productImages, representativeImage, standardImages} = files; // 파일
  const maxSteps = productImages.length; // 이미지 개수

  // 제품 삭제
  const deleteProduct = (productId: number) => {
    productApi.deleteProduct(productId)
      .then(res => {
        productApi.getAllProducts(category)
          .then(res => {
            successDelete();
            dispatch(getProductList({productList: res}));
            dispatch(clickProductInfoGoBack());
            navigate('/product');
          })
          .catch(error => console.log(error))
      })
      .catch(error => console.log(error))
  };

  // 수정 요청
  const modifyProduct = () => {
    productApi.getProduct(id)
      .then(res => {
        dispatch(getProductContent({detail: res}));
        navigate('/product-modify');
      })
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
      <TitleTypography variant='h5'>
        {productName}
      </TitleTypography>

      <Spacing sx={{textAlign: 'end'}}>
        {managerMode &&
            <>
                <EditButton name='수정' onClick={modifyProduct}/>
                <EditButton name='삭제' onClick={() => dispatch(clickProductInfoGoBack())}/>
            </>
        }
      </Spacing>

      {/* 제품 사진 */}
      <Box>
        <Box
          sx={{
            width: 300,
            height: 250,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          {productImages.length !== 0 &&
              <img
                  src={`${api.baseUrl()}/files/product/${productImages[activeStep].serverFilename}`}
                  alt={productImages[activeStep].originalFilename}
                  width={300}/>
          }
        </Box>
        <MobileStepper
          steps={maxSteps}
          position='static'
          activeStep={activeStep}
          nextButton={
            <Button
              onClick={() => dispatch(nextImage())}
              disabled={activeStep === maxSteps - 1}>
              <NavigateNextRoundedIcon/>
            </Button>
          }
          backButton={
            <Button
              onClick={() => dispatch(prevImage())}
              disabled={activeStep === 0}>
              <NavigateBeforeRoundedIcon/>
            </Button>
          }/>
      </Box>

      <Spacing/>

      {/* 부가 설명 */}
      <Container sx={{textAlign: 'center'}}>
        {description.split('\n').map((value, index) => (
          <DescriptionTypography key={index}>
            {value}
          </DescriptionTypography>
        ))}
      </Container>

      {/* 삭제 버튼 Dialog */}
      <CancelModal
        openState={productInfoState}
        title='제품 삭제'
        text1='해당 제품이 삭제됩니다.'
        text2='삭제하시겠습니까?'
        yesAction={() => deleteProduct(id)}
        closeAction={() => dispatch(clickProductInfoGoBack())}/>
    </Container>
  )
};

const Spacing = styled(Container)(({theme}) => ({
  height: 50
})) as typeof Container;

const TitleTypography = styled(Typography)(({theme}) => ({
  [theme.breakpoints.down('md')]: {
    fontSize: 18
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 14
  },
  userSelect: 'none',
  padding: 1,
  width: 'max-content',
  borderBottom: '3px solid #2E7D32',
})) as typeof Typography;

const DescriptionTypography = styled(Typography)(({theme}) => ({
  [theme.breakpoints.down('md')]: {
    fontSize: 18
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 14
  },
  fontSize: 20
})) as typeof Typography;