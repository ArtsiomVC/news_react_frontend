import Container from "@mui/material/Container";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import { Header } from "./components";
import { Registration, AddNews, Login, News, FullNews } from "./pages";
import { fetchAuthMe } from './redux/slices/auth';

function App() {
  const dispatch = useDispatch();
  const token = window.localStorage.getItem('token');

  useEffect(() => {
    token && dispatch(fetchAuthMe())
  }, []);

  return (
    <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Navigate to="/news" />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<FullNews />} />
          <Route path="/news/:id/edit" element={<AddNews isEditing />} />
          <Route path="/add-news" element={<AddNews />} />
          <Route path="/login" element={ <Login />} />
          <Route path="/register" element={ <Registration />} />
        </Routes>
      </Container>
    </SnackbarProvider>
  );
}

export default App;
