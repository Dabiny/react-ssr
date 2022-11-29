import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import User from "../components/User";
import { usePreloader } from "../lib/PreloadContext";
import { getUser } from "../modules/users";

const UserContainer = ({ id }) => {
    const user = useSelector(state => state.users.user);
    const dispatch = useDispatch();

    //⭐️ 커스텀 훅함수 사용예시
    usePreloader(() => dispatch(getUser(id)));

    useEffect(() => {
        if(user && user.id === parseInt(id, 10)) return; // 사용자가 존재하고, id가 일치한다면 요청X
        dispatch(getUser(id));
    }, [dispatch, id, user]); // id가 바뀔때 새로 요청해야한다. 

    // 컨테이너 유효성 검사 후 return null을 해야할 경우에 null대신 Preloader 반환 (커스텀훅함수 전)
    // if (!user) {
    //     return <Preloader resolve={() => dispatch(getUser(id))} />
    // }
    //⭐️ 커스텀 함수 후
    if(!user) return null;
    return <User user={user} />
};

export default UserContainer;