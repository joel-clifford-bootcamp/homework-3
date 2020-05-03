// Assignment Code
var generateBtn = document.querySelector("#generate");

// ASCII limits for each character type. Key corresponds to index
// value for each character class in passwordCriteria

// Special Characters 
//  Lower Case: ASCII Values 97 - 122
//  Upper Case: ASCII Values 65 - 90
//  Numberic:   ASCII Values 48 - 57

//  Special Characters:
//              ASCII Values 33 - 47, 58 - 64, 91 - 96, 123 - 126
// Note: All special characters from OSWAP Password Special Characters list included 
//       EXCEPT for space (ASCII value 32).

var asciiRanges = {
  "lower":[97,122],
  "upper":[65,90],
  "numeric":[48,57],
  "special":[[33,47],[58,64],[91,96],[123,126]]
}

var passwordLength;

// Array that will store valid characters to use when generating password
var characterPool = [];

// Array to store randomly selected characters for use in password
var passwordCharacters = [];

// Final password
var password;

// Write password to the #password input
function writePassword() {

  // Generate and store randomized password in password variable
  generatePassword();

  var passwordText = document.querySelector("#password");

  // if password was successfully generated and stored, print to 
  // element. 
  // If user cancelled the procress during criteria selection, password
  // will be empty and nothing will be printed
    passwordText.value = password;
}

function generatePassword()
{
  init();

  if(getRequirements())
  {
    populatePasswordCharArray();

    console.log(characterPool);

    setPassword();
  }
}

// Reset all varaibles
function init()
{
  passwordLength = 0;
  characterPool = [];
  passwordCharacters = [];
  password = "";
}

// Prompt user to select requirements for password
function getRequirements()
{
    // Get password length and validate based on predefined criteria
    getPasswordLength();

    // Validate password length. If Cancel was selected, exit the process
    if(passwordLength === null) return;

    // Prompt user to select character types to include. Do not proceed until at
    // least one type has been selected
    while(passwordCharacters.length === 0)
    {
      if(confirm("1. Include lowercase characters in password?")){
        characterTypeSelected("lower");
      }

      if(confirm("2. Include uppercase characters in password?")){
        characterTypeSelected("upper");
      }

      if(confirm("3. Include numbers in password?")){
        characterTypeSelected("numeric");
      }

      if(confirm("4. Include special characters in password?")){
        characterTypeSelected("special");
      }

      // If no character types are selected, present user with option to either 
      // try again or exit process
      if(passwordCharacters.length === 0){
        if(!confirm("You must select at least one character type to include. Try again?")){
          
          // Return false if user opts to exit process
          return false;
        }
      }
    }

    // Return true if all user completes process
    return true;
}

// Get and validate desired password length
function getPasswordLength()
{
  lengthString = prompt("Enter a password length (8 - 128 characters):");
  
  if(lengthString === null) 
  {
    passwordLength = null;
    return;
  }

  validateLengthInput(lengthString);

}

// Verify that user has enters a length of between 8 - 128 characters and prompt
// reentry if not.
function validateLengthInput(lengthInput)
{

  while(lengthInput !== null)
  {
    if(!isNaN(lengthInput)){
      lengthInput = parseInt(lengthInput);
      
      if(lengthInput > 7 && lengthInput < 129){  
        passwordLength = lengthInput;
        return;
      }
      else{
        lengthInput = prompt("Invalid Entry! Password length must be between 8 and 128 characters:");
      }
    }
    else{  
      lengthInput = prompt("Invalid Entry! Password length must be a number between 8 and 128 characters:");   
    }

    // If user opts to terminate the process, set passwordLength to NaN
    passwordLength = null;
  }
}

// Add selected all characers of selected type to characterPool and add a single character 
// of the selected type to passwordCharacters, guaranteeing that the final password will
// conatin at least one of each seleted character type.

// Special characters require further processing since they span several discontiguous Ascii ranges
function characterTypeSelected(characterType)
{
  if(characterType in asciiRanges){

    if(characterType === "special"){
      specialCharactersSelected()
    }
    else{

      var selectedAsciiRange = asciiRanges[characterType];

      addAsciiCharcterRangeToPool(selectedAsciiRange);

      var numberFromRange = getRandomNumber(selectedAsciiRange[1],selectedAsciiRange[0]);

      passwordCharacters.push(String.fromCharCode(numberFromRange));
    }
  }
}

// Iterate over speacial character ranges, adding the to the characterPool and a temp pool.
// Add value from temp pool to passwordCharacters.
function specialCharactersSelected(){

  var specialCharatersPool = [];

  for(i = 0; i < asciiRanges["special"].length; i++)
  {    
    var range = asciiRanges["special"][i];

    addAsciiCharcterRangeToPool(range,specialCharatersPool);
    addAsciiCharcterRangeToPool(range);

  }

  passwordCharacters.push(getRandomArrayElement(specialCharatersPool));

}

// Add all characters in a selected Ascii range to characterPool
function addAsciiCharcterRangeToPool(asciiRangeBounds, pool = characterPool){

  for(i = asciiRangeBounds[0]; i <= asciiRangeBounds[1]; i++){
    pool.push(String.fromCharCode(i));
  }

}

// Fill passwordChar array with characters, selected at random, from characterPool
function populatePasswordCharArray(){

  while(passwordCharacters.length < passwordLength){
    passwordCharacters.push(getRandomArrayElement(characterPool));
  }
}

// Generate password string by randomizing passwordCharacters array.
function setPassword(){

  while(passwordCharacters.length > 0) {
    password += getRandomArrayElement(passwordCharacters, true)
  }

}

// Given an array, return the value of the element at that array. 
// If withRemoval = true, that element is removed from the array.
function getRandomArrayElement(arr, withRemoval = false){

  var rand = getRandomNumber(arr.length)

  var arrayElement = arr[rand];

  if(withRemoval){
    passwordCharacters.splice(rand,1);
  }

  return arrayElement;
}

// Get a random number between a floor (default of 0) and a ceiling
function getRandomNumber(ceiling, floor = 0)
{
  return floor + Math.floor((ceiling - floor) * Math.random(),0)
}

// Add event listener to generate button
generateBtn.addEventListener("click", writePassword);
