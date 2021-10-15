import { App, ButtonComponent, PluginSettingTab, ReferenceCache, Setting, TextComponent } from "obsidian";
import ContactsPlugin from "./main";

import AlertModal from "./alertModal";

export interface ContactsPluginSettings {
	contactFields: Array<string>;
}

export const DEFAULT_SETTINGS: ContactsPluginSettings = {
	contactFields: ['firstname', 'lastname', 'age']
}

export class ContactsSettingTab extends PluginSettingTab {
	plugin: ContactsPlugin;

    newFieldValue: string = "";

	constructor(app: App, plugin: ContactsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Contacts plugin settings' });

        this.addContactFieldsOverview();
        this.addAddFieldButton();
		
	}

    addContactFieldsOverview (): void {
        this.addContactFieldsOverviewTitle();
        this.addContactFields();
    }

    addContactFieldsOverviewTitle ():void {
        new Setting(this.containerEl)
            .setName('contact fields')
            .setDesc('overview over the contact fields with the possibility to execute certain actions')
    }

    addContactFields ():void {
        const allContactFields = this.plugin.settings.contactFields;
        for(const contactField of allContactFields) {
            new Setting(this.containerEl)
                .addText((text: TextComponent) => {
                    text
                        .setValue(contactField)
                        .setDisabled(true)
                })
        }
    }

    addAddFieldButton (): void {
        new Setting(this.containerEl)
        .setName("Add New")
        .setDesc("Add new field for contact")
        .addText((text: TextComponent) => {
            text
                .setPlaceholder('name of new field')
                .onChange((value) => {
                    this.newFieldValue = value;
                })
        })
        .addButton((button: ButtonComponent) => {
            button
                .setTooltip("Add another field")
                .setButtonText("+")
                .setCta()   // probably Cta = call to action, so different styles
                .onClick(() => {
                    if(this.newFieldValue.trim() === "") {
                        const alertModal = new AlertModal(this.app);
                        alertModal.setText('Please fill something in input field!')
                        alertModal.open();
                        return;
                    }
                    this.plugin.settings.contactFields.push(this.newFieldValue);
                    this.plugin.saveSettings();
                    this.display();
                });
        });
    }
}