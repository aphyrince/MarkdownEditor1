// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { Options } from "./global";

contextBridge.exposeInMainWorld("electronAPI", {
    showOpenDialog: (opts: Options) =>
        ipcRenderer.invoke("show-open-dialog", opts),
    readFile: (path: string) => ipcRenderer.invoke("read-file", path),
    saveFile: (data: { filePath: string; content: string }) =>
        ipcRenderer.invoke("save-file", data),
});
