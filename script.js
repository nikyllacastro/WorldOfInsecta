// =========================
// MODAL SETUP
// =========================
const cards = document.querySelectorAll(".exhibit-card");
const modal = document.getElementById("modal");

const panelImg = document.getElementById("panel-img");
const panelTitle = document.getElementById("panel-title");

const panelLatin = document.getElementById("panel-latin");
const panelHabitat = document.getElementById("panel-habitat");
const panelDiet = document.getElementById("panel-diet");
const panelBehavior = document.getElementById("panel-behavior");

const closeBtn = document.querySelector(".close-btn");
const backBtn = document.querySelector(".back-btn");


// =========================
// 🔊 VOICE FUNCTION
// =========================
function speak(text) {
  if (!text) return;

  const speech = new SpeechSynthesisUtterance(text);

  speech.lang = "en-US";
  speech.rate = 0.95;
  speech.pitch = 1;

  // 🔥 stop previous voice (important)
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
}


// =========================
// LOAD CARD IMAGES + LABEL
// =========================
cards.forEach((card, index) => {
  const img = card.dataset.img;
  const name = card.dataset.name;

  if (img) {
    card.style.background = `url(${img}) center/cover no-repeat`;
  }

  if (!card.querySelector(".card-label")) {
    const label = document.createElement("div");
    label.classList.add("card-label");
    label.textContent = `${index + 1}. ${name || "Unknown"}`;
    card.appendChild(label);
  }
});


// =========================
// OPEN MODAL
// =========================
cards.forEach(card => {
  card.addEventListener("click", () => {

    const data = card.dataset;

    panelTitle.textContent = data.name || "Insect Name";
    panelImg.src = data.full || data.img || "";

    panelLatin.textContent = data.latin || "Scientific Name";
    panelHabitat.textContent = data.habitat || "Unknown";
    panelDiet.textContent = data.diet || "Unknown";
    panelBehavior.textContent = data.behavior || "Unknown";

    modal.classList.add("active");
    document.body.classList.add("modal-open");
  });
});


// =========================
// CLOSE MODAL
// =========================
function closeModal() {
  if (modal) modal.classList.remove("active");
  document.body.classList.remove("modal-open");

  // 🔥 stop voice kapag close
  speechSynthesis.cancel();
}

if (closeBtn) closeBtn.addEventListener("click", closeModal);
if (backBtn) backBtn.addEventListener("click", closeModal);


// =========================
// TRIVIA → INSECT FACT
// =========================
document.addEventListener("DOMContentLoaded", () => {

  const triviaCards = document.querySelectorAll(".trivia-card");
  const infoTitle = document.getElementById("answer-title");
  const infoText = document.getElementById("answer-text");

  triviaCards.forEach(card => {
    const header = card.querySelector(".trivia-header");

    if (!header) return;

    header.addEventListener("click", () => {

      const full = card.dataset.full;

      if (infoText) {
        infoText.parentElement.style.opacity = 0;

        setTimeout(() => {
          infoTitle.textContent = "INSECT FACT";
          infoText.textContent = full || "No data available.";
          infoText.parentElement.style.opacity = 1;

          // 🔊 SPEAK FACT
          speak(full);

        }, 200);
      }

    });
  });


  // =========================
  // AUTO FUN FACTS (NO STOP 
  // =========================
  const facts = [
    "Beetles make up 40 percent of all insect species.",
    "Dragonflies can fly in all directions, even backwards.",
    "Insects quietly help hold the natural world together.",
    "Did you know that you are never truly alone in nature—because insects are everywhere, quietly living in the air, soil, and spaces around you? ",
    "Ants can carry up to 50 times their body weight.",
    "Some moths don’t have mouths and live only a few days.",
    "Did you know that in their small and often unnoticed ways, insects help hold the natural world together?",
    "Some insects, like ants, can carry objects up to 50 times their body weight. That’s like a human lifting a car.",
    "Bees use the sun as a guide and perform a “waggle dance” to tell other bees exactly where food is. It’s like giving directions using dance moves.",
    "Some beetles have exoskeletons so tough they can survive being stepped on. Their outer shell acts like natural body armor.",
    "Crickets make their chirping sound by rubbing their wings together. It’s basically their way of singing, mostly to attract a mate.",
    "Flies see the world in slow motion compared to humans. That’s why it’s so hard to swat them, they react way faster than we do.", 
    "Ladybugs may look cute, but they are fierce predators that eat pests like aphids. Farmers actually love having them around.",
    "Only female mosquitoes bite humans and they do it to get protein for their eggs. Males? They just drink nectar.",
    "Cockroaches can live for weeks without their heads. They don’t rely on their brain the same way humans do."
    
  ];

  const autoText = document.getElementById("auto-text");

  if (autoText) {
    let index = 0;

    setInterval(() => {

      autoText.style.opacity = 0;

      setTimeout(() => {
        index = (index + 1) % facts.length;
        autoText.textContent = facts[index];
        autoText.style.opacity = 1;

        // 🔊 OPTIONAL: comment out if ayaw mo magsalita lagi
        // speak(facts[index]);

      }, 300);

    }, 3000);
  }

});

