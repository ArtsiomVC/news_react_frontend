import React from 'react';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../redux/slices/auth';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';

export const Header = () => {
  const { isLoading, userData } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const token = window.localStorage.getItem('token');

  const onClickLogout = () => {
    dispatch(logout());
    window.localStorage.removeItem('token');
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/news">
            <div>NEWS</div>
          </Link>
          <div className={styles.buttons}>
            {(isLoading && token) || userData ? (
              <>
                <Link to="/add-news">
                  <Button variant="contained">Добавить новость</Button>
                </Link>
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
