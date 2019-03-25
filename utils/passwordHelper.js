const bcrypt = require("bcrypt");

async function checkPassword(passwordToCheck, password) {
    return await bcrypt.compare(passwordToCheck, password);
}

async function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}

module.exports = {
    checkPassword,
    hashPassword
}
