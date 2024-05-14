import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const invisibleDecorationType = vscode.window.createTextEditorDecorationType({
        color: 'rgba(0,0,0,0)',
        backgroundColor: 'rgba(0,0,0,0)',
    });

    const updateDecorations = (editor: vscode.TextEditor) => {
        if (!editor) return;
        
        const regEx = /\/\/\s*HIDE_START[\s\S]*?\/\/\s*HIDE_END/g;
        const text = editor.document.getText();
        const decorations: vscode.DecorationOptions[] = [];
        let match;
        while (match = regEx.exec(text)) {
            const startPos = editor.document.positionAt(match.index);
            const endPos = editor.document.positionAt(match.index + match[0].length);
            const decoration = { range: new vscode.Range(startPos, endPos) };
            decorations.push(decoration);
        }
        editor.setDecorations(invisibleDecorationType, decorations);
    };

    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            updateDecorations(editor);
        }
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(event => {
        const editor = vscode.window.activeTextEditor;
        if (editor && event.document === editor.document) {
            updateDecorations(editor);
        }
    }, null, context.subscriptions);

    if (vscode.window.activeTextEditor) {
        updateDecorations(vscode.window.activeTextEditor);
    }
}

export function deactivate() {}
