'use strict'

function capitalize_first (str) {
  var capitalized = str[0] ? str[0].toUpperCase() : ''
  return capitalized + str.substr(1)
}

module.exports = function to_title_case (str) {
  return str.split(' ').map(capitalize_first).join(' ')
}


