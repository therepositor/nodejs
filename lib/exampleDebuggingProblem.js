/*
* Library that demonstartes something throwing when it init() is called
*
*/
// container for the module
const example = {};

// Init function
example.init = () => {
    // This is an error created intentionally (bar is not defined)
    const foo = bar;
}




// export the module
module.exports = example