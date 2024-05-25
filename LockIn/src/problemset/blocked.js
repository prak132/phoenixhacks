document.addEventListener('DOMContentLoaded', async (event) => {
    let json = JSON.parse((await chrome.storage.local.get("flashcards")).flashcards);
    console.log(json);
    let isSolved = false;
    let currentSet = null;
    let currentQuestionIndex = 0;

    document.addEventListener('DOMContentLoaded', (event) => {
        displayFlashcardSets();
    });

    function displayFlashcardSets() {
        let flashcardContainer = document.getElementById('flashcardContainer');
        for (let setName in json) {
            let setDiv = document.createElement('div');
            setDiv.innerHTML = `
                <p>${setName}</p>
                <button class="choose-set" data-set-name="${setName}">Choose</button>
            `;
            flashcardContainer.appendChild(setDiv);
        }

        let chooseSetButtons = document.getElementsByClassName('choose-set');
        for (let button of chooseSetButtons) {
            button.addEventListener('click', function() {
                currentSet = json[button.getAttribute('data-set-name')];
                flashcardContainer.innerHTML = '';
                displayQuestion();
            });
        }
    }

    function displayQuestion() {
        let question = currentSet[currentQuestionIndex];
        let flashcardContainer = document.getElementById('flashcardContainer');
        flashcardContainer.innerHTML = `
            <p>${question.question}</p>
            <input type="text" style="width: 25%;" id="answerInput" placeholder="Type your answer here">
            <button id="submitAnswer">Submit</button>
            <div id="gradingResult"></div> <!-- Grading result display -->
        `;

        let answerInput = document.getElementById('answerInput');
        let submitButton = document.getElementById('submitAnswer');
        submitButton.addEventListener('click', function() {
            checkAnswer(answerInput.value);
        });
    }

    async function query(data) {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
            {
                headers: { Authorization: "Bearer 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" },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        const result = await response.json();
        return result;
    }   

    async function checkAnswer(userAnswer) {
        let correctAnswer = currentSet[currentQuestionIndex].answer;
        let gradingResultDiv = document.getElementById('gradingResult');
        let result = await query({
            "inputs": {
                "source_sentence": userAnswer,
                "sentences": [correctAnswer]
            }
        });
        console.log(result[0]);
        if (result[0] > 0.8) {
            displayBanner('Correct!', 'green');
            currentQuestionIndex++;
            if (currentQuestionIndex < currentSet.length) {
                displayQuestion();
            } else {
                isSolved = true;
            }
        } else {
            displayBanner('Incorrect!', 'red');
        }
    }
    function displayBanner(message, color) {
        let banner = document.getElementById('banner');
        banner.textContent = message;
        banner.style.backgroundColor = color;
        setTimeout(function() {
            banner.textContent = '';
            banner.style.backgroundColor = 'transparent';
        }, 2000);
    }

    displayFlashcardSets();
});
