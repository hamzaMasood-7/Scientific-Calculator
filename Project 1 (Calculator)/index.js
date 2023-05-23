let currentValue = document.getElementById("input1");
const history = [];
const variables = {};

function delete_last() {
  let str = currentValue.value;
  currentValue.value = str.slice(0, -1);
}

function addoperand(x) {
  // currentValue = currentValue.trim();
  currentValue.value += x;
  // document.querySelector('input').value += x;
}

function delete_All() {
  currentValue.value = "";
  //document.querySelector('input1').value = "";
}

function cal() {
  //console.log(currentValue.value);
  let expression = currentValue.value.trim();
  // const ans = eval(currentValue.value);

  let ans = evaluateExpression(expression);
  // resultDisplay.innerText = "Result: " + ans.toFixed(4);
  // history.push({ expression: expression, result: result });

  history.push(currentValue.value + "=" + ans);
  console.log(ans);

  currentValue.value = ans;
  //document.querySelector("input1").value = ans;
  history_values();
}

function evaluateExpression(expression) {
  let tokens = tokenize(expression);
  let postfix = convertToPostfix(tokens);
  return evaluatePostfix(postfix);
}

function tokenize(expression) {
  let regex = /\d+(\.\d+)?|[-+*/^()]|sqrt|sin|cos|tan|\w+/g;
  return expression.match(regex);
}

function convertToPostfix(tokens) {
  let precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "^": 3,
    sqrt: 4,
    sin: 4,
    cos: 4,
    tan: 4,
  };
  let postfix = [];
  let operatorStack = [];

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];

    if (!isNaN(parseFloat(token))) {
      postfix.push(parseFloat(token));
    } else if (token === "(") {
      operatorStack.push(token);
    } else if (token === ")") {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== "("
      ) {
        postfix.push(operatorStack.pop());
      }

      if (
        operatorStack.length === 0 ||
        operatorStack[operatorStack.length - 1] !== "("
      ) {
        alert("Parenthesis Donot match");
        throw new Error("Mismatched parentheses");
        // alert("Parenthesis Donot match");
      }

      operatorStack.pop();
    } else if (token === "clear") {
    } else if (variables[token]) {
      postfix.push(variables[token]);
      console.log(variables[token]);
    } else {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== "(" &&
        precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
      ) {
        postfix.push(operatorStack.pop());
      }

      operatorStack.push(token);
    }
  }

  while (operatorStack.length > 0) {
    if (operatorStack[operatorStack.length - 1] === "(") {
      alert("Parenthesis Donot match");
      throw new Error("Parenthesis Donot match");
      // alert("Parenthesis Donot match");
    }
    postfix.push(operatorStack.pop());
  }

  return postfix;
}

function evaluatePostfix(postfix) {
  let operandStack = [];

  for (let i = 0; i < postfix.length; i++) {
    let token = postfix[i];

    if (typeof token === "number") {
      operandStack.push(token);
    } else if (token === "sqrt") {
      let operand = operandStack.pop();
      if (operand < 0) {
        throw new Error("Invalid argument for sqrt");
      }
      operandStack.push(Math.sqrt(operand));
    } else if (token === "sin") {
      let operand = operandStack.pop();
      operandStack.push(Math.sin(operand));
    } else if (token === "cos") {
      let operand = operandStack.pop();
      operandStack.push(Math.cos(operand));
    } else if (token === "tan") {
      let operand = operandStack.pop();
      operandStack.push(Math.tan(operand));
    } else {
      let operand2 = operandStack.pop();
      let operand1 = operandStack.pop();

      switch (token) {
        case "+":
          operandStack.push(operand1 + operand2);
          break;
        case "-":
          operandStack.push(operand1 - operand2);
          break;
        case "*":
          operandStack.push(operand1 * operand2);
          break;
        case "/":
          if (operand2 === 0) {
            alert("Cannot divide by 0");
            throw new Error("Division by zero");
            //alert("Cannot divide by 0");
          }
          operandStack.push(operand1 / operand2);
          break;
        case "^":
          operandStack.push(Math.pow(operand1, operand2));
          break;
        default:
          alert("Invalid operator");
          throw new Error("Invalid operator: " + token);
        // alert("Invalid operator");
      }
    }
  }

  if (operandStack.length !== 1) {
    throw new Error("Invalid expression");
    alert("Invalid expression");
  }

  return operandStack[0];
}

function history_values() {
  const arr = document.getElementById("history_content");

  let html = "";
  for (let i = 0; i < history.length; i++) {
    html +=
      "<p>" +
      history[i] +
      " <button onclick='deleteValue(" +
      i +
      ")'>Delete</button>  <button onclick='valueShow(" +
      i +
      ")'>Click</button>  </p>";
  }

  // Append the HTML representation of the array content to the HTML element
  arr.innerHTML = html;
}

function valueShow(index) {
  currentValue.value = history[index];
}

function deleteValue(index) {
  //const history = [/* Populate this array with your desired values */];

  // Remove the value at the specified index
  history.splice(index, 1);

  // Call the function to update the displayed values
  history_values();
}

function varSubmit() {
  let var1 = document.getElementById("n1").value;
  let val1 = document.getElementById("v1").value;

  if (var1 == "" || val1 == "") {
    alert("Fields cannot be empty");
  } else {
    if (variables[var1]) {
      alert("Variable already Declared.");
    } else {
      variables[var1] = parseFloat(val1);
    }
  }

  // console.log(variables);
}
