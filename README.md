# TricksterImageGenerator

## Installation:

* Install nodejs
* Clone this repository
* Run `npm install` within the folder root

## Usage (using our example):

* Child folders of input can be used for selective generation (example: traits that don't play well with other traits can be added separately).
* Child folders of each child folder of input are added to a queue alphabetically, each of them contain files that have the quantity and name of the trait within the file name.

* Use 00_CheckMistakes.bat to make sure the quantity in each child subfolder matches the quantity in the other child subfolders
* Use 01_Generate.bat to start the generation (output folder)
* Use 02_Randomize.bat to start randomizing the previous generation (finalOutput folder)
* Use 03_FindDuplicates.bat to find duplicates from within finalOutput folder

## ToDo:

* More info soon!