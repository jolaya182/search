/* *
  title: index.js 

  date: 4/30/2019

  author:  javier olaya

  description: return matching strings between two files using 3 search modes
         
  requirements:
  2. Pattern matching
   You are given two text files: (a) input.txt - a free-text document composed of 1 or more lines of text, 
   and (b) patterns.txt - a set of search strings (1 per line). Write a Javascript application (command-line or GUI) 
   that can run in three following modes:
  
  Required:
  Mode 1: output all the lines from input.txt that match exactly any pattern in patterns.txt
  Mode 2: output all the lines from input.txt that contain a match from patterns.txt somewhere in the line.
  Mode 3: output all the lines from input.txt that contain a match with edit distance <= 1 patterns.txt
  An example:
 
  input.txt
  Hello.  This is line 1 of text.
  and this is another.
  line 3 here
  the end
 
  patterns.txt
  the end
  matches
  line 3
  and this is anoother.
 
  Mode 1 outputs:
  the end
 
  Mode 2 outputs:
  line 3 here
  the end
 
  Mode 3 outputs:
  and this is another.
  the end
 */


/* define variables */

/* let the stack store all the content of the files */
let stack = [];


/* define all the functions */

/* 
  @description determines the type of search it should implement 

  @param number, string, string

  @return string

*/
function findMatches(mode, input, patterns) {
  let finalResult = "";
  mode = parseInt(mode);

  if (mode === 1) {
    finalResult = mode1(input, patterns);
  }
  else if (mode === 2) {
    finalResult = mode2(input, patterns);
  }
  else if (mode === 3) {
    finalResult = mode3(input, patterns);
  }
  return finalResult;
}

/* 
  @description does exact string matching

  @param string, string

  @return string

*/
function mode1(input, patterns) {
  //create the variables
  let result = "";
  //split the input by lines
  const inpt = input.split("\n");
  const ptrns = patterns.split("\n");
  //for every line in the pattern compare it with every line in the input
  for (let oIndx = 0; oIndx < ptrns.length; oIndx += 1) {
    for (let iIndx = 0; iIndx < inpt.length; iIndx += 1) {
      //if both lines are equal then append it to the result variable
      if (ptrns[oIndx].trim() === inpt[iIndx].trim()) result += result === "" ? ptrns[oIndx].trim() : "\n" + ptrns[oIndx].trim();
    }
  }
  // return the result
  return result;
}

/* 
  @description does string matching somewhere in the line

  @param string string

  @return string

*/
function mode2(input, patterns) {
  // same as mode1 except we are comparing substrings
  //create the variables
  let result = "";
  //split the input by lines
  const inpt = input.split("\n");
  const ptrns = patterns.split("\n");

  //for every line in the pattern compare it with every line in the input
  for (let oIndx = 0; oIndx < inpt.length; oIndx += 1) {
    for (let iIndx = 0; iIndx < ptrns.length; iIndx += 1) {
      //if both lines are equal then append it to the result variable
      if (inpt[oIndx].trim().includes(ptrns[iIndx].trim())) result += result === "" ? inpt[oIndx].trim() : "\n" + inpt[oIndx].trim();
    }
  }
  return result;
}

/* 
  @description  does string matching somewhere in the line considering an edit of distance <= 1 patterns.txt

  @param string, string 

  @return string

*/
function mode3(input, patterns) {
  // same as mode1 except we are comparing substrings
  //create the variables
  let result = "";
  let tempResult = "";
  let afterOneChance = true;
  //split the input by lines
  const inpt = input.split("\n");
  const ptrns = patterns.split("\n");

  //for every line in the pattern compare it with every line in the input
  for (let oIndx = 0; oIndx < inpt.length; oIndx += 1) {
    for (let iIndx = 0; iIndx < ptrns.length; iIndx += 1) {
      //if both lines are equal then append it to the result variable
      let longer = inpt[oIndx].trim();
      let shorter = ptrns[iIndx].trim();
      if (longer.length < shorter.length) {
        longer = ptrns[iIndx].trim();
        shorter = inpt[oIndx].trim();
      }
      if (longer.length === shorter.length) {
        if (longer.includes(shorter)) result += result === "" ? longer : "\n" + longer;
      } else if (shorter.length + 1 === longer.length) {
        for (let subInd = 0; subInd < longer.length; subInd += 1) {
          if (longer[subInd] === shorter[subInd]) {
            tempResult += longer[subInd];
          } else if (afterOneChance) {
            // (typeof longer );

            longer = longer.substring(0, subInd) + longer.substring(subInd + 1, longer.length);
            afterOneChance = false;
            subInd--;
          } else {
            tempResult = "";
            break;
          }
        }
        result += result === "" ? tempResult : tempResult == "" ? tempResult : "\n" + tempResult;
      }
    }
  }
  return result;
}

/* 
  @description onchange triggered function sending the file to be read

  @param file

*/
function handleFiles(files) {
  if (window.FileReader) {
    //check if the file reader is supported by the browser
    getAsText(files[0]);
  } else {
    alert("FileReader is not supported in this browser.");
  }
}

/* 
  @description receives from the file blob from the input tag and reads it as text, add event handlers

  @param file blob

*/
function getAsText(inPToRead) {
  let readerinP = new FileReader();
  // Read file into memory as UTF-8
  readerinP.readAsText(inPToRead);
  // handle errors load
  readerinP.onload = loadHandler;
  readerinP.onerror = errorHandler;
}

/* 
  @description saves the content text of that file for use later

  @param eventprogressive

*/
function loadHandler(inputEvent) {
  let inputTxt = inputEvent.target.result;
  // let patternTxt = patternEvent.target.result;
  stack.push(inputTxt);
}


/* 
  @description does the string matches and the selects the type of search mode display it on the 'funcResults' div

  @param event

*/
function getModeFiles(e) {
  e.preventDefault();
  if (stack.length < 2) {
    alert("please select at least 2 files");
    return;
  }
  let mode = "";
  let arrayR = document.getElementsByName("mode");
  for (let indx = 0; indx < arrayR.length; indx += 1) {
    if (arrayR[indx].checked) {
      mode = arrayR[indx].value;
      break;
    }
  }
  if (mode === "") {
    alert("please select at least one mode");
    return;
  }
  let resultFound = findMatches(mode, stack[0], stack[1]).replace("\n", "<br>");
  document.getElementById("funcResults").innerHTML = resultFound;
}

/* 
  @description send alert if no readable

*/
function errorHandler() {
  if (evt.target.error.name === "NotReadableError") {
    alert("Cannot read file !");
  }
}

/* add event handle for the form */
document.getElementById("one").addEventListener("submit", getModeFiles, false);

/** 
 *  //do a series of tests
 * let input = "Hello.  This is line 1 of text. \nand this is another. \nline 3 here \nthe end";
 * let patterns = "the end \nmatches \nline 3 \nand this is anoother.";
 * 
 * let m1 = "the end";
 * let m2 = "line 3 here\nthe end";
 * let m3 = "and this is another.\nthe end";
 * 
 * console.log("mode 1 passed: ", mode1(input, patterns) === m1);
 * console.log("mode 2 passed: ", mode2(input, patterns) === m2);
 * console.log("mode 3 passed: ", mode3(input, patterns) === m3);
*/