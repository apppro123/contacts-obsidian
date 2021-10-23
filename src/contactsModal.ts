import { Modal, App, MarkdownView } from 'obsidian';
import AlertModal from './alertModal';
import ContactsPlugin from "./main";
import { isMarkdownView, getMarkdownData } from './utils';

const LINE_BREAK = "\n";

export default class ContactsModal extends Modal {
	plugin: ContactsPlugin;

	constructor(app: App, plugin: ContactsPlugin) {
		super(app);
		this.plugin = plugin;
	}

	setEmptyContactFields() {
		//create form
		this.createForm();

		const inputNames = this.plugin.settings.contactFields;

		this.createFields(inputNames);

		//create append button here to have possibility to pass arguments to function
		this.createAddButton();
	}

	createForm() {
		const form = this.contentEl.createEl("form");
		form.id = "contactsModalForm";
	}

	createFields(names: string[], values?: string[]) {
		let { contentEl } = this;

		const form = document.getElementById("contactsModalForm") as HTMLFormElement;

		//go over inputs, create and add them to form element
		for (let i = 0; i < names.length; i++) {
			const name = names[i];
			//create element
			const newInput = contentEl.createEl("input");
			newInput.name = name;
			newInput.placeholder = name;
			if(values) {
				const value = values[i];
				newInput.value = value;
			}

			//set focus on first input
			if(i===0){
				newInput.focus();
			}
			//append all inputs/elements to form
			form.appendChild(newInput);
		}
	}

	createAddButton() {
		const addButton = this.contentEl.createEl("button", { text: "add" });
		addButton.addEventListener("click", () => {
			const form = document.getElementById("contactsModalForm") as HTMLFormElement;

			const contactFileIdentifier = "#contact";

			let newContactText = contactFileIdentifier + LINE_BREAK.repeat(2);
			
			//append values of input fields
			Object.values(form).reduce((obj,field) => { 
				const {name, value} = field;

				/* //search for headings
				if(name.startsWith("h1")){
					newContactText += "# "
				} else if(name.startsWith("h2")){
					newContactText += "## "
				} else {
					//other ideas??
					//two line breaks??
					newContactText += "- "
				} */
				const newContactTitle = "#" + name;
				const newContactValue =  value.toString();
				newContactText += newContactTitle + " " + newContactValue + LINE_BREAK; 
			}, {})
			
			this.addTextToActiveFile(newContactText);
			this.close();
		});
	}

	async addTextToActiveFile(text: string) {
        const activeView =
            this.app.workspace.getActiveViewOfType(MarkdownView);

        const editor = activeView.editor;
        const doc = editor.getDoc();
        doc.replaceSelection(text);
    }

	onOpen() {
		if(!isMarkdownView(this.app)){
			const alertModal = new AlertModal(this.app);
			alertModal.setText('Not a markdown view, cannot set contact.')
            return;
		}
		if(this.hasAlreadyContact()) {
			const viewData = getMarkdownData(this.app);
			this.setAndFillContactFields(viewData);
		}else {
			this.setEmptyContactFields();
		}
		const form = document.getElementById("contactsModalForm") as HTMLFormElement;
		(form.firstElementChild as HTMLElement).focus();
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}

	/**
	 * at the moment just tests if #contact is at the beginning of the view
	 * @returns boolean
	 */
	hasAlreadyContact() {
		// this.plugin.registerCodeMirror();
		const markdownData = getMarkdownData(this.app);
		return markdownData.trim().startsWith("#contact");
	}

	setAndFillContactFields(viewData: string) {
		const fieldsData = this.getFieldsWithValues(viewData);
		const fieldNames = fieldsData[0];
		const fieldValues = fieldsData[1];

		//create form
		this.createForm();

		this.createFields(fieldNames, fieldValues);

		//create append button here to have possibility to pass arguments to function
		this.createAddButton();
	}

	getFieldsWithValues(viewData: string): [string[], string[]] {
		const searchKeyword = "#";
		// length of string #contact
		const startIndex = 8; 
		
		let indexOccurence = viewData.indexOf(searchKeyword, startIndex);

		let fieldNames:string[] = [];
		let fieldValues: string[] = [];

		// if not found it is -1 and stops the loop
		while(indexOccurence >= 0) {
			//increment indexOccurence because I dont need # itself
			const indexNextSpace = viewData.indexOf(" ", indexOccurence+1);
			const name = viewData.substring(indexOccurence+1, indexNextSpace);
			fieldNames.push(name);

			const indexNewLine = viewData.indexOf("\n", indexNextSpace);
			let value = "";
			
			if(indexNewLine > 0) {
				value = viewData.substring(indexNextSpace+1, indexNewLine);
			} else {
				value = viewData.substring(indexNextSpace+1);
			}

			fieldValues.push(value);
			indexOccurence = viewData.indexOf(searchKeyword, indexOccurence+1);
		}
		return [fieldNames, fieldValues];
	}
	
}