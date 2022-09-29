import React, {useCallback, useEffect, useState} from 'react';
import {api} from '../../network/network';
import {categoryApi} from '../../network/category';
import {fileApi} from "../../network/file";
import {useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {
  selectProductCategoryTrue, setCurrentProductCategory,
  setCurrentProductCategoryName,
  setMainCategories
} from '../../app/reducers/categorySlice';
import {
  Box,
  ButtonBase,
  Container,
  Typography,
  styled,
  Button,
  Stack,
  Grid
} from '@mui/material';
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";

export default function Representation() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const productMainCategories = useAppSelector(state => state.category.productMainCategories); // 메인 카테고리 목록
  const documentFile = useAppSelector(state => state.manager.document); // 카다록, 자재승인서, 시국세 정보
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  const handleWindowResize = useCallback(() => {
    setWindowSize(window.innerWidth);
  }, []);

  window.addEventListener("resize", handleWindowResize);
  useEffect(() => {
    categoryApi.getMainCategories()
      .then(res => dispatch(setMainCategories({categories: res})))
  }, []);

  // 제품 버튼 클릭 이벤트 (페이지 이동)
  const onClickButton = (categoryName: string) => {
    dispatch(selectProductCategoryTrue());
    dispatch(setCurrentProductCategoryName({category: categoryName}));
    navigate('/client-product'); // 페이지 이동
  };

  // 파일 다운로드
  const downloadFile = (serverFilename: string, originalFilename: string) => {
    fileApi.downloadFile(serverFilename)
      .then(res => {
        return res;
      })
      .then(file => {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = originalFilename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 60000);
        a.remove();
      })
      .catch(error => console.log(error))
  };

  // 카테고리 목록
  const MainCategoryGrid = () => {
    let categoryColumn = productMainCategories.length;
    if (windowSize < 1200) categoryColumn = 4;
    if (windowSize < 900) categoryColumn = 3;
    if (windowSize < 600) categoryColumn = 2;
    if (windowSize < 400) categoryColumn = 1;

    return (
      <Grid container columns={categoryColumn} spacing={3}>
        {productMainCategories?.map((item: { categoryName: string, id: number, imageServerFilename: string }) => (
          <Grid item xs={1} key={item.id}>
            {/*
              <RepProductionButton onClick={() => onClickButton(item.categoryName)} >
                <Container
                  style={{backgroundImage: `url(${api.baseUrl()}/files/category/${item.imageServerFilename})`}}
                  sx={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}/>
                <ImageBackdrop className='MuiImageBackdrop-root'/>

                <Container sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FCFCFC'
                }}>
                  <Typography sx={{
                    p: 2,
                    position: 'relative',
                    fontSize: 18,
                    fontWeight: 'bold',
                    display: 'none'
                  }}>
                    {item.categoryName}
                  </Typography>
                </Container>
              </RepProductionButton>
              */}

            <CategoryButton onClick={() => onClickButton(item.categoryName)}>
              {/* 카테고리 */}
              <Box sx={{height: 150, minWidth: 214}}>
                <img
                  className='categoryImage'
                  src={`${api.baseUrl()}/files/category/${item.imageServerFilename}`}
                  alt={item.categoryName}
                  width='100%'
                  height='100%'/>
              </Box>
              <CategoryNameTypography>
                {item.categoryName}
              </CategoryNameTypography>
            </CategoryButton>
          </Grid>
        ))}
      </Grid>
    )
  };

  return (
    <Box sx={{display: 'flex', justifyContent: 'center'}}>
      <Box sx={{
        p: 2,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <DocumentStack direction={'row'} spacing={2}>
          <SideButton
            onClick={() => downloadFile(documentFile.catalogServerFilename, documentFile.catalogOriginalFilename)}>
            카다록
          </SideButton>
          <SideButton
            onClick={() => downloadFile(documentFile.materialServerFilename, documentFile.materialOriginalFilename)}>
            자재 승인서
          </SideButton>
          <SideButton onClick={() => downloadFile(documentFile.taxServerFilename, documentFile.taxOriginalFilename)}>
            시국세
          </SideButton>
        </DocumentStack>

        {/* 메인 카테고리 */}
        <MainCategoryGrid />
      </Box>
    </Box>
  )
};

// 메인 버튼
const RepProductionButton = styled(ButtonBase)(() => ({
  margin: 5,
  height: 200,
  '&:hover': {
    '& .MuiImageBackdrop-root': {
      opacity: 0.3
    },
    '& .MuiTypography-root': {
      border: '5px solid #FCFCFC',
      borderRadius: 10,
      display: 'block'
    },
  }
})) as typeof ButtonBase;

// 이미지 커버(배경)
const ImageBackdrop = styled(Container)(({theme}) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: '#0F0F0F',
  opacity: 0,
  borderRadius: 10,
  transition: theme.transitions.create('opacity')
})) as typeof Container;

const DocumentStack = styled(Stack)(({theme}) => ({
  [theme.breakpoints.down('md')]: {
    display: 'block'
  },
  display: 'none',
  marginTop: 15,
  marginBottom: 15,
  textAlign: 'center',
  width: '100%'
})) as typeof Stack;

// 문서 다운로드 버튼
const SideButton = styled(Button)(() => ({
  fontSize: 13,
  borderRadius: 10,
  backgroundColor: 'rgb(46, 125, 50)',
  color: '#FCFCFC',
  '&: focus': {
    backgroundColor: 'rgba(50, 150, 77)'
  },
  '&: hover': {
    transform: 'scale(1.02)',
    backgroundColor: 'rgb(74,154,77)'
  }
})) as typeof Button;

const CategoryNameTypography = styled(Typography)(({theme}) => ({
  [theme.breakpoints.down('md')]: {
    fontSize: 15
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 13
  },
  fontWeight: 'bold',
  width: '100%',
  paddingTop: 4,
  paddingBottom: 4,
  borderRadius: 1,
  backgroundColor: 'rgba(57, 150, 82, 0.2)'
})) as typeof Typography;

// Image 버튼
const CategoryButton = styled(Button)(() => ({
  width: '100%',
  overflow: 'hidden',
  height: 200,
  color: '#0F0F0F',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid rgba(57, 150, 82, 0.2)',
  borderRadius: 10,
  transition: '0.5s',
  '&: hover': {
    transform: 'scale(1.04)'
  }
})) as typeof Button;