const User = ({ user }) => { //Users 컴포넌트와 다르게 유효성검사를 여기서 해주지 않음. 컨테이너에서 유효성검사실행
    const { email, name, username } = user;
    return (
        <div>
            <h1>
                {username} ({name})
            </h1>
            <p>
                <b>e-mail:</b> {email}
            </p>
        </div>
    );
};
export default User;