import { App, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface ContactsPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: ContactsPluginSettings = {
	mySetting: 'default'
}

export default class ContactsPlugin extends Plugin {

	cmEditors: CodeMirror.Editor[];

	private listening: boolean;

	private statusBar: HTMLElement;

	settings: ContactsPluginSettings;

	async onload() {
		this.loadSettings();

		this.statusBar = this.addStatusBarItem();

		this.cmEditors = [];
		this.registerCodeMirror((cm: CodeMirror.Editor) => {
			this.cmEditors.push(cm);
			cm.on("keydown", this.handleKeyDown);
		});

		/* this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		}); */

		/* this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000)); */
	}

	/* onunload() {
		console.log('unloading plugin');
	} */

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	/* ------
maybe later an idea to do it with ::contact
https://github.com/akaalias/text-expander-plugin/blob/main/src/main.ts of Alexis Rondeau
built with https://codemirror.net/6/
-------- */
	private readonly handleKeyDown = (
		cm: CodeMirror.Editor,
		event: KeyboardEvent
	  ): void => {
		if (!this.listening) {
		  if (event.key == ":") {
			// see if this is the second :
			const cursor = cm.getCursor();
			const previousPosition = {
			  ch: cursor.ch - 1,
			  line: cursor.line,
			  sticky: "yes",
			};
			const range = cm.getRange(previousPosition, cursor);
	
			if ([":"].contains(range.charAt(0))) {
				
			  this.listening = true;
			  this.statusBar.setText("I'm listening...");
			}
		  }
		} else if (event.key == "Enter" || event.key == "Tab" || event.key == " ") {
		  const cursor = cm.getCursor();
		  const { line } = cursor;
		  const lineString = cm.getLine(line);

		  //test line string
		  const pattern = "::contact";
		  const regex = RegExp(pattern);
		  if(regex.test(lineString)){
			const patternMatchIndex = lineString.match(pattern).index;
			const patternLength = pattern.length;
			new ContactsModal(this.app, this).openContactsModal(patternMatchIndex, patternLength);
		  }
	
		  this.listening = false;
		  this.statusBar.setText("");
		} else if (event.key == "Escape") {
		  this.listening = false;
		  this.statusBar.setText("");
		}
	  };
}

class ContactsModal extends Modal {
	plugin: ContactsPlugin;

	constructor(app: App, plugin: ContactsPlugin) {
		super(app);
		this.plugin = plugin;
	}

	openContactsModal(startIndex: number, matchLength: number) {

		let { contentEl, plugin } = this;

		//create form
		let form = contentEl.createEl("form");
		form.id = "contactsModalForm";

		//could be extended with different el like input, textarea, ...
		//f.e. inputNames = [{name: "FName", el: input}, {name: "description", el: textarea}, ...]
		let inputNames = [
			{
				name: "h1_name",
				placeholder: "name",
			},
			{
				name: "address",
				placeholder: "address",
			},
			{
				name: "mail",
				placeholder: "mail",
			},
			{
				name: "mobile",
				placeholder: "mobile",
			},
			{
				name: "h2_work",
				placeholder: "work",
			},
			{
				name: "organization",
				placeholder: "organization",
			},
		];

		//go over inputs, create and add them to form element
		for (let i = 0; i < inputNames.length; i++) {
			let {name, placeholder} = inputNames[i];
			//create element
			let newInput = contentEl.createEl("input");
			newInput.name = name;
			newInput.placeholder = placeholder;

			//set focus on first input
			if(i===0){
				newInput.focus();
			}
			//append all inputs/elements to form
			form.appendChild(newInput);
		}

		//create addButton
		const lastCMEditor = plugin.cmEditors[plugin.cmEditors.length - 1]
		const { line } = lastCMEditor.getCursor();

		//create append button here to have possibility to pass arguments to function
		let addButton = contentEl.createEl("button", { text: "add" });
		addButton.addEventListener("click", () => {
			const form:HTMLFormElement = document.forms.contactsModalForm;
			let newContactText:string = "";
			
			//append values of input fields
			Object.values(form).reduce((obj,field) => { 
				const {name, value} = field;

				//search for headings
				if(name.startsWith("h1")){
					newContactText += "# "
				} else if(name.startsWith("h2")){
					newContactText += "## "
				} else {
					//other ideas??
					//two line breaks??
					newContactText += "- "
				}
				newContactText += value.toString() + "\n"; 
			}, {})

			//replace strings
			lastCMEditor.replaceRange(
				newContactText,
				{ ch: startIndex, line },
				{ ch: startIndex + matchLength, line })
			this.close();
		});



		this.open();
	}

	onOpen() {
		document.forms.contactsModalForm.firstChild.focus();
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: ContactsPlugin;

	constructor(app: App, plugin: ContactsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Settings for my awesome plugin.' });

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue('')
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}