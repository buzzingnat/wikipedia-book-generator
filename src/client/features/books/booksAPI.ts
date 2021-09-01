/*
fetch('/api/books/', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({
		title: 'New Book',
		contents: 'The contents of the book.'
	})
});
*/

const SERVER_URL = 'http://localhost:8080';

export async function sendSavedBook(title: string, contents: string) {
    return await fetch(SERVER_URL + '/api/books/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({title, contents})
	})
        .then(function(response){
          return response.json();
        })
        .then(function(response) {
            return response;
        })
        .catch(function(error){
          console.error(error);
          return error;
        });
}

export async function fetchAllBooks() {
    return await fetch(SERVER_URL + '/api/books/', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})
        .then(function(response){
          return response.json();
        })
        .then(function(response) {
            return response;
        })
        .catch(function(error){
          console.error(error);
          return error;
        });
}
