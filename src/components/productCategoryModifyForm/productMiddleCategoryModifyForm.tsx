import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {categoryApi} from "../../network/category"
import {api} from "../../network/network";
import {useAppDispatch} from "../../app/hooks";
import {onLoading} from "../../app/reducers/dialogSlice";
import {changeMode} from "../../app/reducers/adminSlice";
import {
  Box, Button,
  Container, MenuItem, Select,
  Stack, styled,
  TextField,
  Typography
} from "@mui/material";
import EditButton from "../editButton";
import CancelModal from "../cancelModal";

interface propsType {
  successModify: () => void,
  errorToast: (message: string) => void
}

export default function ProductMiddleCategoryModifyForm({successModify, errorToast}: propsType) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const mainCategory = new URLSearchParams(location.search).get('main');
  const category = new URLSearchParams(location.search).get('name');

  const [open, setOpen] = useState(false);
  const [middleCategory, setMiddleCategory] = useState({
    id: 0,
    categoryName: '',
    imageServerFilename: '',
    imageOriginalFilename: '',
    showInMain: 'false',
    parent: '',
    children: ['']
  });
  const [newImage, setNewImage] = useState({file: '', path: '', name: ''});
  const {id, categoryName, imageServerFilename, imageOriginalFilename, parent} = middleCategory;

  // error message
  const [titleErrorMsg, setTitleErrorMsg] = useState('');

  const preventReset = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = ""; // Chrome
  };

  useEffect(() => {
    (() => {
      window.addEventListener("beforeunload", preventReset);
    })();
    return () => {
      window.removeEventListener("beforeunload", preventReset);
    };
  }, []);

  useEffect(() => {
    mainCategory &&
    categoryApi.getMiddleProductCategory(mainCategory)
      .then(res => {
        res.map((item: {
          categoryName: string,
          children: string[],
          id: number,
          imageOriginalFilename: string,
          imageServerFilename: string,
          parent: string,
          showInMain: string
        }) => item.categoryName === category && setMiddleCategory(item))
      })
      .catch(error => console.log(error))
  }, []);

  const validate = () => {
    let isValid = true;
    if (categoryName === '') {
      setTitleErrorMsg('카테고리 이름을 작성해 주세요.');
      isValid = false;
    } else setTitleErrorMsg('');
    return isValid;
  };

  // 카테고리 이름
  const changeCategoryName = (e: any) => setMiddleCategory({...middleCategory, categoryName: e.target.value});

  // 이미지 업로드
  const selectCategoryImage = (e: any) => {
    URL.revokeObjectURL(newImage.path);
    setNewImage({
      file: e.target.files[0],
      path: URL.createObjectURL(e.target.files[0]),
      name: e.target.files[0].name
    })
  };

  // 카테고리 수정
  const putMiddleCategory = () => {
    const middleCategoryForm = new FormData();
    newImage.file === '' ?
      [].map(item => middleCategoryForm.append('image', item)) :
      middleCategoryForm.append('image', newImage.file);
    middleCategoryForm.append('categoryName', categoryName);
    middleCategoryForm.append('showInMain', 'false');
    middleCategoryForm.append('type', 'product');
    middleCategoryForm.append('parentName', parent);

    if (validate()) {
      dispatch(onLoading());
      categoryApi.putUpdateProductCategory(id, middleCategoryForm)
        .then(() => {
          successModify();
          navigate(-1);
        })
        .catch(error => {
          console.log(error);
          if (error.response.status === 401) {
            errorToast('로그인이 필요합니다.');
            localStorage.removeItem("login");
            const isLogin = localStorage.getItem("login");
            dispatch(changeMode({login: isLogin}));
          }
          errorToast(error.response.data.message);
        })
        .finally(() => dispatch(onLoading()))
    }
  };

  return (
    <Container sx={{mt: 5}}>
      {/* 소제목 */}
      <Title variant='h5'>중분류 카테고리 등록</Title>

      <Spacing/>

      {/* 제품 등록 폼 */}
      <Box sx={{
        borderTop: '3px solid #2E7D32',
        borderBottom: '3px solid #2E7D32',
      }}>

        {/* 제목 */}
        <Box sx={{
          textAlign: 'center',
          borderBottom: '1px solid rgba(46, 125, 50, 0.5)',
          p: 2
        }}>
          <TextField
            type='text'
            required
            autoFocus
            placeholder='카테고리명'
            error={!!titleErrorMsg}
            helperText={titleErrorMsg}
            value={categoryName}
            onChange={changeCategoryName}
            inputProps={{style: {fontSize: 18}}}
            sx={{width: '100%'}}
          />
        </Box>

        {/* 사진 변경 */}
        <Stack direction='row' spacing={2} sx={{mt: 2, alignItems: 'center'}}>
          {/* 사진 변경 */}
          <Box sx={{pl: 1}}>
            <label className='categoryUploadButton' htmlFor='middleCategoryInput' onChange={selectCategoryImage}
                   onClick={(e: any) => e.target.value = null}>
              사진 변경
              <input type='file' id='middleCategoryInput' accept='image/*'/>
            </label>
          </Box>

          {/* 카테고리 */}
          <Button disabled sx={{fontSize: 'large', fontWeight: 'bold'}}>{mainCategory}</Button>
        </Stack>

        {/* 제품 사진 미리보기 */}
        <Box sx={{width: '100%', p: 2, borderBottom: '1px solid rgba(46, 125, 50, 0.5)'}}>
          <Container
            sx={{
              border: '1.8px solid lightgrey',
              borderRadius: 1,
              mb: 2,
              height: 300,
              display: 'flex',
              flexWrap: 'wrap',
              overflow: 'auto',
              alignItems: 'center'
            }}>
            <Box sx={{width: '23%', m: 1}}>
              {newImage.path === '' ?
                <img src={`${api.baseUrl()}/files/category/${imageServerFilename}`} alt={imageOriginalFilename}
                     width='100%'/> :
                <img src={newImage.path} alt={newImage.name} width='100%'/>
              }
            </Box>
          </Container>
        </Box>
      </Box>

      <Spacing/>

      {/* 버튼 */}
      <Spacing sx={{textAlign: 'center'}}>
        <EditButton name='수정' onClick={putMiddleCategory}/>
        <EditButton name='취소' onClick={() => setOpen(true)}/>
      </Spacing>

      {/* 취소 버튼 Dialog */}
      <CancelModal
        openState={open}
        title='작성 취소'
        text1='작성중인 내용이 사라집니다.'
        text2='취소하시겠습니까?'
        yesAction={() => {
          setOpen(false);
          navigate(-1);
        }}
        closeAction={() => setOpen(false)}/>
    </Container>
  )
};

const Spacing = styled(Container)(() => ({
  height: 30
})) as typeof Container;

const Title = styled(Typography)(({theme}) => ({
  [theme.breakpoints.down('md')]: {
    fontSize: 18,
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 16,
  },
  fontSize: 20,
  fontWeight: 'bold'
})) as typeof Typography