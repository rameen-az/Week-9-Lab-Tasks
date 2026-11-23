// Create a file named greeting.js that exports one function named createGreeting. 
// o createGreeting should take two arguments, first and last. 
// o It should use mustache.render() with the template "Hi, {{first}} {{last}}! 
// Welcome to the server." and return the result as a string. 

function createGreeting(first, last) {
    const mustache = require('mustache');
    const template = "Hi, {{first}} {{last}}! Welcome to the server.";
    return mustache.render(template, { first: first, last: last });
}

exports.createGreeting = createGreeting;

