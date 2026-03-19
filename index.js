const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = () => {
  rl.question(">", (input) => {
    if (input === "exit") {
      rl.close();
      return;
    }

    try {
      const result = new Function(`return ${input}`)();
      console.log("Result: " + result);
    } catch (error) {
      console.log("Invalid expression.");
    }
    ask();
  });
};

ask();
