import { Route, Routes } from "react-router-dom";
import UsersContainer from "../containers/UsersContainer"
import UserPage from "./Userpage";

const UsersPage = () => {
    return (
        <>
            <UsersContainer />
            <Routes>
                <Route path=":id" element={<UserPage />} />
            </Routes>
        </>
    )
}
export default UsersPage;