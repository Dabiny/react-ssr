import { Route, Routes } from "react-router-dom";
import Menu from "./components/Menu";
import BluePage from "./pages/Bluepage";
import RedPage from "./pages/Redpage";


function App() {
  return (
    <div>
      <Menu />
      <hr />
      <Routes>
        <Route path="/red" element={<RedPage />} />
        <Route path="/blue" element={<BluePage />} />
      </Routes>
    </div>
  );
};

export default App;
