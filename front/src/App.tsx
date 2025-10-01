import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

export default function EditorApp() {
    const [content, setContent] = useState<string>(
        "# 새 문서\n\n내용을 입력하세요."
    );
    const [filePath, setFilePath] = useState<string | null>(null);
    const [title, setTitle] = useState<string>("");

    async function handleOpen() {
        const res = await window.electronAPI!.showOpenDialog({
            properties: ["openFile"],
            filters: [{ name: "Markdown", extensions: ["md"] }],
        });
        if (!res.canceled && res.filePaths.length > 0) {
            const p = res.filePaths[0];
            const text = await window.electronAPI!.readFile(p);
            setContent(text);
            setFilePath(p);
            // 첫 줄을 제목으로 자동 추출(선택)
            const firstLine = text.split("\n")[0].replace(/^#\s*/, "");
            setTitle(firstLine);
        }
    }

    async function handleSave() {
        if (!filePath) {
            // 저장할 파일 경로를 받아오기 위한 다이얼로그는 main에서 추가로 구현 가능.
            const res = await window.electronAPI!.showOpenDialog({
                properties: ["createDirectory", "promptToCreate"],
                buttonLabel: "저장",
            });
            // 간단화: 사용자에게 파일명 입력 UI를 만들어 저장 경로를 얻는 편이 좋음.
            return;
        }
        await window.electronAPI!.saveFile({ filePath, content });
        alert("저장되었습니다.");
    }

    async function handleExportHTML() {
        const html = `<!doctype html>
    <html><head><meta charset="utf-8"><title>${title}</title></head><body>
    ${
        /* 렌더된 마크다운을 HTML로 변환하는 간단한 방법: react-markdown 서버사이드 렌더링 등 사용 가능. 여기선 간단화 */ ""
    }
    <div id="content">${content}</div>
    </body></html>`;
        // 예시: 파일 경로가 있으면 같은 폴더에 .html로 저장
        if (filePath) {
            const out = filePath.replace(/\.md$/, ".html");
            await window.electronAPI!.saveFile({
                filePath: out,
                content: html,
            });
            alert("HTML 내보내기 완료");
        } else {
            alert("먼저 파일을 저장하세요.");
        }
    }

    return (
        <div className="main">
            <div className="editor">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목"
                    className="title"
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="textarea"
                />
                <div className="btns">
                    <button onClick={handleOpen}>열기</button>
                    <button onClick={handleSave}>저장</button>
                    <button onClick={handleExportHTML}>HTML 내보내기</button>
                </div>
            </div>
            <div className="markdown-viewer">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
}
