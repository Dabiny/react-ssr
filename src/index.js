import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import rootReducer, { rootSaga } from "./modules";
import thunk from "redux-thunk";
import createSagaMiddleware from "@redux-saga/core";
import { loadableReady } from "@loadable/component";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, window.__PRELOADED_STATE__, applyMiddleware(thunk, sagaMiddleware));
sagaMiddleware.run(rootSaga);

const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//     <Provider store={store}>
//         <BrowserRouter>
//             <App />
//         </BrowserRouter>
//     </Provider>
// );

// ⭐️chunk파일 사전에 불러올때 렌더링전에 불러오는 loadableReady사용
async function render() {
    // 프로덕션 환경에서는 loadbleReady를 호출하여 필요한 데이터가 로드될 때까지 대기한다.
    if (process.env.NOD_ENV === 'production') {
        await loadableReady();
    }
    root.render(
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    )
}
render();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
