const crypto = require('crypto')

function validatePassword(password, hash, salt) {

    var createdHash = crypto.pbkdf2Sync(password,salt,10000,64,'sha512').toString('hex')
    return createdHash === hash

}


function genPassword(password) {

    var salt = crypto.randomBytes(32).toString('hex')
    var hash = crypto.pbkdf2Sync(password,salt,10000,64,'sha512').toString('hex');

    return {
        salt,
        hash
    }
}


module.exports = { genPassword, validatePassword}