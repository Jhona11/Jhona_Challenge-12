# SQL Employee Tracker
Week-12 Challenge

## Table of Contents
*  [Description](#Description)
*  [Links](#Links)
*  [Installation](#Installation)
*  [Usage-Information](#Usage-Information)

##  Description 
Developers frequently have to create interfaces that allow non-developers to easily view and interact with information stored in databases. These interfaces are called content management systems (CMS). This is a command-line application from scratch to manage a company's employee database, using Node.js, Inquirer, and PostgreSQL.

## Links

Live Screen Recording of Application Functionality: https://watch.screencastify.com/v/NsoHgYY4htjpz9e0rbrS

## Installation

1. Clone the repo: `git clone git@github.com:Jhona11/Jhona_Challenge-12.git`

2. Open in VS Code. If you do not have VS code you must install it.

3. Using the terminal, `npm install node.js`. If you have homebrew, the command should look like the following (brew install node@16), however this may vary and the documentation should be consulted.

4. Once node.js is installed, in the terminal, utilize the command `npm init -y` to initialize and create a package.json where project files will be stored.

5. Next, use the terminal to run the following commands to install the dependencies associated with this application.

`npm install inquirer@8.2.4`
`npm install pg`

6. Install PostgreSQL, if it is not already. https://www.postgresql.org/download/

7. In the PostgreSQL shell, using `psql`, run the contents of the files in this order:
* schema.sql
* department.sql
* role.sql
* employee.sql

8. To run the program, within the terminal, type the command `node index.js`.

9. Once the program is running, users can use the command line in the terminal to interact with the program.

## Usage Information

This application runs in the command line terminal. Use the arrow keys to select menu items