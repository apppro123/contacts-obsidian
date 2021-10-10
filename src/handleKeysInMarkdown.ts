import * as CodeMirror from "codemirror";

import ContactsPlugin from "./main"; 

type onKeyDownHandlerType = (instance: CodeMirror.Editor, event: KeyboardEvent) => void;

export default class PatternSearchOnKeyDown { 

	private listening: boolean;

	private statusBar: HTMLElement;

	private pattern: string;

	private callback: Function;

	private stringOfCurrentLine: string;

	private codeMirrorEditor: CodeMirror.Editor;

	/* ------
		https://github.com/akaalias/text-expander-plugin/blob/main/src/main.ts of Alexis Rondeau
		built with https://codemirror.net/6/
	-------- */

	public constructor(private plugin: ContactsPlugin) {
        this.statusBar = plugin.addStatusBarItem();
    }

	public callbackOnPattern(pattern: string, callback: Function) {
		
		this.pattern = pattern; 
		this.callback = callback;
		
		this.setCodeMirrorEditor(this.checkForPattern);
	}

	private setCodeMirrorEditor = (onKeyDownHandler: onKeyDownHandlerType) => {
		this.plugin.registerCodeMirror((CodeMirrorEditor: CodeMirror.Editor) => {
			this.codeMirrorEditor = CodeMirrorEditor;
			CodeMirrorEditor.on("keydown", onKeyDownHandler);
		});
	}
	
	public readonly checkForPattern = (
		codeMirrorEditor: CodeMirror.Editor,
		keyboardEvent: KeyboardEvent
	  ): void => {
		if (this.notListeningYet()) {
		  if (this.ifNotColonEntered(keyboardEvent.key)) {

			this.setListeningIfColonAtFirstPosition(codeMirrorEditor);
		  }
		} else if (this.ifKeyEitherEnterTabSpace(keyboardEvent.key)) {
			this.setStringOfCurrentLine();

		  	this.fireCallbackIfNeeded();
		  
			this.stopListening();
		  	
		} else if (keyboardEvent.key == "Escape") {
		  this.stopListening();
		}
	  };

	  private stopListening = () => {
		this.listening = false;
		this.statusBar.setText("");
	  }

	  private fireCallbackIfNeeded = () => {
		if(this.isPatternInStringOfCurrentLine()) {
			const {pattern, stringOfCurrentLine} = this;
			const patternMatchIndex = stringOfCurrentLine.match(pattern).index;
			const patternLength = pattern.length;
			this.callback(patternMatchIndex, patternLength);
		}
	  }

	  private isPatternInStringOfCurrentLine = () => {
		const { pattern, stringOfCurrentLine } = this;
		const regex = RegExp(pattern);
		return regex.test(stringOfCurrentLine)
	  }

	  private setStringOfCurrentLine = () => {
		  const {codeMirrorEditor} = this;
		const cursor = codeMirrorEditor.getCursor();
		this.stringOfCurrentLine = codeMirrorEditor.getLine(cursor.line);
	  }

	  private ifKeyEitherEnterTabSpace = (key: string): boolean => {
		  return key == "Enter" || key == "Tab" || key == " ";
	  }

	  private ifNotColonEntered = (keyboardInput: string): boolean => (keyboardInput == ":");

	  private notListeningYet = (): boolean => !this.listening;

	  private setListeningIfColonAtFirstPosition = (codeMirrorEditor: CodeMirror.Editor): void => {
		const cursor = codeMirrorEditor.getCursor();
			const previousPosition = {
			  ch: cursor.ch - 1,
			  line: cursor.line,
			  sticky: "yes",
			};
			// cursor position between previous character and current one
			const stringPreviousToCursor = codeMirrorEditor.getRange(previousPosition, cursor);
	
			if (this.colonAtFirstPosition(stringPreviousToCursor)) {
			  this.listening = true;
			  this.statusBar.setText("I'm listening...");
			}
	  }

	  private colonAtFirstPosition = (stringPreviousToCursor: string): boolean => ([":"].contains(stringPreviousToCursor.charAt(0)));
	}