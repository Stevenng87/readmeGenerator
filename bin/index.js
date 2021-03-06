#!/usr/bin/env node

//link inquirer
const inquirer = require("inquirer");
//link FS
const fs = require("fs");
const util = require("util");

const api = require("../utils/api.js");

const generateMarkdown = require("../utils/generateMarkdown.js");
// const { async } = require("rxjs");

// array of questions for user
const questions = [
  //project / input
  {
    type: "input",
    message: "What is the name of your project?",
    name: "title",
  },
  //description / input
  {
    type: "input",
    message: "Please give a brief description of the project.",
    name: "description",
  },
  //installation / input
  {
    type: "input",
    message: "How would the user install it?",
    name: "install",
  },
  //usage
  {
    type: "input",
    message: "How are you going to use it?",
    name: "usage",
  },
  //tests
  {
    type: "input",
    message: "What are the test instructions?",
    name: "tests",
  },
  //questions
  {
    type: "input",
    message: "How should the users direct their questions?",
    name: "questions",
  },
  //credits / input
  {
    type: "input",
    message: "What is your Github username?",
    name: "credits",
    validate: function (answer) {
      if (answer.length < 1) {
        return console.log("You must enter your username.");
      }
      return true;
    },
  },
  //license / choice
  {
    type: "checkbox",
    message: "What license are you using?",
    name: "license",
    choices: ["MIT", "GPLv3", "The Unlicense"],
    validate: function (answer) {
      if (answer.length < 1) {
        return console.log("You must enter the license of your project.");
      }
      return true;
    },
  },
  {
    type: "checkbox",
    message: "What color will your button be?",
    name: "color",
    choices: ["red", "blue", "orange", "yellow"],
    validate: function (answer) {
      if (answer.length < 1) {
        return console.log("You must choose a button color.");
      }
      return true;
    },
  },
];

// function to write README file
function writeToFile(fileName, data) {
  fileName = "auto-generated-README.md";
  //populates the read me file
  fs.writeFile(fileName, data, (err) => {
    // if error, log the error
    if (err) {
      return console.log(err);
    }
    // if it works
    console.log("Success! Your document is ready for use!");
  });
}

const writeFileAsync = util.promisify(writeToFile);

async function init() {
  try {
    // catch responses
    const userResponses = await inquirer.prompt(questions);

    //make call with github api
    const userInfo = await api.getUser(userResponses);

    //pass data from inquirer and api to markdown file
    const markdownFile = await generateMarkdown(userResponses, userInfo);

    //write file
    await writeFileAsync("AUTO-README.md", markdownFile);
  } catch (error) {
    console.log(error);
    init();
  }
}

// function call to initialize program
init();
