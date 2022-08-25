# Obsidian Contacts Plugin

## Usage
Open the commands menu and search for "contact". There you can add a new contact or edit the current contact fields (doesn't overwrite the old one yet, but writes a new entry/text in the file).


## Settings
No customizable settings yet

## Ideas & Improvements
All help is welcome, be it regarding features or code!

## Shoutout
I want to thank [obsidian](https://obsidian.md/) for the great platform and the other plugin (creators) where I got some inspiration especially in the early stages of obsidian plugin developement. 

Especially thanks to the creators/maintainers of the [Text Expander Plugin](https://github.com/akaalias/text-expander-plugin) where I got the idea/code for the string trigger/replacement :)

## (still) ToDo
- overwrite contact when editing
- implement testing
- CSV (file) for easy export/import to/from other applications

### settings
- open modal with key shortcut

### data structure for storing/presenting in obsidian
- one file per contact
- at the top should be a #contact
- other fields should start with a #[name of this field] [content of this field]
  - e.g. #firstname George

