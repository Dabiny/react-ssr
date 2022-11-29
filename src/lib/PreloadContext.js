import { createContext, useContext } from "react";
// PreloadContext는 ssr하는 과정에서 처리해야할 작업들을 실행하고, 기다려야하는 프로미스가 있다면 프로미스 수집. 
// 수집된 프로미스들이 끝날때까지 기다렸더가 그 다음에 다시 렌더링하면 데이터가 채워진 상태로 컴포넌트들이 나타나게된다. 

// 클라이언트 환경: null
// 서버 환경: { done: false, promises: [] }
const PreloadContext = createContext(null); // 전역관리 공간생성.
export default PreloadContext;

// 인자 resolve는 함수타입이다. 
export const Preloader = ({ resolve }) => {
    // 저장공간을 선택하기 
    const preloadContext = useContext(PreloadContext);
    // 만약 preloadContext가 널이라면(없다면)
    if (!preloadContext) return null;
    if (preloadContext.done) return null; /// 이미 작업이 끝낫다면 아무것도 하지 않음

    // promises 배열에 프로미스 등록
    // 설령 resolve함수가 프로미스를 반환하지 않더라도, 프로미스를 취급하기 위해 
    // Promise.resolve함수 사용. (new Promise와 같음.(받아온 인자콜백함수))
    preloadContext.promises.push(Promise.resolve(resolve()));
    return null;
}

// ⭐️ 커스텀 훅함수 만들어버리기 
export const usePreloader = resolve => {
    const preloadContext = useContext(PreloadContext);
    if(!preloadContext) return null;
    if(preloadContext.done) return null;
    preloadContext.promises.push(Promise.resolve(resolve()));
};
