interface Window {
    electronAPI?: {
        showOpenDialog: (opts: any) => Promise<any>;
        readFile: (p: string) => Promise<string>;
        saveFile: (d: {
            filePath: string;
            content: string;
        }) => Promise<boolean>;
    };
}

interface Options {
    properties: string[];
    filters: { name: string; extension: string[] }[];
}
