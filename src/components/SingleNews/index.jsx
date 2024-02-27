import React from 'react';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRemoveNews } from '../../redux/slices/news';

import styles from './SingleNews.module.scss';
import { UserInfo } from '../UserInfo';
import { NewsSkeleton } from './Skeleton';

export const SingleNews = ({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  tags,
  isFullNews,
  isLoading,
  isEditable,
}) => {
  const dispatch = useDispatch();

  if (isLoading) {
    return <NewsSkeleton />;
  }

  const onClickRemove = () => {
    dispatch(fetchRemoveNews(id))
  };

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullNews })}>
      {isEditable && (<div className={styles.editButtons}>
          <Link to={`/news/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>)}
      <img
        className={clsx(styles.image, { [styles.imageFull]: isFullNews })}
        src={imageUrl || '/nonews.png'}
        alt={title}
      />

      <div className={styles.wrapper}>
        <UserInfo {...user} additionalText={createdAt} />
        <div className={styles.indention}>
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullNews })}>
            {isFullNews ? title : <Link to={`/news/${id}`}>{title}</Link>}
          </h2>
          <ul className={styles.tags}>
            {tags.map((name) => (<li key={name}>
                <Link to={`/news?tag=${name}`}>#{name}</Link>
              </li>))}
          </ul>
          <ul className={styles.newsDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>);
};
