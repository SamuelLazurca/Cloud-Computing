const log = {
    info: (info) => {
        console.log("INFO: " + info);
    },
    warning: (warning) => {
        console.log("WARNING: " + warning);
    },
    error: (error) => {
        console.log("ERROR: " + error);
    }
}

module.exports = {log}