import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import Users from "../components/Users";
import { Preloader } from "../lib/PreloadContext";
import { getUsers } from "../modules/users";

const UsersContainer = () => {
    const users = useSelector((state) => state.users.users);
    const dispatch = useDispatch();

    useEffect(() => {
        if (users) return; // users가 이미 유효하다면 요청하지 않는다. 
        dispatch(getUsers());
    }, [dispatch, users]);

    return (
        <>
            <Users users={users} />
            <Preloader resolve={() => dispatch(getUsers)} />
        </>
    );
};
export default UsersContainer;