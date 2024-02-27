import { useSnackbar } from 'notistack';
import React, { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import axios from '../../axios';
import styles from './AddNews.module.scss';

export const AddNews = ({ isEditing = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setLoading] = useState(false);
  const inputFileRef = useRef(null);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: { text: '' }
  });

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/uploads', formData);
      setImageUrl(data.url);
    } catch (err) {
      console.log(err);
      enqueueSnackbar('Ошибка при загрузке файла.', { variant: 'error' });
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const getNews = async () => {
    try {
      const { data } = await axios.get(`/news/${id}`);
      setImageUrl(data.imageUrl)
      setValue('text', data.text);
      setValue('title', data.title);
      setValue('tags', data.tags.join(', '));
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const fields = { ...values, imageUrl };

      const { data } = isEditing
        ? await axios.patch(`/news/${id}`, fields)
        : await axios.post('/news', fields);

      const _id = isEditing ? id : data._id;

      navigate(`/news/${_id}`);
      enqueueSnackbar(isEditing ? 'Новость изменена.' : 'Новость создана.', { variant: 'success' });
    } catch (err) {
      if (err.response?.data.hasOwnProperty('errors')) {
        err.response.data.errors.forEach(({ path, msg }) => setError(path, { message: msg }));
      } else {
        console.log(err);
        enqueueSnackbar('Ошибка при создании статьи.', { variant: 'error' });
      }
    }
    setLoading(false);
  };

  const options = React.useMemo(() => ({
    spellChecker: false,
    maxHeight: '400px',
    autofocus: true,
    placeholder: 'Введите текст...',
    status: false,
    autosave: {
      enabled: true,
      delay: 1000,
      uniqueId: 'simple-mde',
    },
  }), [],);

  useEffect(() => {
    if (id) getNews();
  }, []);

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large" style={{ marginRight: 10 }}>
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (<>
        <Button variant="contained" color="error" onClick={onClickRemoveImage} >
          Удалить
        </Button>
        <img className={styles.image} src={`${process.env.REACT_APP_API_URL}${imageUrl}`} alt="Uploaded" style={{ marginTop: 10}} />
      </>)}
      <br />
      <br />
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          classes={{ root: styles.title }}
          variant="standard"
          placeholder="Заголовок статьи..."
          error={Boolean(errors.title?.message)}
          helperText={errors.title?.message}
          {...register('title', { required: 'Введите заголовок статьи.' })}
          fullWidth
        />
        <TextField
          classes={{ root: styles.tags }}
          variant="standard"
          placeholder="Тэги"
          fullWidth
          error={Boolean(errors.tags?.message)}
          helperText={errors.tags?.message}
          {...register('tags')}
        />
        <Controller
          control={control}
          name="text"
          render={({ field }) => (
            <SimpleMDE className={styles.editor} options={options} {...field} />
          )}
        />
        <div className={styles.buttons}>
          <Button type="submit" disabled={isLoading} size="large" variant="contained">
            {isEditing ? 'Сохранить' : 'Опубликовать'}
          </Button>
          <Link to="/">
            <Button size="large">Отмена</Button>
          </Link>
        </div>
      </form>
    </Paper>
  );
};
