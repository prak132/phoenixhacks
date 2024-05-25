document.addEventListener('DOMContentLoaded', (event) => {
    let json = {
        "efeeffe": [
            {
                "question": "feef",
                "answer": "feef"
            },
            {
                "question": "effeef",
                "answer": "fefefe"
            },
            {
                "question": "wdw",
                "answer": "dwdw"
            }
        ],
        "skibbidi": [
            {
                "question": "feljkkjfefe",
                "answer": "eflkfekle"
            },
            {
                "question": "felklkfeef",
                "answer": "fep[ooepfw"
            },
            {
                "question": "fwejofew",
                "answer": "welkflefwkm,"
            }
        ]
    };
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
            <input type="text" id="answerInput" placeholder="Type your answer here">
            <button id="submitAnswer">Submit</button>
            <div id="gradingResult"></div> <!-- Grading result display -->
        `;

        let answerInput = document.getElementById('answerInput');
        let submitButton = document.getElementById('submitAnswer');
        submitButton.addEventListener('click', function() {
            checkAnswer(answerInput.value);
        });
    }

    async function checkAnswer(userAnswer) {
        let correctAnswer = currentSet[currentQuestionIndex].answer;
        const gradingResult = await gradeAnswer(userAnswer, correctAnswer);
        let gradingResultDiv = document.getElementById('gradingResult');
        gradingResultDiv.textContent = `Similarity: ${gradingResult.similarity.toFixed(2)}\nFeedback: ${gradingResult.feedback}`;
        if (gradingResult.similarity > 0.8) {
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

    async function gradeAnswer(studentAnswer, correctAnswer) {
        const response = await fetch('https://your-server-endpoint/api/grade', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentAnswer: studentAnswer,
                correctAnswer: correctAnswer
            })
        });
        const data = await response.json();
        return data;
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
