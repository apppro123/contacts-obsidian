# Obsidian Contacts Plugin

## Installation
1. Go to you vault and go into the .obsidian (hidden) folder. 
2. Go to the plugins folder and create a new folder named e.g. obsidian-contacts.
3. Copy the main.js, manifest.json and styles.css files in your newly created folder.
4. Open your vault.
4.1 Enable community plugins.
4.2 Enable contacts plugin.

## Usage
Open the commands menu and search for "contact". There you can add a new contact or edit the current contact fields (doesn't overwrite the old one yet, but writes a new entry/text in the file).

## Settings
At the moment you have some default fields and new ones can be added.
Fields can not be deleted in  the settings again. (You could do it in your plugins > obsidian-contacts folder manually by deleting entries in the data.json  file)

## Settings
No customizable settings yet

## Ideas & Improvements
All help is welcome, be it regarding features or code!

## Shoutout
I want to thank [obsidian](https://obsidian.md/) for the great platform and the other plugin (creators) where I got some inspiration especially in the early stages of obsidian plugin developement. 

Especially thanks to the creators/maintainers of the [Text Expander Plugin](https://github.com/akaalias/text-expander-plugin) where I got the idea/code for the string trigger/replacement :)

## (still) ToDo
- overwrite contact when editing
- add more options to settings
- implement testing
- CSV (file) for easy export/import to/from other applications

### settings
- open modal with key shortcut

### data structure for storing/presenting in obsidian
- one file per contact
- at the top should be a #contact
- other fields should start with a #[name of this field] [content of this field]
  - e.g. #firstname George