let fireflyInterval; 

function createFirefly() {
 
  if (!gameScreen.classList.contains("active")) return;

  const firefly = document.createElement("div");
  firefly.classList.add("firefly");

  firefly.style.top = Math.random() * window.innerHeight + "px";
  firefly.style.left = Math.random() * window.innerWidth + "px";

  firefly.style.animationDuration = (5 + Math.random() * 5) + "s";

  gameScreen.appendChild(firefly); 

  setTimeout(() => {
    firefly.remove();
  }, 10000);
}

setInterval(createFirefly, 500);


// =========================
// 🎮 GAME GLOBALS
// =========================
const gameScreen = document.getElementById("game-screen");

let score = 0;
let time = 30;
let combo = 0;
let gameInterval;
let insectInterval;
let gameCompleted = false;

// DAILY HIGH SCORE
const today = new Date().toDateString();
let savedDate = localStorage.getItem("scoreDate");
let highScore = localStorage.getItem("insectHighScore") || 0;

if (savedDate !== today) {
  highScore = 0;
  localStorage.setItem("insectHighScore", 0);
  localStorage.setItem("scoreDate", today);
}

// =========================
// 🎮 GAME MENU
// =========================
function openGameMenu() {
  gameScreen.innerHTML = `
    <div class="menu-panel">
      
        <button class="close-btn" onclick="closeGame()">✖</button>

      <h1 class="game-title">Catch the Insects 🐞</h1>

      <p class="desc">
        You have <b>30 seconds</b> to catch as many insects as possible.
      </p>

      <div class="mechanics floating-mechanics">
      <h2>Game Mechanics</h2>
      <p><b>Easy:</b> Insects move slowly, giving you more time to click and answer correctly.</p>
      
      <p><b>Medium:</b> Insects move faster and combo scoring is enabled for consecutive correct answers.</p>
      
      <p><b>Hard:</b> Includes fake items that can reduce your score if clicked incorrectly, with much faster insect movement.</p>
    </div>

      <div class="high-score">
        🏆 Today's High Score: <b>${highScore}</b>
      </div>

      <div class="difficulty-select">
        <button onclick="startGame('easy')" class="diff-btn">Easy</button>
        <button onclick="startGame('medium')" class="diff-btn">Medium</button>
        <button onclick="startGame('hard')" class="diff-btn">Hard</button>
      </div>

      <button class="close-btn" onclick="closeGame()">✖</button>
    </div>
  `;

  gameScreen.classList.add("active");
}

// =========================
// 🎮 START GAME
// =========================
function startGame(mode) {
  score = 0;
  time = 30;
  combo = 0;

  gameScreen.innerHTML = `
    <div class="game-ui">

      <button class="close-btn" onclick="closeGame()">✖</button>

      <div class="topbar">
        <span>Score: <b id="score">0</b></span>
        <span>Time: <b id="time">30</b>s</span>
        <span>Combo: <b id="combo">0</b></span>
      </div>

      <div id="game-area"></div>
    </div>
  `;

  const gameArea = document.getElementById("game-area");
  const scoreEl = document.getElementById("score");
  const timeEl = document.getElementById("time");
  const comboEl = document.getElementById("combo");

  const insects = ["🐜", "🪲", "🐞"];
  const fake = ["🍃", "💀", "🕸️"];

  let spawnSpeed = 1000;
  let insectLife = 2000;

  if (mode === "medium") {
    spawnSpeed = 700;
    insectLife = 1500;
  }

  if (mode === "hard") {
    spawnSpeed = 600;
    insectLife = 1300;
  }

  insectInterval = setInterval(() => {
    const isFake = mode === "hard" && Math.random() < 0.3;

    const el = document.createElement("div");
    el.classList.add("insect");

    el.innerText = isFake
      ? fake[Math.floor(Math.random() * fake.length)]
      : insects[Math.floor(Math.random() * insects.length)];

    const topSafeArea = 100;
    const bottomPadding = 80;

    const x = Math.random() * (window.innerWidth - 60);
    const y = topSafeArea + Math.random() * (window.innerHeight - topSafeArea - bottomPadding);

    el.style.left = x + "px";
    el.style.top = y + "px";

    el.onclick = () => {
      if (isFake) {
        score--;
        combo = 0;
      } else {
        combo++;
        score += mode === "easy" ? 1 : mode === "medium" ? 1 + combo : 2 + combo;
      }

      scoreEl.textContent = score;
      comboEl.textContent = combo;
      el.remove();
    };

    gameArea.appendChild(el);
    setTimeout(() => el.remove(), insectLife);
  }, spawnSpeed);

  gameInterval = setInterval(() => {
    time--;
    timeEl.textContent = time;

    if (time <= 0) endGame();
  }, 1000);
}

