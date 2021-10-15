import { Modal, App, Editor } from 'obsidian';
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
		/* const lastCMEditor = plugin.cmEditors[plugin.cmEditors.length - 1]
		const { line } = lastCMEditor.getCursor(); */

		//create append button here to have possibility to pass arguments to function
		let addButton = contentEl.createEl("button", { text: "add" });
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

			//replace strings
			/* lastCMEditor.replaceRange(
				newContactText,
				{ ch: startIndex, line },
				{ ch: startIndex + matchLength, line }) */
			this.close();
		});



		this.open();
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