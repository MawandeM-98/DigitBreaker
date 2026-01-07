// script.js
document.addEventListener('DOMContentLoaded', function() {
  // Game state variables
  let secretPin = [];
  let attempts = 0;
  const maxAttempts = 4;
  let gameActive = false;
  let gameEnded = false;
  let playerName = '';
  let playerSurname = '';
  
  // DOM Elements
  const gameSection = document.getElementById('gameSection');
  const instructionsSection = document.getElementById('instructionsSection');
  const gameBtn = document.getElementById('gameBtn');
  const instructionsBtn = document.getElementById('instructionsBtn');
  const digitInputs = document.querySelectorAll('.digit');
  const submitBtn = document.getElementById('submitGuess');
  const resetBtn = document.getElementById('resetGame');
  const startBtn = document.getElementById('startGame');
  const resultsContainer = document.getElementById('results');
  const finalResult = document.getElementById('finalResult');
  const attemptCount = document.getElementById('attemptCount');
  const firstNameInput = document.getElementById('firstName');
  const surnameInput = document.getElementById('surname');
  const pinBoxes = document.querySelectorAll('.digit-box');
  
  // Tab switching functionality
  gameBtn.addEventListener('click', () => {
    gameSection.classList.remove('hidden');
    instructionsSection.classList.add('hidden');
    gameBtn.classList.add('active');
    instructionsBtn.classList.remove('active');
  });
  
  instructionsBtn.addEventListener('click', () => {
    instructionsSection.classList.remove('hidden');
    gameSection.classList.add('hidden');
    instructionsBtn.classList.add('active');
    gameBtn.classList.remove('active');
  });
  
  // Initialize the game
  function initGame() {
    // Generate a new secret PIN
    secretPin = generatePin();
    console.log('Secret PIN:', secretPin.join('')); // For debugging
    
    // Reset game state
    attempts = 0;
    gameActive = false;
    gameEnded = false;
    attemptCount.textContent = attempts;
    
    // Clear results
    resultsContainer.innerHTML = '';
    finalResult.textContent = '';
    finalResult.className = 'result-message';
    
    // Reset PIN display
    pinBoxes.forEach(box => {
      box.textContent = '?';
      box.classList.remove('revealed');
    });
    
    // Clear and disable digit inputs
    digitInputs.forEach(input => {
      input.value = '';
      input.disabled = true;
    });
    
    // Disable submit button
    submitBtn.disabled = true;
    
    // Reset player info if not already set
    if (!playerName || !playerSurname) {
      submitBtn.disabled = true;
      startBtn.disabled = false;
    }
  }
  
  // Generate a random 4-digit PIN with no repeating digits
  function generatePin() {
    const digits = [];
    while (digits.length < 4) {
      let num = Math.floor(Math.random() * 10);
      if (!digits.includes(num)) digits.push(num);
    }
    return digits;
  }
  
  // Start the game when player info is entered
  startBtn.addEventListener('click', () => {
    playerName = firstNameInput.value.trim();
    playerSurname = surnameInput.value.trim();
    
    if (!playerName || !playerSurname) {
      alert('Please enter both your first name and surname to start the game.');
      return;
    }
    
    // Initialize the game
    initGame();
    
    // Enable game
    gameActive = true;
    gameEnded = false;
    
    // Enable digit inputs
    digitInputs.forEach(input => {
      input.disabled = false;
    });
    
    // Enable submit button
    submitBtn.disabled = false;
    
    // Focus on first digit input
    digitInputs[0].focus();
    
    // Update attempt counter
    attemptCount.textContent = attempts;
    
    // Show player info in console for debugging
    console.log(`Game started for: ${playerName} ${playerSurname}`);
  });
  
  // Reset game functionality
  resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the game? Your current progress will be lost.')) {
      initGame();
    }
  });
  
  // Digit input handling
  digitInputs.forEach((input, index) => {
    // Allow only numeric input
    input.addEventListener('input', (e) => {
      // Remove any non-digit characters
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
      
      // Move to next input if a digit was entered
      if (e.target.value.length === 1 && index < digitInputs.length - 1) {
        digitInputs[index + 1].focus();
      }
    });
    
    // Handle backspace to move to previous input
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && input.value === '' && index > 0) {
        digitInputs[index - 1].focus();
      }
    });
  });
  
  // Submit guess functionality
  submitBtn.addEventListener('click', submitGuess);
  
  // Also allow Enter key to submit guess
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && gameActive && !gameEnded) {
      submitGuess();
    }
  });
  
  // Main game logic for submitting a guess
  function submitGuess() {
    if (!gameActive || gameEnded) return;
    
    // Get current guess
    const guess = Array.from(digitInputs).map(input => input.value);
    
    // Validate all digits are entered
    if (guess.some(digit => digit === '')) {
      alert('Please enter all 4 digits before submitting.');
      return;
    }
    
    // Convert to numbers
    const guessNumbers = guess.map(Number);
    
    // Check for duplicate digits in guess
    const uniqueDigits = new Set(guessNumbers);
    if (uniqueDigits.size < 4) {
      alert('Digits cannot repeat. Please enter 4 different digits.');
      return;
    }
    
    // Process the guess
    processGuess(guessNumbers);
  }
  
  // Process the guess and provide feedback
  function processGuess(guess) {
    attempts++;
    attemptCount.textContent = attempts;
    
    // Create result row
    const resultRow = document.createElement('div');
    resultRow.className = 'result-row';
    
    // Create result digits with color coding
    const resultDigits = [];
    
    // First pass: Check for correct digits in correct positions (green)
    const matchedPositions = new Array(4).fill(false);
    const matchedGuess = new Array(4).fill(false);
    
    for (let i = 0; i < 4; i++) {
      if (guess[i] === secretPin[i]) {
        resultDigits.push({digit: guess[i], status: 'correct'});
        matchedPositions[i] = true;
        matchedGuess[i] = true;
      } else {
        resultDigits.push(null);
      }
    }
    
    // Second pass: Check for correct digits in wrong positions (orange)
    for (let i = 0; i < 4; i++) {
      if (resultDigits[i] !== null) continue; // Already matched as correct
      
      // Check if this digit exists elsewhere in the secret PIN
      let found = false;
      for (let j = 0; j < 4; j++) {
        if (guess[i] === secretPin[j] && !matchedPositions[j] && !matchedGuess[i]) {
          resultDigits[i] = {digit: guess[i], status: 'partial'};
          matchedPositions[j] = true;
          matchedGuess[i] = true;
          found = true;
          break;
        }
      }
      
      // If not found anywhere, it's incorrect (red)
      if (!found) {
        resultDigits[i] = {digit: guess[i], status: 'incorrect'};
      }
    }
    
    // Create visual result elements
    resultDigits.forEach(result => {
      const digitElement = document.createElement('div');
      digitElement.className = `result-digit ${result.status}`;
      digitElement.textContent = result.digit;
      resultRow.appendChild(digitElement);
    });
    
    // Add result row to container
    resultsContainer.prepend(resultRow);
    
    // Clear input fields for next guess
    digitInputs.forEach(input => {
      input.value = '';
    });
    
    // Focus back to first input
    digitInputs[0].focus();
    
    // Check for win condition
    const isWin = guess.every((digit, index) => digit === secretPin[index]);
    
    // Check for game end conditions
    if (isWin) {
      endGame(true);
    } else if (attempts >= maxAttempts) {
      endGame(false);
    }
  }
  
  // End the game with win/lose state
  function endGame(isWin) {
    gameEnded = true;
    gameActive = false;
    
    // Disable inputs and submit button
    digitInputs.forEach(input => {
      input.disabled = true;
    });
    submitBtn.disabled = true;
    
    // Reveal the secret PIN
    pinBoxes.forEach((box, index) => {
      box.textContent = secretPin[index];
      box.classList.add('revealed');
    });
    
    // Display final result message
    const fullName = `${playerName} ${playerSurname}`;
    
    if (isWin) {
      finalResult.textContent = `🎉 Congratulations ${fullName}! You cracked the PIN in ${attempts} attempt${attempts > 1 ? 's' : ''}! 🎉`;
      finalResult.className = 'result-message win';
    } else {
      finalResult.textContent = `💀 Game Over ${fullName}! The PIN was ${secretPin.join('')}. Better luck next time! 💀`;
      finalResult.className = 'result-message lose';
    }
    
    // Scroll to result message
    finalResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  // Initialize the game on page load
  initGame();
});