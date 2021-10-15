import { Modal, App, Editor, Setting } from 'obsidian';
import ContactsPlugin from "./main";

export default class ContactsModal extends Modal {
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

		let inputNames = [];

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

		//create append button here to have possibility to pass arguments to function
		const addButton = this.createAddButton();
		
		addButton.addEventListener("click", () => {
			const form = document.getElementById("contactsModalForm") as HTMLFormElement;
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
			this.close();
		});



		this.open();
	}

	createAddButton():Element {
		return this.contentEl.createEl("button", { text: "add" });
	}

	onOpen() {
		const form = document.getElementById("contactsModalForm") as HTMLFormElement;
		(form.firstElementChild as HTMLElement).focus();
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}