const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the UI from /public (index.html will load at "/")
app.use(express.static(path.join(__dirname, "public")));

app.get("/calculate", (req, res) => {
  const { num1, num2, operation } = req.query;

  const a = Number(num1);
  const b = Number(num2);

  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return res.status(400).send("Please provide valid numbers: num1 and num2");
  }

  let result;
  switch (operation) {
    case "add":
      result = a + b;
      break;
    case "subtract":
      result = a - b;
      break;
    case "multiply":
      result = a * b;
      break;
    case "divide":
      if (b === 0) return res.status(400).send("Cannot divide by zero");
      result = a / b;
      break;
    default:
      return res.status(400).send("Invalid operation. Use: add, subtract, multiply, divide");
  }

  return res.json({ num1: a, num2: b, operation, result });
});

// IMPORTANT: remove the old app.get("/") welcome route if you had it.
// With express.static, "/" will serve public/index.html automatically.

app.listen(PORT, () => {
  console.log(`Calculator app running on http://localhost:${PORT}`);
});
