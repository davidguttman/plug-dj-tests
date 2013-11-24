var accounting = require('accounting')
module.exports = function(str) {
  var whitelist = '1234567890+-/*()'.split('')
  var cleaned = str.split('').filter(function(char) {
    if ([].indexOf.call(whitelist, char) >= 0 ) { return char }
  })
  if (cleaned.length < 3) {
    return null
  }
  var result = eval(cleaned.join(''))
  return accounting.formatNumber(result)
}