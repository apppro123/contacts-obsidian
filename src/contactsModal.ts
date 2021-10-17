import { Modal, App, MarkdownView } from 'obsidian';
import AlertModal from './alertModal';
import ContactsPlugin from "./main";

const LINE_BREAK = "\n";

export default class ContactsModal extends Modal {
	plugin: ContactsPlugin;

	constructor(app: App, plugin: ContactsPlugin) {
		super(app);
		this.plugin = plugin;
	}

	setContactFields() {
		let { contentEl, plugin } = this;

		//create form
		let form = contentEl.createEl("form");
		form.id = "contactsModalForm";

		const inputNames = plugin.settings.contactFields;

		//go over inputs, create and add them to form element
		for (let i = 0; i < inputNames.length; i++) {
			const placeholder = inputNames[i];
			const name = this.makeCamelCase(placeholder);
			//create element
			const newInput = contentEl.createEl("input");
			newInput.name = name;
			newInput.placeholder = placeholder;

			//set focus on first input
			if(i===0){
				newInput.focus();
			}
			//append all inputs/elements to form
			form.appendChild(newInput);
		}

		//create append button here to have possibility to pass arguments to function
		const addButton = this.createAddButton();
		
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
			
			console.log(newContactText);
			this.addTextToActiveFile(newContactText);
			this.close();
		});
	}

	makeCamelCase(stringToTransform: string) {
		stringToTransform
			.replace(/\s(.)/g, function(character: string) { return character.toUpperCase(); })
			.replace(/\s/g, '')
			.replace(/^(.)/, function(character: string) { return character.toLowerCase(); });
		return stringToTransform;
	}

	createAddButton():Element {
		return this.contentEl.createEl("button", { text: "add" });
	}

	async addTextToActiveFile(text: string) {
        const active_view =
            this.app.workspace.getActiveViewOfType(MarkdownView);
        if (active_view === null) {
            const alertModal = new AlertModal(this.app);
			alertModal.setText('No active view, cannot set contact.')
            return;
        }

        const editor = active_view.editor;
        const doc = editor.getDoc();
        doc.replaceSelection(text);
    }

	onOpen() {
		this.setContactFields();
		const form = document.getElementById("contactsModalForm") as HTMLFormElement;
		(form.firstElementChild as HTMLElement).focus();
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}