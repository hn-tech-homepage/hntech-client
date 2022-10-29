import React, {useEffect, useState, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {categoryApi} from '../../network/category';
import {api} from '../../network/network';
import {adminApi} from "../../network/admin";
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {useAppSelector, useAppDispatch} from '../../app/hooks';
import {
  addProductCategoryImage,
  selectProductCategoryTrue,
  setCurrentProductCategoryName,
  updateProductCategoryImage
} from '../../app/reducers/categorySlice';
import {clickProductCategoryListGoBack} from '../../app/reducers/dialogSlice';
import {changeMode, setPassword} from '../../app/reducers/managerModeSlice';
import {setAllProductCategories, setCurrentProductCategory} from '../../app/reducers/categorySlice';
import {
  Box, Breadcrumbs,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  styled,
  TextField,
  Typography
} from '@mui/material';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CancelModal from '../cancelModal';
import EditButton from "../editButton";
import ProductCategoryList from "./productCategoryList";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

interface propsType {
  successDelete: () => void
}

export default function ProductCategories({successDelete}: propsType) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // state
  const managerMode = useAppSelector(state => state.manager.managerMode); // 관리자 모드
  const password = useAppSelector(state => state.manager.password); // 관리자 비밀번호
  const productCategorySelected = useAppSelector(state => state.category.productCategorySelected); // 카테고리 선택
  const productCategories = useAppSelector(state => state.category.productCategories); // 카테고리 목록
  const productCurrentCategory = useAppSelector(state => state.category.productCurrentCategory); // 선택된 카테고리 정보
  const currentProductCategoryName = useAppSelector(state => state.category.currentProductCategoryName)
  const [onDeleteCategory, setOnDeleteCategory] = useState(false);
  const [checkPassword, setCheckPassword] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState('');
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  const handleWindowResize = useCallback(() => {
    setWindowSize(window.innerWidth);
  }, []);

  window.addEventListener("resize", handleWindowResize);

  useEffect(() => {
    // 카테고리 이미지 초기화
    dispatch(addProductCategoryImage({image: undefined}));
    dispatch(updateProductCategoryImage({categoryImage: ''}));

    // 카테고리 목록 받아오기
    categoryApi.getAllProductCategories()
      .then(res => dispatch(setAllProductCategories({categories: res.categories})))
      .catch(error => console.log(error))
  }, []);

  // 카테고리 삭제 modal - open
  const openDeleteCategory = () => {
    setOnDeleteCategory(onDeleteCategory => !onDeleteCategory);
  };

  // 카테고리 삭제 modal - close
  const closeDeleteCategory = () => {
    setOnDeleteCategory(false);
  };

  // 비밀번호 확인
  const postLogin = () => {
    adminApi.postLogin(password)
      .then(res => {
        setLoginErrorMsg('');
        setCheckPassword(false);
        openDeleteCategory();
        dispatch(setPassword({password: ''}));
      })
      .catch(error => {
        setLoginErrorMsg(error.response.data.message);
      })
  };

  const onLoginEnterKey = (event: any) => {
    if (event.key === 'Enter') {
      postLogin();
    }
  };

  // 카테고리 삭제
  const deleteProductCategory = (categoryId: number) => {
    categoryApi.deleteProductCategory(categoryId)
      .then(() => {
        successDelete();
        closeDeleteCategory();
        categoryApi.getAllProductCategories()
          .then(res => dispatch(setAllProductCategories({categories: res.categories})))
          .catch(error => console.log(error))
      })
      .catch(error => {
        if (error.response.status === 401) {
          localStorage.removeItem("login");
          const isLogin = localStorage.getItem("login");
          dispatch(changeMode({login: isLogin}));
        }
      })
  };

  // 카테고리 선택
  const selectProductCategory = (categoryName: string) => {
    dispatch(selectProductCategoryTrue());
    dispatch(setCurrentProductCategoryName({category: categoryName}));
  }

  // 카테고리 목록
  const CategoryGrid = () => {
    let categoryColumn = 4;
    if (windowSize < 1200) categoryColumn = 3;
    if (windowSize < 900) categoryColumn = 2;
    if (windowSize < 600) categoryColumn = 1;

    return (
      <Grid container columns={categoryColumn} spacing={3}>
        {productCategories?.map((value: {
          categoryName: string,
          id: number,
          imageServerFilename: string,
          imageOriginalFilename: string,
          showInMain: string
        }) => (
          <Grid item xs={1} key={value.id}>
            <CategoryButton onClick={() => selectProductCategory(value.categoryName)}>
              {/* 카테고리 */}
              <Box sx={{height: 150}}>
                <img
                  className='categoryImage'
                  src={`${api.baseUrl()}/files/category/${value.imageServerFilename}`}
                  alt={value.imageOriginalFilename}
                  width='100%'
                  height='100%'/>
              </Box>
              <CategoryNameTypography>
                {value.categoryName}
              </CategoryNameTypography>
            </CategoryButton>

            {/* 수정 버튼 */}
            {managerMode &&
              <Box sx={{display: 'flex', justifyContent: 'space-around'}}>
                <Button
                  onClick={() => {
                    dispatch(setCurrentProductCategory({category: value}));
                    setCheckPassword(checkPassword => !checkPassword);
                  }}
                  sx={{color: 'red'}}>
                  <RemoveCircleRoundedIcon sx={{fontSize: 30}}/>
                </Button>
                <Button
                  onClick={() => {
                    dispatch(setCurrentProductCategory({category: value}));
                    navigate('/productCategory/modify');
                  }}
                  sx={{color: 'darkgreen'}}>
                  <CreateRoundedIcon sx={{fontSize: 30}}/>
                </Button>
              </Box>
            }
          </Grid>
        ))}
      </Grid>
    )
  };

  return (
    <Box sx={{width: '100%'}}>
      {/* default */}
      {!productCategorySelected &&
        <>
          <Container sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 5
          }}>
            <TitleTypography variant='h5'>
              제품 소개
            </TitleTypography>
          </Container>
          {managerMode &&
            <Spacing sx={{textAlign: 'end'}}>
              <EditButton name={'카테고리 목록'} onClick={() => dispatch(clickProductCategoryListGoBack())}/>

              <DndProvider backend={HTML5Backend}>
                <ProductCategoryList/>
              </DndProvider>
            </Spacing>
          }

          {/* 카테고리 목록 */}
          <CategoryGrid/>

          {/* 추가 버튼 */}
          {managerMode &&
            <AddButton onClick={() => navigate('/productCategory/form')}>
              <AddRoundedIcon sx={{color: '#042709', fontSize: 100, opacity: 0.6}}/>
            </AddButton>
          }
        </>
      }

      {/* category selected */}
      {productCategorySelected &&
        <>
          <Container sx={{display: 'flex'}}>
            <Typography
              variant='h5'
              sx={{
                p: 1,
                userSelect: 'none',
                fontWeight: 'bold'
              }}>
              제품 소개
            </Typography>
          </Container>
          <Box sx={{
            pt: 1,
            pb: 1,
            pl: 2,
            display: 'flex',
            flexDirection: 'column',
            width: 'max-content'
          }}>
            {productCategories.map((value: {
              categoryName: string;
              id: number;
              imageServerFilename: string;
              imageOriginalFilename: string;
              showInMain: string;
            }) => (
              <MenuButton
                key={value.id}
                onClick={() => {
                  dispatch(selectProductCategoryTrue());
                  dispatch(setCurrentProductCategoryName({category: value.categoryName}));
                }}
                sx={{
                  color: currentProductCategoryName === value.categoryName ? '#F0F0F0' : '#0F0F0F',
                  backgroundColor: currentProductCategoryName === value.categoryName ? 'rgb(81,131,94)' : 'rgba(166,166,166,0.25)',
                  '&:hover': {
                    backgroundColor: currentProductCategoryName === value.categoryName ? 'rgb(81,131,94)' : 'rgba(166,166,166,0.25)'
                  }
                }}>
                {value.categoryName}
              </MenuButton>
            ))}
          </Box>
        </>
      }

      {/* 카테고리 삭제 비밀번호 확인 Dialog */}
      < Dialog
        open={checkPassword}
        onClose={() => setCheckPassword(false)}>
        <DialogTitle>
          비밀번호 확인
        </DialogTitle>

        <DialogContent>
          <DialogContentText>비밀번호</DialogContentText>
          <TextField
            error={!!loginErrorMsg}
            helperText={loginErrorMsg}
            required
            autoFocus={true}
            autoComplete='off'
            type={'password'}
            onChange={event => dispatch(setPassword({password: event?.target.value}))}
            onKeyUp={onLoginEnterKey}/>
        </DialogContent>

        <DialogActions>
          <Button onClick={postLogin}>
            확인
          </Button>
          <Button
            onClick={() => {
              setCheckPassword(false);
              setLoginErrorMsg('');
            }}>
            취소
          </Button>
        </DialogActions>
      </Dialog>

      {/* 삭제 버튼 Dialog */}
      <CancelModal
        openState={onDeleteCategory}
        title='카테고리 삭제'
        text1='해당 카테고리가 삭제됩니다.'
        text2='삭제하시겠습니까?'
        yesAction={() => deleteProductCategory(productCurrentCategory.id)}
        closeAction={closeDeleteCategory}/>
    </Box>
  )
};

