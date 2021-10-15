import { Plugin } from 'obsidian';
import { ContactsPluginSettings, DEFAULT_SETTINGS, ContactsSettingTab } from './settings';
/* import PatternSearchOnKeyDown from './handleKeysInMarkdown';

import ContactsModal  from './contactsModal';

const CONTACT_PATTERN = "::contact"; */

export default class ContactsPlugin extends Plugin {

	settings: ContactsPluginSettings;

	async onload() {

		this.loadSettings();

		/*
		const patternSearchOnKeyDown = new PatternSearchOnKeyDown(this);
		
		const contactsModal = new ContactsModal(this.app, this);
		patternSearchOnKeyDown.callbackOnPattern(CONTACT_PATTERN, contactsModal.openContactsModal);  */

		this.addSettingTab(new ContactsSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}