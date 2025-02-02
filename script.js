let quizData = []; // Firebase se aane wale words & meanings store karne ke liye
let currentQuestionIndex = 0;

// ✅ Firebase Config & Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAAUg8l34-ki_lKc64_zfGB7yVwvCunAKM",
    authDomain: "qiuz-47c3f.firebaseapp.com",
    databaseURL: "https://qiuz-47c3f-default-rtdb.firebaseio.com/",
    projectId: "qiuz-47c3f",
    storageBucket: "qiuz-47c3f.firebasestorage.app",
    messagingSenderId: "371167551976",
    appId: "1:371167551976:web:4e09bd7f3408f08a41045d"
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ✅ Firebase se words fetch karna
async function fetchWords() {
    const wordsRef = ref(db, "user");
    const snapshot = await get(wordsRef);

    if (snapshot.exists()) {
        const wordsData = snapshot.val();
        quizData = Object.values(wordsData); // Array me convert karein
        console.log("✅ Quiz Data:", quizData);
    } else {
        console.log("❌ No Data Found in Firebase!");
    }
}

// ✅ Quiz Start Karne Ka Function
function startQuiz() {
    document.getElementById("quizSection").style.display = "block";
    currentQuestionIndex = 0;
    showQuestion();
}

// ✅ Question Show Karne Ka Function
function showQuestion() {
    if (currentQuestionIndex >= quizData.length) {
        document.getElementById("question").innerText = "🎉 Quiz Finished!";
        document.getElementById("options").innerHTML = "";
        document.getElementById("nextBtn").style.display = "none";
        return;
    }

    let currentQuestion = quizData[currentQuestionIndex];
    document.getElementById("question").innerText = `What is the meaning of "${currentQuestion.word}"?`;

    let optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    // ✅ Options Generate Karna (1 correct + 3 random)
    let options = generateOptions(currentQuestion.meaning);
    options.forEach(option => {
        let btn = document.createElement("button");
        btn.innerText = option;
        btn.classList.add("option-btn");
        btn.onclick = () => checkAnswer(btn, option, currentQuestion.meaning);
        optionsDiv.appendChild(btn);
    });

    document.getElementById("nextBtn").style.display = "none";
}

// ✅ Answer Check Karne Ka Function
function checkAnswer(button, selectedAnswer, correctAnswer) {
    let allButtons = document.querySelectorAll(".option-btn");

    if (selectedAnswer === correctAnswer) {
        button.style.backgroundColor = "green"; // ✅ Correct Answer Green
    } else {
        button.style.backgroundColor = "red"; // ❌ Wrong Answer Red

        // ✅ Correct Answer Show Karein
        allButtons.forEach(btn => {
            if (btn.innerText === correctAnswer) {
                btn.style.backgroundColor = "green";
            }
        });
    }

    // ✅ Next Question Button Show Karein
    document.getElementById("nextBtn").style.display = "block";

    // ✅ Disable All Buttons After Answer
    allButtons.forEach(btn => btn.disabled = true);
}

// ✅ Random Options Generate Karne Ka Function
function generateOptions(correctMeaning) {
    let options = new Set();
    options.add(correctMeaning);

    while (options.size < 4) {
        let random = quizData[Math.floor(Math.random() * quizData.length)].meaning;
        options.add(random);
    }

    return [...options].sort(() => Math.random() - 0.5); // ✅ Shuffle Options
}

// ✅ Next Question Function
function nextQuestion() {
    currentQuestionIndex++;
    showQuestion();
}

// ✅ Firebase Se Data Fetch Karein
fetchWords();
