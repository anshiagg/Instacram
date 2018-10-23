//2) 

const button = document.getElementById('check');
button.addEventListener('click', isValid);


function isValid(e) {
	const email = document.getElementById('email');
	const text = text.innerText;
	const pattern = /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-z0-9A-Z]+/i;
	if (pattern.exec(text)) {
		email.setAtrribute('style', 'color:green')
	} else {
		email.setAtrribute('style', 'color:red')
	}
}