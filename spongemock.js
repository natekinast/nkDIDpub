function spongeMock(str) {
  let result = ""; //create an empty string where our answer will go
  for (let i = 0; i < str.length; i++) { //loop through each character in the string
    if (i % 2 === 0) { //if index is even
      result += str[i].toUpperCase() //append uppercase version of character at index i
    } else {  // if index is odd
      result += str[i].toLowerCase() //append lowercase version of character at index i
    }
  }
  
  return result;
}