// =========================
// 🎮 END GAME
// =========================
function endGame() {
  clearInterval(gameInterval);
  clearInterval(insectInterval);

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("insectHighScore", highScore);
  }

  gameCompleted = true;
  openGameMenu();
}

// =========================
// 🎮 CLOSE GAME
// =========================
function closeGame() {
  gameScreen.classList.remove("active");
  gameScreen.innerHTML = "";

  clearInterval(gameInterval);
  clearInterval(insectInterval);

  if (gameCompleted) {
    localStorage.setItem("gamePlayed", "true");
    showAwardPrompt(); 
    gameCompleted = false;
  }
}

// =========================
// 🧠 QUIZ SYSTEM
// =========================
const quizData = [
  {
    question: "Which characteristic best explains why the desert locust becomes a major agricultural pest?",
    choices: ["It lives only in forests and feeds on insects", "It forms massive swarms that migrate long distances and consume crops", " It is a carnivore that hunts small animals", "It stays in one place and feeds only at night"],
    answer: 1
  },
  {
  question: "Which of these insects is described as a carnivore that helps control pest populations by eating aphids?",
  choices: [
    "Seven-Spotted Lady Beetle",
    "Silkworm",
    "Monarch Butterfly",
    "Desert Locust"
  ],
  answer: 0
},
{
  question: "Which insect is known for being highly social and living in colonies with a queen, workers, and drones?",
  choices: [
    "Western Honey Bee",
    "Hercules Beetle",
    "Atlas Moth",
    "American Cockroach"
  ],
  answer: 0
},
{
  question: "What does the Monarch Butterfly caterpillar primarily feed on during its larval stage?",
  choices: [
    "Other insects",
    "Milkweed",
    "Flower nectar",
    "Leaves from any tree"
  ],
  answer: 1
},
{
  question: "Which insect is known for forming massive swarms that migrate long distances and cause damage to crops?",
  choices: [
    "Leafcutter Ant",
    "Desert Locust",
    "Atlas Moth",
    "Aedes Mosquito"
  ],
  answer: 1
},
{
  question: "What do Leafcutter Ants use the leaves they collect for?",
  choices: [
    "Eating them directly",
    "Building their nests",
    "Growing fungus to eat",
    "Hiding from predators"
  ],
  answer: 2
},
{
  question: "What is the unique diet of the Leafcutter Ant compared to other insects?",
  choices: [
    "Decaying fruit and plant matter",
    "Small insects and aphids",
    "Nectar and pollen",
    "Fungus grown from collected leaves"
  ],
  answer: 3
},
{
  question: "Which of the following insects does NOT eat during its adult stage?",
  choices: [
    "Aedes Mosquito",
    "Desert Locust",
    "Atlas Moth",
    "Monarch Butterfly"
  ],
  answer: 2
},
{
  question: "Where is the natural habitat of the Hercules Beetle commonly found?",
  choices: [
    "Urban environments and households",
    "Tropical rainforests of Central and South America",
    "Deserts and semi-arid regions",
    "Gardens, farms, and grasslands"
  ],
  answer: 1
},
{
  question: "Which characteristic best describes the feeding behavior of the Aedes mosquito?",
  choices: [
    "Both males and females feed only on blood",
    "Males feed on blood while females feed on nectar",
    "Males feed on nectar while females feed on blood",
    "Both males and females feed only on plants"
  ],
  answer: 2
}
];

