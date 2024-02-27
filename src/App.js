import Container from "@mui/material/Container";
import { Navigate, Route, Routes } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import { Header } from "./components";
import { PrivateRoute } from './components/PrivateRoute';
import { Registration, AddNews, Login, News, FullNews } from "./pages";

function App() {
  return (
    <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<Navigate to="/news" />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<FullNews />} />
            <Route path="/news/:id/edit" element={<AddNews isEditing />} />
            <Route path="/add-news" element={<AddNews />} />
          </Route>
          <Route path="/login" element={ <Login />} />
          <Route path="/register" element={ <Registration />} />
        </Routes>
      </Container>
    </SnackbarProvider>
  );
}

export default App;
