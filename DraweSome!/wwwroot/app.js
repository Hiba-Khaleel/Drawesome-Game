$('#word-check').on('submit', testWord) 

async function testWord(e) {
  e.preventDefault();
  const word = $('[name="word"]').val();
  console.log('word', word);
  const response = await fetch('/test-word/' + word); 
  console.log('response', response);
  const data = await response.json();
  console.log('data', data);
  $('#message').text(word + (data ? ' finns ' : ' finns inte ') + ' i databasen')
}

$('#new-word').on('submit', saveWord)

async function saveWord(e) {
  e.preventDefault(); 
  const newWord = $('[name="new-word"]').val();
  console.log('newWord', newWord);
  const response = await fetch('/new-word/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word: newWord })
  });
  console.log('response', response);
  const data = await response.json();
  console.log('data', data);
  $('#message').text(newWord + ' lades till i databasen')
}