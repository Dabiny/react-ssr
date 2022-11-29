import { Route, Routes } from "react-router-dom";
import Menu from "./components/Menu";
import loadable from '@loadable/component';

const RedPage = loadable(() => import('./pages/RedPage'));
const BluePage = loadable(() => import('./pages/Bluepage'));
const UsersPage = loadable(() => import('./pages/Userspage'));

function App() {
  return (
    <div>
      <Menu />
      <hr />
      <Routes>
        <Route path="/red" element={<RedPage />} />
        <Route path="/blue" element={<BluePage />} />
        <Route path="/users/*" element={<UsersPage />} />
      </Routes>
    </div>
  );
};

export default App;