let quizIndex = 0;
let quizScore = 0;

function openQuiz() {
  quizIndex = 0;
  quizScore = 0;

  gameScreen.innerHTML = `
    <div class="quiz-panel">
      <button class="close-btn" onclick="closeGame()">✖</button>
      <h2 id="quiz-question"></h2>
      <div id="quiz-choices"></div>
      <p>Score: <b id="quiz-score">0</b></p>
      <p id="quiz-feedback"></p>
    </div>
  `;

  gameScreen.classList.add("active");
  loadQuestion();
}

function loadQuestion() {
  const q = quizData[quizIndex];
  document.getElementById("quiz-question").textContent = q.question;

  const choicesEl = document.getElementById("quiz-choices");
  choicesEl.innerHTML = "";

  q.choices.forEach((c, i) => {
    const btn = document.createElement("button");
    btn.textContent = c;
    btn.classList.add("quiz-btn");
    btn.onclick = () => checkAnswer(i, btn);
    choicesEl.appendChild(btn);
  });
}

function checkAnswer(selected, btn) {
  const correct = quizData[quizIndex].answer;
  const buttons = document.querySelectorAll(".quiz-btn");

  buttons.forEach(b => b.disabled = true);

  if (selected === correct) {
    quizScore++;
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
    buttons[correct].classList.add("correct");
  }

  document.getElementById("quiz-score").textContent = quizScore;

  setTimeout(() => {
    quizIndex++;
    if (quizIndex < quizData.length) loadQuestion();
    else endQuiz();
  }, 1000);
}

function endQuiz() {
  gameCompleted = true; // para counted din quiz

  gameScreen.innerHTML = `
    <div class="menu-panel">
      <button class="close-btn small" onclick="closeGame()">✖</button>

      <h1>Quiz Finished 🎉</h1>
      <p>Your Score: <b>${quizScore}/10</b></p>

      <div class="menu-actions">
        <button class="start-btn" onclick="openQuiz()">🔁 Play Again</button>
        
      </div>
    </div>
  `;
}

// =========================
// 🏆 AWARD SYSTEM
// =========================
function showAwardPrompt() {
  const old = document.querySelector(".award-prompt");
  if (old) old.remove();

  const box = document.createElement("div");
  box.className = "award-prompt";

  box.innerHTML = `
    <div class="award-box">

      <button class="close-btn small" onclick="this.parentElement.parentElement.remove()">✖</button>

      <h2>🎉 Great job!</h2>
      <p>You completed the game.</p>

      <div class="menu-actions">
        <button onclick="proceedToAward()">🏆 Proceed to Award</button>
        
      </div>

    </div>
  `;

  document.body.appendChild(box);
}


function checkCompletion() {
  const trivia = localStorage.getItem("triviaDone");
  const game = localStorage.getItem("gamePlayed");

  if (trivia && game) showCertificate("FULL");
  else if (trivia) showCertificate("TRIVIA");
}

function showCertificate(type) {
  let message = "";

  if (type === "FULL") {
    message = "🏆 INSECT MASTER!";
  } else {
    message = "🎓 INSECT EXPLORER!";
  }

  const cert = document.createElement("div");
  cert.className = "certificate-popup";

  cert.innerHTML = `
    <div class="cert-box">

      <button class="close-btn small" onclick="this.parentElement.parentElement.remove()">✖</button>

      <h1 class="cert-title">${message}</h1>
      <p class="cert-sub">Thank you for exploring the Insect Exhibit.</p>

      <div class="cert-badge">🐞</div>

      <button class="cert-btn" onclick="this.parentElement.parentElement.remove()">
        Close
      </button>

    </div>
  `;

  document.body.appendChild(cert);

  launchConfetti();
}

// 🎉 CONFETTI
function launchConfetti() {
  for (let i = 0; i < 60; i++) {
    const conf = document.createElement("div");
    conf.className = "confetti";

    conf.style.left = Math.random() * window.innerWidth + "px";
    conf.style.top = "-10px";
    conf.style.animationDuration = (2 + Math.random() * 3) + "s";

    document.body.appendChild(conf);

    setTimeout(() => conf.remove(), 5000);
  }
}

function proceedToAward() {
  document.querySelector(".award-prompt")?.remove();

  setTimeout(() => {
    checkCompletion();
    launchConfetti();
  }, 200);
}

