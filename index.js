const inquirer = require('inquirer');
const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'employee_tracker',
    password: 'Jhona1011',
    port: 5432,
});

client.connect();
const mainMenu = () => {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    }).then(answer => {
        switch (answer.action) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                client.end();
                break;
        }
    });
};
const viewDepartments = () => {
    client.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
    });
};
const viewRoles = () => {
    const query = `SELECT role.id, role.title, role.salary, department.name AS department
                   FROM role
                   JOIN department ON role.department_id = department.id`;
    client.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
    });
};
const viewEmployees = () => {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
                   CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                   FROM employee
                   JOIN role ON employee.role_id = role.id
                   JOIN department ON role.department_id = department.id
                   LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    client.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
    });
};
const addDepartment = () => {
    inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'Enter the name of the department:'
    }).then(answer => {
        client.query('INSERT INTO department (name) VALUES ($1)', [answer.name], (err, res) => {
            if (err) throw err;
            console.log(`Department ${answer.name} added successfully`);
            mainMenu();
        });
    });
};
const addRole = () => {
    client.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        const departments = res.rows.map(department => ({
            name: department.name,
            value: department.id
        }));
        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Enter the name of the role:'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Enter the salary for the role:'
            },
            {
                name: 'department_id',
                type: 'list',
                message: 'Select the department for the role:',
                choices: departments
            }
        ]).then(answer => {
            client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answer.title, answer.salary, answer.department_id], (err, res) => {
                if (err) throw err;
                console.log(`Role ${answer.title} added successfully`);
                mainMenu();
            });
        });
    });
};
const addEmployee = () => {
    client.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        const roles = res.rows.map(role => ({
            name: role.title,
            value: role.id
        }));
        client.query('SELECT * FROM employee', (err, res) => {
            if (err) throw err;
            const managers = res.rows.map(manager => ({
                name: `${manager.first_name} ${manager.last_name}`,
                value: manager.id
            }));
            managers.push({name:'none',value:0})
            inquirer.prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: 'Enter the first name of the employee:'
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'Enter the last name of the employee:'
                },
                {
                    name: 'role_id',
                    type: 'list',
                    message: 'Select the role for the employee:',
                    choices: roles
                },
                {
                    name: 'manager_id',
                    type: 'list',
                    message: 'Select the manager for the employee:',
                    choices: managers
                }
            ]).then(answer => {
                client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answer.first_name, answer.last_name, answer.role_id, answer.manager_id], (err, res) => {
                    if (err) throw err;
                    console.log(`Employee ${answer.first_name} ${answer.last_name} added successfully`);
                    mainMenu();
                });
            });
        });
    });
};
const updateEmployeeRole = () => {
    client.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        const employees = res.rows.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }));
        client.query('SELECT * FROM role', (err, res) => {
            if (err) throw err;
            const roles = res.rows.map(role => ({
                name: role.title,
                value: role.id
            }));
            inquirer.prompt([
                {
                    name: 'employee_id',
                    type: 'list',
                    message: 'Select the employee to update:',
                    choices: employees
                },
                {
                    name: 'role_id',
                    type: 'list',
                    message: 'Select the new role for the employee:',
                    choices: roles
                }
            ]).then(answer => {
                client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answer.role_id, answer.employee_id], (err, res) => {
                    if (err) throw err;
                    console.log('Employee role updated successfully');
                    mainMenu();
                });
            });
        });
    });
};
mainMenu();