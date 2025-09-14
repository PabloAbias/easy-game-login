export {};

declare global {
  interface Window {
    electronAPI: {
      closeApp: () => void;
      saveData: (key: string, value: any) => void;
      getData: (key: string) => Promise<any>;
    };
  }
}
