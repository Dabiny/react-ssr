import ReactDOMServer from "react-dom/server";
import express from "express";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import path from "path";
import fs from "fs";
import { applyMiddleware, createStore } from "redux";
import rootReducer, { rootSaga } from "./modules";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import PreloadContext from "./lib/PreloadContext";
import createSagaMiddleware, { END } from "@redux-saga/core";
import { ChunkExtractor, ChunkExtractorManager } from "@loadable/server";

// 필요한 청크파일 경로 추출하기 manifest는 더이상 사용하지 않는다.
const statsFile = path.resolve("./build/loadable-stats.json");

const manifest = JSON.parse(
    fs.readFileSync(path.resolve("./build/asset-manifest.json"))
);
// function createPage(root, stateScript) {
//     return `<!DOCTIYE html>
//     <html lang="en">
//         <head>
//             <meta charset="utf-8" />
//             <link rel="shortcut icon" href="/favicon.ico" />
//             <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
//             <meta name="theme-color" content="#000000" />
//             <title>React App!</title>
//             <link href="${manifest.files["main.css"]}" rel="stylesheet" />
//         </head>
//         <body>
//             <noscript>You need to enable JavaScript to run this app.</noscript>
//             <div id="root">${root}</div>
//             ${stateScript}
//             <script src="${manifest.files["main.js"]}"></script>
//         </body>
//     </html>
//     `;
// }

function createPage(root, tags) {
    return `<!DOCTIYE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <link rel="shortcut icon" href="/favicon.ico" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <meta name="theme-color" content="#000000" />
            <title>React App!</title>
            ${tags.styles}
            ${tags.links}
        </head>
        <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root">${root}</div>
            ${tags.scripts}
        </body>
    </html>
    `;
}

const app = express();

// 서버 사이드 렌더링을 처리할 핸들러 함수.
const serverRender = async (req, res, next) => {
    // 이 함수는 404가 떠야하는 상황에 404를 띄우지 않고 서버사이드렌더링을 해준다.
    const context = {};
    const sagaMiddleware = createSagaMiddleware();
    // 랜더링을 처리할때 store 생성하기
    const store = createStore(
        rootReducer,
        applyMiddleware(thunk, sagaMiddleware)
    );
    // sagaMiddleware.run(rootSaga);
    const sagaPromise = sagaMiddleware.run(rootSaga).toPromise();

    // 전역관리 콘택스트
    const preloadContext = {
        done: false,
        promises: [],
    };

    const extractor = new ChunkExtractor({ statsFile });

    const jsx = (
        // 전역관리 컨테이너를 상단부모함수에 올려놓는다.
        // chunkExtraorManager사용하여 브라우저에서 어떤파일을 사전에 불러와야할지 알아내고 해당파일들의 경로를 추출한다.
        <ChunkExtractorManager extractor={extractor}>
            <PreloadContext.Provider value={preloadContext}>
                <Provider store={store}>
                    <StaticRouter location={req.url} context={context}>
                        <App />
                    </StaticRouter>
                </Provider>
            </PreloadContext.Provider>
        </ChunkExtractorManager>
    );

    ReactDOMServer.renderToStaticMarkup(jsx); // renderToStaticMarkUp으로 한번 렌더링을 싹해준다.
    store.dispatch(END); // redux-saga의 END액션을 발생시키면 액션을 모니터링하는 사가들이 모두 종료된다.
    try {
        await sagaPromise; // 기존 진행중이던 사가들이 모두 끝날때까지 기다린다
        await Promise.all(preloadContext.promises); // 모든 프로미스드를 기다린다. 여기서 저장된 프로미스배열을 다 실행시켜준다.
    } catch (e) {
        return res.status(500);
    }
    preloadContext.done = true;

    const root = ReactDOMServer.renderToString(jsx); // 렌더링을 하고
    const stateString = JSON.stringify(store.getState()).replace(
        /</g,
        "\\u003c"
    );
    // 리덕스 초기상태를 스크립트로 주입한다.
    const stateScript = `<script>__PRELOADED_STATE__=${stateString}</script>`;

    const tags = {
        scripts: stateScript + extractor.getScriptTags(), // 스크립트 앞부분에 리덕스상태 넣기
        links: extractor.getLinkTags(),
        styles: extractor.getStyleTags()
    };

    res.send(createPage(root, tags)); // 클라이언트에게 결과물을 응답한다.
};

const serve = express.static(path.resolve("./build"), {
    index: false, // '/'경로에서 index.html을 보여주지 않도록 설정
});
app.use(serve); // 순서가 중요하다. serverRender전에 위치해야 한다.
app.use(serverRender);

app.listen(5000, () => {
    console.log("Running to http://localhost:5000");
});
