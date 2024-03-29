import React, {useEffect, useState, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {productApi} from '../../network/product';
import {useAppSelector, useAppDispatch} from '../../app/hooks';
import {changeMode} from '../../app/reducers/adminSlice';
import {onLoading} from "../../app/reducers/dialogSlice";
import {
  Container,
  styled,
  Typography,
  Box,
  Button,
  Stack,
  TextField,
  List,
  ListItem,
  FormControl,
  FormHelperText
} from '@mui/material';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import EditButton from '../editButton';
import CancelModal from '../cancelModal';
import ProductCategorySelect from '../productCategorySelect';

interface propsType {
  success: () => void,
  errorToast: (message: string) => void
}

export default function ProductForm({success, errorToast}: propsType) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // 제품, 규격 이미지 Ref
  const repPhotoInputRef: any = useRef();
  const photoInputRef: any = useRef();
  const gradeInputRef: any = useRef();

  // state
  const currentProductMiddleCategoryName = useAppSelector(state => state.category.currentProductMiddleCategoryName); // 현재 선택된 중분류 카테고리
  const productMiddleCategories = useAppSelector(state => state.category.productMiddleCategories); // 중분류 카테고리 목록 state
  const [cancelProductForm, setCancelProductForm] = useState(false); // 제품 등록 취소
  const [content, setContent] = useState({category: '', description: '', productName: ''});
  const [docFiles, setDocFiles] = useState<{ id: number, file: string, originalFilename: string, type: string }[]>([]);
  const [productImages, setProductImages] = useState<{ file: string, path: string }[]>([]);
  const [representativeImage, setRepresentativeImage] = useState({file: '', path: ''});
  const [standardImages, setStandardImages] = useState<{ file: string, path: string }[]>([]);
  const {category, description, productName} = content;

  // error message state
  const [titleErrorMsg, setTitleErrorMsg] = useState(''); // 제목
  const [repImgErrorMsg, setRepImgErrorMsg] = useState(''); // 대표제품 이미지
  const [fileErrorMsg, setFileErrorMsg] = useState(''); // 다운로드 파일 버튼

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

  // 중간 카테고리 불러오기
  useEffect(() => {
    setContent({...content, category: currentProductMiddleCategoryName});
  }, []);

  const validate = () => {
    let isValid = true;
    if (productName === '') {
      setTitleErrorMsg('제품 이름을 작성해 주세요.');
      isValid = false;
    } else setTitleErrorMsg('');
    if (representativeImage.file.length === 0) {
      setRepImgErrorMsg('대표사진을 등록해 주세요');
      isValid = false;
    } else setRepImgErrorMsg('');
    docFiles.map(item => {
      if (!item.type || !item.file) {
        setFileErrorMsg('파일 정보를 확인해 주세요');
        isValid = false;
      } else setFileErrorMsg('');
    })
    return isValid;
  };

  // 중분류 카테고리 선택
  const getMiddleCategory = (category: string) => setContent({...content, category: category});

  // 제품 등록 취소 modal - open
  const openCancelProductForm = () => setCancelProductForm(cancelProductForm => !cancelProductForm);

  // 제품 등록 취소 modal - close
  const closeCancelProductForm = () => setCancelProductForm(false);

  // input - button 연결(input 숨기기)
  const selectInput = (item: any) => item.current?.click();

  // 제품 이름
  const getProductName = (event: any) => setContent({...content, productName: event.target.value});

  // 제품 설명
  const getDescription = (event: any) => setContent({...content, description: event.target.value});

  // 대표 제품 이미지 추가
  const getRepProductImage = (event: any) => {
    URL.revokeObjectURL(representativeImage.path);
    setRepresentativeImage({file: event.target.files[0], path: URL.createObjectURL(event.target.files[0])});
  };

  // 제품 이미지 추가
  const getProductImage = (event: any) => {
    let newProductImage = productImages;
    for (let i = 0; i < event.target.files.length; i++) {
      newProductImage = newProductImage.concat({
        file: event.target.files[i],
        path: URL.createObjectURL(event.target.files[i])
      })
    }
    setProductImages(newProductImage);
  };

  // 제품 이미지 삭제
  const deleteProductImage = (num: number) => {
    URL.revokeObjectURL(productImages[num].path);
    const newProductImage = productImages.filter((item, index: number) => index !== num);
    setProductImages(newProductImage);
  };

  // 규격 이미지 추가
  const getStandardImage = (event: any) => {
    let newStandardImage = standardImages;
    for (let i = 0; i < event.target.files.length; i++) {
      newStandardImage = newStandardImage.concat({
        file: event.target.files[i],
        path: URL.createObjectURL(event.target.files[i])
      })
    }
    setStandardImages(newStandardImage);
  };

  // 규격 이미지 삭제
  const deleteStandardImage = (num: number) => {
    URL.revokeObjectURL(standardImages[num].path);
    const newStandardImage = standardImages.filter((item, index: number) => index !== num);
    setStandardImages(newStandardImage);
  };

  // 첨부파일 버튼 추가
  const addProductDocUploadButton = () => {
    setDocFiles([...docFiles, {id: Date.now(), file: '', originalFilename: '', type: ''}]);
  };

  // 첨부파일 버튼 삭제
  const deleteProductDocUploadButton = (num: number) => {
    const newDocFile = docFiles.filter((item, index) => index !== num);
    setDocFiles(newDocFile);
  };

  // 첨부파일 추가
  const getProductDoc = (id: number, event: any) => {
    const newDocFile = docFiles.map(item => (
      item.id === id ? {
        ...item,
        file: event.target.files[0],
        originalFilename: event.target.files[0].name
      } : item
    ))
    setDocFiles(newDocFile);
  };

  // 첨부파일 이름 변경
  const getProductDocType = (id: number, type: string) => {
    const newDocFile = docFiles.map(item => (
      item.id === id ? {...item, type: type} : item
    ));
    setDocFiles(newDocFile);
  };

  // 파일 삭제
  const deleteProductDoc = (id: number) => {
    const newDocFile = docFiles.map(item => (
      item.id === id ? {...item, originalFilename: '', file: ''} : item
    ));
    setDocFiles(newDocFile);
  };

  // 파일 이름 추출
  const putUpdateProductDocFiles = (
    productData: {
      id: number,
      originalFilename: string,
      savedPath: string,
      serverFilename: string,
      type: string
    },
    productId: number) => {
    docFiles.map((item, index: number) => {
      item.originalFilename === productData.originalFilename &&
      productApi.putUpdateProductDocFiles(productId, productData.id, {filename: item.type})
        .then(() => {
          navigate(-1);
          index === docFiles.length - 1 && success();
        })
        .catch(error => errorToast(error.response.data.message))
        .finally(() => dispatch(onLoading()))
    })
  };

  // 중분류 카테고리 등록
  const postMiddleProductCategory = () => {
    const productForm = new FormData();
    productForm.append('categoryName', category);
    productForm.append('description', description);
    docFiles.map(item => productForm.append('docFiles', item.file));
    productImages.map(item => productForm.append('productImages', item.file));
    productForm.append('productName', productName);
    productForm.append('representativeImage', representativeImage.file);
    standardImages.map(item => productForm.append('standardImages', item.file));

    if (validate()) {
      dispatch(onLoading());
      productApi.postCreateProduct(productForm)
        .then(res => {
          if (docFiles.length === 0) {
            dispatch(onLoading());
            success();
            navigate(-1);
          } else {
            res.files.docFiles.map((item: {
              id: number,
              originalFilename: string,
              savedPath: string,
              serverFilename: string,
              type: string
            }) => putUpdateProductDocFiles(item, res.id))
          }
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
          errorToast(error.response.data.message);
        })
    }
  };

  return (
    <Container sx={{mt: 5}}>
      {/* 소제목 */}
      <Title variant='h5'>제품등록</Title>

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
            placeholder='제품명'
            value={productName}
            error={!!titleErrorMsg}
            helperText={titleErrorMsg}
            onChange={getProductName}
            inputProps={{style: {fontSize: 18}, maxLength: 20}}
            sx={{width: '100%'}}
          />
          <List>
            <ListItem sx={{userSelect: 'none', color: 'darkgrey'}}>※ 제품명은 최대 20글자까지 가능합니다.</ListItem>
          </List>
        </Box>

        {/* 이미지 추가, 카테고리 선택 */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(46, 125, 50, 0.5)',
          pr: 1,
          pl: 1
        }}>
          <ButtonBox>
            {/* 숨김 input */}
            <label ref={repPhotoInputRef} htmlFor='inputRepPhoto' onChange={getRepProductImage}>
              <input className='productInput' type='file' id='inputRepPhoto' accept='image/*'
                     onClick={(e: any) => e.target.value = null}/>
            </label>

            <label ref={photoInputRef} htmlFor='inputPhoto' onChange={getProductImage}>
              <input className='productInput' type='file' id='inputPhoto' multiple accept='image/*'
                     onClick={(e: any) => e.target.value = null}/>
            </label>

            <label ref={gradeInputRef} htmlFor='inputGrade' onChange={getStandardImage}>
              <input className='productInput' type='file' id='inputGrade' multiple accept='image/*'
                     onClick={(e: any) => e.target.value = null}/>
            </label>

            {/* 보여지는 button */}
            <EditButton name='대표 제품 이미지 추가' onClick={() => selectInput(repPhotoInputRef)}/>
            <EditButton name='제품 이미지 추가' onClick={() => selectInput(photoInputRef)}/>
            <EditButton name='규격 이미지 추가' onClick={() => selectInput(gradeInputRef)}/>
          </ButtonBox>

          <TotalBox>
            <List sx={{maxWidth: '100%'}}>
              <ListItem sx={{userSelect: 'none', color: 'darkgrey', width: '100%'}}>
                ※ 중분류 카테고리를 선택해 주세요.
              </ListItem>
            </List>

            {/* 중분류 카테고리 */}
            <Box sx={{flex: 1}}>
              <ProductCategorySelect
                category={productMiddleCategories}
                defaultCategory={currentProductMiddleCategoryName}
                getCategory={getMiddleCategory}/>
            </Box>
          </TotalBox>
        </Box>

        <List>
          <ListItem sx={{userSelect: 'none', color: 'darkgrey'}}>※ 대표 이미지는 필수입니다.</ListItem>
        </List>

        {/* 미리보기 */}
        <Box sx={{p: 2, borderBottom: '1px solid rgba(46, 125, 50, 0.5)',}}>
          {/* 제품 설명 */}
          <TextField
            placeholder='제품 설명'
            multiline
            rows={5}
            autoComplete='off'
            value={description}
            onChange={getDescription}
            inputProps={{style: {fontSize: 18}}}
            sx={{width: '100%', mb: 2, overflow: 'auto'}}
          />

          {/* 대표 제품 이미지 미리보기 */}
          {representativeImage.path &&
            <FormControl error={!!repImgErrorMsg} sx={{width: '100%'}}>
              <FormHelperText sx={{fontSize: 12}}>{repImgErrorMsg}</FormHelperText>
              <Container
                sx={{
                  border: '1.8px solid lightgrey',
                  borderRadius: 1,
                  mb: 2,
                  height: 250,
                  display: 'flex',
                  flexWrap: 'wrap',
                  overflow: 'auto',
                  alignItems: 'center'
                }}>
                <Box sx={{width: '23%', m: 1}}>
                  <img src={representativeImage.path} alt='대표 제품 이미지' width='100%'/>
                </Box>
              </Container>
            </FormControl>
          }

          {/* 제품 이미지 미리보기 */}
          {productImages.length > 0 &&
            <Container
              sx={{
                border: '1.8px solid lightgrey',
                borderRadius: 1,
                mb: 2,
                height: 250,
                display: 'flex',
                flexWrap: 'wrap',
                overflow: 'auto',
                alignItems: 'center'
              }}>
              {productImages.map((item, index: number) => (
                <Box key={index} sx={{width: '23%', m: 1}}>
                  <Box sx={{textAlign: 'end'}}>
                    <ClearRoundedIcon
                      onClick={() => deleteProductImage(index)}
                      sx={{color: 'darkgreen', cursor: 'pointer'}}/>
                  </Box>
                  <img src={item.path} alt='제품 이미지' width='100%'/>
                </Box>
              ))}
            </Container>
          }

          {/* 규격 이미지 미리보기 */}
          {standardImages.length > 0 &&
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
              {standardImages.map((file: { file: string, path: string }, index) => (
                <Box key={index} sx={{width: '23%', m: 1}}>
                  <Box sx={{textAlign: 'end'}}>
                    <ClearRoundedIcon
                      onClick={() => deleteStandardImage(index)}
                      sx={{color: 'darkgreen', cursor: 'pointer'}}/>
                  </Box>
                  <img src={file.path} alt='규격 이미지' width='100%'/>
                </Box>
              ))}
            </Container>
          }

          <FormControl error={!!fileErrorMsg} sx={{width: '100%'}}>
            {/* 파일 업로드 (다운로드 가능한 자료) */}
            <Stack direction='column' spacing={2}>
              {docFiles.map((item, index: number) => (
                <Stack key={item.id} direction='row' spacing={1} sx={{alignItems: 'center'}}>
                  <TextField
                    size='small'
                    placeholder='파일 이름'
                    autoComplete='off'
                    value={item.type}
                    onChange={event => getProductDocType(item.id, event.target.value)}
                    inputProps={{style: {fontSize: 16}}}/>
                  <Typography sx={{
                    pl: 2,
                    height: 40,
                    width: '100%',
                    border: '1.8px solid lightgrey',
                    borderRadius: 1,
                    color: 'darkgrey',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {item.originalFilename}
                    {
                      item.originalFilename ?
                        <ClearRoundedIcon
                          onClick={() => deleteProductDoc(item.id)}
                          fontSize='small'
                          sx={{ml: 1, cursor: 'pointer'}}/> :
                        '파일'
                    }
                  </Typography>
                  <label
                    className='fileUploadButton'
                    htmlFor={`inputFile${item.id}`}
                    onChange={event => getProductDoc(item.id, event)}
                    onClick={(e: any) => e.target.value = null}>
                    업로드
                    <input className='productInput' type='file' id={`inputFile${item.id}`}/>
                  </label>

                  <Button
                    onClick={() => deleteProductDocUploadButton(index)}
                    sx={{color: 'darkgreen'}}>
                    <DeleteIcon/>
                  </Button>
                </Stack>
              ))}
              <FormHelperText sx={{fontSize: 12}}>{fileErrorMsg}</FormHelperText>

              <Button
                onClick={addProductDocUploadButton}
                sx={{color: 'rgba(46, 125, 50, 0.5)', '&: hover': {backgroundColor: 'rgba(46, 125, 50, 0.1)'}}}
              >
                파일 추가
              </Button>
            </Stack>
          </FormControl>
        </Box>
      </Box>

      <Spacing/>

      {/* 버튼 */}
      <Spacing sx={{textAlign: 'center'}}>
        <EditButton name='작성완료' onClick={postMiddleProductCategory}/>
        <EditButton name='취소' onClick={openCancelProductForm}/>
      </Spacing>

      {/* 취소 버튼 Dialog */}
      <CancelModal
        openState={cancelProductForm}
        title='작성 취소'
        text1='작성중인 내용이 사라집니다.'
        text2='취소하시겠습니까?'
        yesAction={() => {
          closeCancelProductForm();
          navigate(-1);
        }}
        closeAction={closeCancelProductForm}/>
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
})) as typeof Typography;

const ButtonBox = styled(Box)(({theme}) => ({
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column'
  },
  flex: 0.5
})) as typeof Box;

const TotalBox = styled(Box)(({theme}) => ({
  [theme.breakpoints.down('md')]: {
    width: '40%'
  },
  display: 'flex',
  flexWrap: 'wrap',
  flex: 0.5,
  margin: 10
})) as typeof Box;