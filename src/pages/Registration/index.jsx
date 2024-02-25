import { useSnackbar } from 'notistack';
import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { fetchRegister } from '../../redux/slices/auth';

import styles from './Login.module.scss';

export const Registration = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { isLoading, userData } = useSelector(state => state.auth);
  const isAuth = Boolean(userData);
  const {
    register,
    handleSubmit,
    setError,
    formState: {
      errors,
      isValid
    }
  } = useForm({
    defaultValues: {
      email: 'test@mail.com',
      password: '12345',
      name: 'test user'
    },
  });

  const onSubmit = async (values) => {
    try {
      const { payload } = await dispatch(fetchRegister(values));

      if (!payload) throw new Error("Payload is empty.");

      if (payload.hasOwnProperty('errorMessage')) {
        enqueueSnackbar(payload.errorMessage, { variant: 'error' });
        return;
      }

      if (payload.hasOwnProperty('errors')) {
        payload.errors.forEach(({ path, msg }) => setError(path, { message: msg }))
        return;
      }

      if (payload.hasOwnProperty('token')) {
        window.localStorage.setItem('token', payload.token);
        enqueueSnackbar('Регистрация прошла успешно.', { variant: 'success' });
      }
    } catch (err) {
      enqueueSnackbar('Не удалось зарегистрироваться.', { variant: 'error' });
      console.log(err);
    }
  };

  if (isAuth) {
    return (<Navigate to="/" />);
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{
          width: 100,
          height: 100
        }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="Имя"
          fullWidth
          error={Boolean(errors.name?.message)}
          helperText={errors.name?.message}
          {...register('name', { required: 'Введите имя' })}
        />
        <TextField
          className={styles.field}
          label="E-Mail" fullWidth
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', { required: 'Введите почту' })}
        />
        <TextField
          className={styles.field}
          label="Пароль"
          fullWidth
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Введите пароль' })}
        />
        <Button disabled={!isValid || isLoading} type="submit" size="large" variant="contained" fullWidth>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
