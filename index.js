const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');

const Manager = require('./lib/Manager');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern'); 



//const writeFileAsync = util.promisify(fs.writeFile);
const generateHTML = require('./src/generateHTML');

// builds the object array that contains all of the employees. 
const team = []; 

//fires the addEmployee function
const addEmployee = () => {
    return inquirer.prompt ([

        {
            type: 'list',
            name: 'role',
            message: "Please choose your employee's role",
            choices: ['Engineer', 'Intern', 'Manager']
        },
        {
            type: 'input',
            name: 'name',
            message: "What's the name of the employee?", 
        },
        {
            type: 'input',
            name: 'id',
            message: "Please enter the employee's ID.",
        },
        {
            type: 'input',
            name: 'email',
            message: "Please enter the employee's email.",
        },
        {
            type: 'input',
            name: 'github',
            message: "Please enter the employee's github username.",
            when: (input) => input.role === "Engineer",
        },
        {
            type: 'input',
            name: 'officeNumber',
            message: "What is the office number?",
            when: (input) => input.role === "Manager",
        },
        {
            type: 'input',
            name: 'school',
            message: "Please enter the intern's school",
            when: (input) => input.role === "Intern",
        },
        {
            type: 'list',
            name: 'addMore',
            message: 'Would you like to add more team members?',
            choices: ['Yes','No']
        }
    ])
    .then(employeeData => {
        // data for employee types 
        //pulls data for managers, engineers, and interns. 

        let { name, id, email, role, github, school, addMore, officeNumber } = employeeData; 
        let employee; 

        if (role === "Engineer") {
            employee = new Engineer (name, id, email, github);

        } else if (role === "Intern") {
            employee = new Intern (name, id, email, school);

        } else if (role === 'Manager'){
            employee = new Manager (name,id, email, officeNumber)

        }

        team.push(employee); 

        if (addMore == 'Yes') {
            return addEmployee(team); 
        } else {
            return team;
        }
    })

};


// function to generate HTML page file using file system 
const writeFile = data => {
    fs.writeFile('./dist/index.html', data, err => {
        // if there is an error 
        if (err) {
            console.log(err);
            return;
        // when the profile has been created 
        } else {
            console.log("team profile created! Please view index.html")
        }
    })
}; 

//This fires the add employee function when app is called.
addEmployee()
    //promise returns team data to pass into HTML generator. 
  .then(team => {
    return generateHTML(team);
  })
   //promise returns HTML array to write file. 
  .then(pageHTML => {
    return writeFile(pageHTML);
  })
  //if an error occurs, print it to the console. 
  .catch(err => {
 console.log(err);
  });