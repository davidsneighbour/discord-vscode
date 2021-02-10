import { basename } from 'path';
import { TextDocument, workspace, WorkspaceConfiguration } from 'vscode';

import { KNOWN_EXTENSIONS, KNOWN_LANGUAGES } from './constants';

type WorkspaceExtensionConfigurationuration = WorkspaceConfiguration & {
	enabled: boolean;
	details_editing: string;
	details_debugging: string;
	details_idling: string;
	lower_details_editing: string;
	lower_details_debugging: string;
	lower_details_idling: string;
	lower_details_no_workspace_found: string;
	large_image: string;
	large_image_idling: string;
	small_image: string;
	suppress_notifications: boolean;
	workspace_elapsed_time: boolean;
	workspace_exclude_patterns: string[];
};

export function getConfig() {
	return workspace.getConfiguration('discord') as WorkspaceExtensionConfigurationuration;
}

export const toLower = (str: string) => str.toLocaleLowerCase();

export const toUpper = (str: string) => str.toLocaleUpperCase();

export const toTitle = (str: string) => toLower(str).replace(/^\w/, (c) => toUpper(c));

export function resolveFileIcon(document: TextDocument) {
	const filename = basename(document.fileName);
	const findKnownExtension = Object.keys(KNOWN_EXTENSIONS).find((key) => {
		if (filename.endsWith(key)) {
			return true;
		}

		const match = /^\/(.*)\/([mgiy]+)$/.exec(key);
		if (!match) {
			return false;
		}

		const regex = new RegExp(match[1], match[2]);
		return regex.test(filename);
	});
	const findKnownLanguage = KNOWN_LANGUAGES.find((key) => key.language === document.languageId);
	const fileIcon = findKnownExtension
		? KNOWN_EXTENSIONS[findKnownExtension]
		: findKnownLanguage
		? findKnownLanguage.image
		: null;

	return typeof fileIcon === 'string' ? fileIcon : fileIcon?.image ?? 'text';
}
