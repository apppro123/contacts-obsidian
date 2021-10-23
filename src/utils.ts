import {App, MarkdownView} from "obsidian";

export function isMarkdownView(app: App): MarkdownView {
    const { workspace } = app;
    const activeView = workspace.getActiveViewOfType(MarkdownView);
    return activeView;
}

export function getMarkdownData(app: App): string {
    const activeView =
            app.workspace.getActiveViewOfType(MarkdownView);
    return activeView.getViewData();
}

export function makeCamelCase(stringToTransform: string): string {
    stringToTransform
        .replace(/\s(.)/g, function(character: string) { return character.toUpperCase(); })
        .replace(/\s/g, '')
        .replace(/^(.)/, function(character: string) { return character.toLowerCase(); });
    return stringToTransform;
}