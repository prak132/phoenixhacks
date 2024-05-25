document.getElementById('addFlashcard').addEventListener('click', function() {
    let flashcardContainer = document.getElementById('flashcardContainer');
    let flashcardForm = document.createElement('form');
    let uniqueId = Date.now();
    flashcardForm.innerHTML = `
        <label for="question${uniqueId}">Question:</label>
        <input type="text" id="question${uniqueId}" class="question" name="question" required>
        <label for="answer${uniqueId}">Answer:</label>
        <input type="text" id="answer${uniqueId}" class="answer" name="answer" required>
        <button type="button" class="deleteFlashcard">Delete</button>
    `;
    flashcardForm.querySelector('.deleteFlashcard').addEventListener('click', function() {
        flashcardForm.remove();
    });
    flashcardContainer.appendChild(flashcardForm);
});

document.getElementById('saveflashcard').addEventListener('click', function(event) {
    event.preventDefault();
    let setName = document.getElementById('flashcardsetname').value;
    let flashcardSet = Array.from(document.querySelectorAll('form')).map(form => {
        let question = form.querySelector('.question').value;
        let answer = form.querySelector('.answer').value;
        if (!setName) {
            alert('Flashcard set name must be filled out.');
            return null;
        }
        if (!question || !answer) {
            alert('Both question and answer fields must be filled out.');
            return null;
        }
        return {question, answer};
    }).filter(flashcard => flashcard !== null);
    let flashcardData = { [setName]: flashcardSet };
    console.log(JSON.stringify(flashcardData));
    chrome.storage.local.get("flashcards", (res) => {
        if(res.flashcards) {
            flashcardData = {...JSON.parse(res.flashcards), ...flashcardData};
        } else {
            flashcardData = {...flashcardData};
        }
        chrome.storage.local.set({"flashcards": JSON.stringify(flashcardData)}, () => {
            console.log('Flashcard set saved');
        });
    });
});