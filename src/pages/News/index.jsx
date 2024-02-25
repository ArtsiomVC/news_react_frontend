import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from '../../axios';
import { CommentsBlock, SingleNews, TagsBlock } from '../../components';
import { fetchNews, fetchTags } from '../../redux/slices/news';
import { getUrlParamsString } from '../../utils';
import styles from './News.module.scss';

export const News = () => {
  const params = new URLSearchParams(useLocation().search)
  const sort = params.get('sort');
  const tag = params.get('tag');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { userData }  = useSelector((state) => state.auth)
  const { news, tags }  = useSelector((state) => state.news)
  const [isLoading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);

  const onChangeTabs = (e, value) => {
    if (value) {
      params.set('sort', value);
    } else {
      params.delete('sort');
    }
    navigate(`?${params.toString()}`);
  };

  const getLastComments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/comments/latest');
      setComments(data);
    } catch (err) {
      console.log(err);
      enqueueSnackbar('Ошибка при получении новости.', { variant: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    dispatch(fetchNews(getUrlParamsString({ tag, sort })));
  },[tag, sort]);

  useEffect(() => {
    dispatch(fetchTags());
    getLastComments();
  },[]);

  return (
    <>
      {tag && (
        <div className={styles.root}>
          <Typography variant="h4">
            #{tag}
          </Typography>
          <Link to="/">
            <IconButton color="secondary">
              <DeleteIcon />
            </IconButton>
          </Link>
        </div>
      )}
      <Tabs style={{ marginBottom: 15 }} value={sort} onChange={onChangeTabs}>
        <Tab label="Новые" value={null} />
        <Tab label="Популярные" value="viewsCount" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={12} md={8} item>
          {(news.isLoading ? [...Array(5)] : news.items).map((obj, index) => news.isLoading ? (
            <SingleNews id={index} isLoading={true} key={index} />
          ) : (
            <SingleNews
              id={obj._id}
              key={obj._id}
              title={obj.title}
              imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ''}
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={3}
              tags={obj.tags}
              isLoading={false}
              isEditable={userData?._id === obj.user._id}
            />))}
        </Grid>
        <Grid xs={12} md={4} item>
          <TagsBlock items={tags.items} isLoading={tags.isLoading} />
          <CommentsBlock
            items={comments}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </>
  );
};
