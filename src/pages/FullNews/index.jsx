import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from '../../axios';
import { CommentsBlock, Index, SingleNews } from '../../components';

export const FullNews = () => {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { userData }  = useSelector((state) => state.auth)
  const [news, setNews] = useState();
  const [isLoading, setLoading] = useState(true);
  const { register, handleSubmit,  reset, formState: { errors } } = useForm();

  const getNews = async () => {
    try {
      const { data }  = await axios.get(`/news/${id}`)
      setNews(data);
    } catch (err) {
      console.log(err)
      enqueueSnackbar('Ошибка при получении новости.', { variant: 'error' });
    }
    setLoading(false);
  }

  const addComment = async (values) => {
    try {
      const comment = await axios.post('/comments', {  newsId: id, ...values });

      const newComment = {...comment.data, user: { name: userData.name }};
      setNews(prevState => ({
        ...prevState,
        comments: [...prevState.comments, newComment]
      }));
      reset();
    } catch (err) {
      enqueueSnackbar('Не удалось добавить комментарий.', { variant: 'error' });
      console.log(err);
    }
  }

  useEffect(() => {
    getNews();
  }, []);


  if (isLoading) {
    return <SingleNews isLoading={true} isFullNews />
  };

  return (
    <>
      <SingleNews
        id={news._id}
        title={news.title}
        imageUrl={news.imageUrl ? `${process.env.REACT_APP_API_URL}${news.imageUrl}` : ''}
        user={news.user}
        createdAt={news.createdAt}
        viewsCount={news.viewsCount}
        commentsCount={3}
        tags={news.tags}
        isFullNews
      >
        <ReactMarkdown children={news.text} />
      </SingleNews>
      <CommentsBlock
        items={news.comments}
        isLoading={isLoading}
      >
        {userData && (
          <Index
            avatarUrl={userData?.avatarUrl}
            errors={errors}
            onSubmit={handleSubmit(addComment)}
            register={register}
          />
        )}
      </CommentsBlock>
    </>
  );
};
