import { useSnackbar } from 'notistack';
import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { fetchAuth, selectIsAuth } from '../../redux/slices/auth';

import styles from "./Login.module.scss";

export const Login = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const isAuth = useSelector(selectIsAuth);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid}
  } = useForm({
    defaultValues: {
      email: 'test@mail.com',
      password: '12345'
    },
  });

  const onSubmit = async (values) => {
    try {
      const { payload } = await dispatch(fetchAuth(values))

      if (!payload) throw new Error("Payload is empty.");

      if (payload.hasOwnProperty('errorMessage')) {
        enqueueSnackbar(payload.errorMessage, { variant: 'error' });
        return;
      }
      if (payload.hasOwnProperty('token')) {
        window.localStorage.setItem('token', payload.token);
      }
    } catch (err) {
      enqueueSnackbar('Не удалось авторизоваться.', { variant: 'error' });
      console.log(err);
    }
  }

  if (isAuth) {
    return <Navigate to="/" />
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', { required: 'Введите почту' })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Пароль"
          fullWidth
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Введите пароль' })}
        />
        <Button disabled={!isValid}  type="submit" size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Paper>
  );
};
