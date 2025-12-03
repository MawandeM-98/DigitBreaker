//--------------------------------------------------------------------
// Generate 4-digit random PIN with no repeating digits
//--------------------------------------------------------------------
function generatePin() {
  const digits = [];
  
  while (digits.length < 4) {
    let num = Math.floor(Math.random() * 10);
    if (!digits.includes(num)) digits.push(num);
  }

  return digits;
}

let secretPin = generatePin();
console.log("Generated PIN (for debugging):", secretPin);

const inputs = document.querySelectorAll(".digit");
const submitBtn = document.getElementById("submitGuess");
const resultsDiv = document.getElementById("results");
const finalResult = document.getElementById("finalResult");

// Restrict input to numbers only
inputs.forEach(inp => {
  inp.addEventListener("input", () => {
    inp.value = inp.value.replace(/\D/, ""); 
  });
});

// Handle Guess Submission
submitBtn.addEventListener("click", () => {
  const guess = Array.from(inputs).map(i => parseInt(i.value));

  if (guess.some(isNaN)) {
    alert("Please enter all 4 digits.");
    return;
  }

  const row = document.createElement("div");
  row.classList.add("result-row");

  let correctPositions = 0;

  guess.forEach((num, index) => {
    const box = document.createElement("div");
    box.classList.add("box");

    if (num === secretPin[index]) {
      box.classList.add("green");
      correctPositions++;
    } else if (secretPin.includes(num)) {
      box.classList.add("orange");
    } else {
      box.classList.add("red");
    }

    row.appendChild(box);
  });

  resultsDiv.appendChild(row);

  // Check Win/Lose
  if (correctPositions === 4) {
    finalResult.textContent = "You guessed correctly! Score: 100%";
  }
});
  
//--------------------------------------------------------------------
// Nav toggling (Game <-> Instructions)
//--------------------------------------------------------------------
const gameBtn = document.getElementById("gameBtn");
const instructionsBtn = document.getElementById("instructionsBtn");
const gameSection = document.getElementById("gameSection");
const instructionsSection = document.getElementById("instructionsSection");

gameBtn.addEventListener("click", () => {
  gameBtn.classList.add("active");
  instructionsBtn.classList.remove("active");
  gameSection.classList.remove("hidden");
  instructionsSection.classList.add("hidden");
});

instructionsBtn.addEventListener("click", () => {
  instructionsBtn.classList.add("active");
  gameBtn.classList.remove("active");
  gameSection.classList.add("hidden");
  instructionsSection.classList.remove("hidden");
});
