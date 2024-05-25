let flashcardSet = [];

document.getElementById('addFlashcard').addEventListener('click', function() {
    let flashcardContainer = document.getElementById('flashcardContainer');
    let flashcardForm = document.createElement('form');
    flashcardForm.innerHTML = `
        <label for="question">Question:</label>
        <input type="text" class="question" name="question" required>
        <label for="answer">Answer:</label>
        <input type="text" class="answer" name="answer" required>
    `;
    flashcardForm.addEventListener('submit', function(event) {
        event.preventDefault();
        let question = flashcardForm.querySelector('.question').value;
        let answer = flashcardForm.querySelector('.answer').value;
        flashcardSet.push({question: question, answer: answer});
        flashcardForm.querySelector('.question').value = '';
        flashcardForm.querySelector('.answer').value = '';
    });
    flashcardContainer.appendChild(flashcardForm);
});

document.getElementById('saveFlashcardSet').addEventListener('click', function() {
    let setName = document.getElementById('flashcardsetname').value;
    let flashcardData = { [setName]: flashcardSet };
    chrome.storage.local.set({"flashcards": flashcardData}, () => {
        console.log('Flashcard set saved');
    });
});