const Spacing = styled(Container)(() => ({
  height: 60
})) as typeof Container;

const TitleTypography = styled(Typography)(({theme}) => ({
  [theme.breakpoints.down('md')]: {
    fontSize: 18
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 14
  },
  fontWeight: 'bold',
  userSelect: 'none',
  padding: 1,
  width: 'max-content',
  borderBottom: '3px solid #2E7D32',
})) as typeof Typography;

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
  borderRadius: 8,
  backgroundColor: 'rgba(79,79,79,0.78)'
})) as typeof Typography;

// Image 버튼
const CategoryButton = styled(Button)(() => ({
  width: '100%',
  overflow: 'hidden',
  height: 200,
  color: '#F0F0F0',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 10,
  border: '3px solid rgba(79,79,79,0.78)',
  transition: '0.5s',
  '&: hover': {
    transform: 'scale(1.04)',
    border: '3px solid rgba(79,79,79,0.78)',
  }
})) as typeof Button;

// 추가 버튼
const AddButton = styled(Button)(({theme}) => ({
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
  width: '23%',
  color: '#0F0F0F',
  backgroundColor: 'rgba(57, 150, 82, 0.1)',
  borderRadius: 10,
  transition: '0.5s',
  '&: hover': {
    transform: 'scale(1.02)',
    backgroundColor: 'rgba(57, 150, 82, 0.2)',
  }
})) as typeof Button;

// Text 버튼
const MenuButton = styled(Button)(() => ({
  padding: 10,
  paddingLeft: 10,
  paddingRight: 20,
  marginLeft: 10,
  fontSize: 15,
  fontWeight: 'bold',
  marginBottom: 10,
  borderRadius: 5,
  justifyContent: 'flex-start',
  transition: '0.5s',
  '&:hover': {
    transform: 'scale(1.02)'
  }
})) as typeof Button;
