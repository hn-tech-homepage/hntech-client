import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {archiveApi} from '../../network/archive';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {getAllArchives} from '../../app/reducers/archiveSlice';
import {Box, Container, Stack, styled, Typography, TextField} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ArchiveItem from './archiveItem';
import EditButton from '../editButton';
import EditArchiveCategory from './editArchiveCategory';
import ArchiveCategorySelect from '../archiveCategorySelect';

interface propsType {
  errorToast: (message: string) => void
}

export default function Archives({errorToast}: propsType) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const managerMode = useAppSelector(state => state.manager.managerMode); // 관리자 모드 state
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('전체');
  const [searchContent, setSearchContent] = useState('');

  const getCategory = (event: any) => setCategory(event.target.value);

  // 자료 검색
  const getSearchArchive = () => {
    archiveApi.getSearchArchive(category === '전체' ? null : category, searchContent, 0)
      .then(res => dispatch(getAllArchives({
        archives: res.archives,
        totalPage: res.totalPages,
        currentPage: res.currentPage,
        totalElements: res.totalElements
      })))
      .catch(error => console.log(error))
  };

  const onEnterKey = (event: any) => {
    if (event.key === 'Enter') {
      getSearchArchive();
    }
  };

  const onClose = () => setOpen(false)

  return (
    <Container sx={{mt: 5}}>
      {/* 소제목 */}
      <TitleTypography variant='h5'>
        고객 자료실
      </TitleTypography>

      {/* 버튼 */}
      <Spacing sx={{height: 'max-content'}}>
        {/* 자료 검색 */}
        <SearchTotalStack direction='row' spacing={1}>
          {/* 카테고리 */}
          <SelectBox>
            <ArchiveCategorySelect getCategory={getCategory} defaultCategory={category}/>
          </SelectBox>

          <SearchStack direction='row' spacing={1}>
            <TextField
              placeholder='검색어를 입력하세요.'
              size='small'
              autoComplete='off'
              onChange={event => setSearchContent(event?.target.value)}
              onKeyUp={onEnterKey}
              sx={{width: '100%'}}/>
            <SearchIcon onClick={getSearchArchive}/>
          </SearchStack>
        </SearchTotalStack>

        {managerMode &&
          <Box sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
            <EditButton name='카테고리 수정' onClick={() => setOpen(true)}/>
            <EditButton name='글쓰기' onClick={() => navigate('/archive/form')}/>
          </Box>
        }

      </Spacing>

      {/* 자료 목록 */}
      <ArchiveItem/>

      {/* 카테고리 수정 */}
      <EditArchiveCategory errorToast={errorToast} open={open} onClose={onClose}/>
    </Container>
  )
};

const Spacing = styled(Container)(() => ({
  marginBottom: 10
})) as typeof Container;

const TitleTypography = styled(Typography)(({theme}) => ({
  [theme.breakpoints.down('md')]: {
    fontSize: 18
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: 14
  },
  padding: 1,
  marginBottom: 10,
  width: 'max-content',
  borderBottom: '3px solid #2E7D32'
})) as typeof Typography;

const SearchTotalStack = styled(Stack)(({theme}) => ({
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column'
  },
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%'
})) as typeof Stack;

const SearchStack = styled(Stack)(({theme}) => ({
  [theme.breakpoints.down('sm')]: {
    width: '80%'
  },
  width: '50%',
  alignItems: 'center'
})) as typeof Stack;

const SearchIcon = styled(SearchRoundedIcon)(({theme}) => ({
  [theme.breakpoints.down('sm')]: {
    fontSize: 28,
  },
  color: 'darkgreen',
  fontSize: 35,
  cursor: 'pointer'
}));

const SelectBox = styled(Box)(({theme}) => ({
  [theme.breakpoints.down('md')]: {
    width: '40%'
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: 10
  },
  flex: 0.5
})) as typeof Box;