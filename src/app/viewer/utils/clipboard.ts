export function writeTextToClipboard(text: string): Promise<void> {
    return navigator.clipboard.writeText(text);
}

export function readTextFromClipboard(): Promise<string> {
    return navigator.clipboard.readText();
}
