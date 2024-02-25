import React from "react";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import styles from "./AddComment.module.scss";

export const Index = ({ avatarUrl, errors, onSubmit, register }) => {
  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={avatarUrl}
        />
        <div className={styles.form}>
          <form onSubmit={onSubmit}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
            error={Boolean(errors.text?.message)}
            helperText={errors.text?.message}
            {...register('text', { required: 'Введите комментарий' })}
          />
          <Button type="submit" variant="contained">Отправить</Button>
          </form>
        </div>
      </div>
    </>
  );
};
