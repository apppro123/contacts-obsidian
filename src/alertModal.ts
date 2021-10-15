import { App, Modal } from 'obsidian';

export default class AlertModal extends Modal {

    alertMessage: string;

	constructor(app: App) {
		super(app);

	}

    setText(alertMessage: string) {
        this.alertMessage = alertMessage;
    }

	onOpen() {
		let {contentEl} = this;
		contentEl.setText(this.alertMessage);

        window.setInterval(() => this.close(), 5 * 1000);
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}
}