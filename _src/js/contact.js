
/* Contact */

/* Contact email manipulation */

var formSentCount, formSentTry;
var formSentCountLimit, formSentTryLimit;

formSentCount = formSentTry = 0;
formSentCountLimit = formSentTryLimit = 2;

var requestURL = 'https://service.elbit.com.br/mailman/lairam/';
var formLocked = false;

var form = {
	viewport: document.getElementById('cForm')
};

form.fields = {};
form.sendButton = {};

form.fields.cName = document.getElementById('cName');
form.fields.cPhone = document.getElementById('cPhone');
form.fields.cEmail = document.getElementById('cEmail');
form.fields.cMessage = document.getElementById('cMessage');
form.sendButton.viewport = document.getElementById('cSubmit');

form.states = [
	'is-error',
	'is-fail',
	'is-sending',
	'is-success'
];

form.changeState = function (state) {

	if (form.viewport) {

		for (var i = form.states.length; i--; )
			form.viewport.classList.remove(form.states[i])

		form.viewport.classList.add(state);

	}

};

form.changeStateError = function (state, msg) {

	this.changeState(state);

	if (state == "is-error")
		form.viewport.querySelector(".ContactFormStatus-text--error").innerText = msg;

};

// send the ajax request
form.sendRequest = function(requestData) {

	if (requestData) {

		// vanilla js
		var xhr = new XMLHttpRequest();

		// "beforeSend"
		formLocked = true;
		form.changeState('is-sending');

		xhr.ontimeout = function (e) {
			console.log(e);
			form.changeState('is-fail');

			if (formSentTry < formSentTryLimit)
				form.send(requestData, 5000);
		};

		xhr.onerror = function() {
			form.changeState('is-error');
		};

		xhr.onreadystatechange = function(e) {

			if (xhr.readyState == 4) {

				if (xhr.status == 200) {
					console.log(xhr.responseText);
					form.changeState('is-success');
				} else {
					form.changeState('is-error');
				}

			}

			formLocked = false;

		};

		//xhr.withCredentials = true;
		xhr.open('GET', requestURL + "?" + form.requestParams(requestData));
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.timeout = 10000;

		xhr.send();

	}

};

// transform object into uri string
form.requestParams = function (requestData) {

	var y = '', e = encodeURIComponent;

	for (var x in requestData) {
		y += '&' + e(x) + '=' + e(requestData[x]);
	}

	//&_t= ==> equals to cache: false;
	return y.slice(1) + '&_t=' + new Date().getTime();

};

// control the time delay to init the ajax request
form.send = function(requestData, delay) {

	if (requestData) {

		formSentTry++;

		if (delay) {
			setTimeout(function() {
				form.sendRequest(requestData);
			}, delay)
		} else {
			form.sendRequest(requestData);
		}

	}

};

// form submit button listener
form.sendButton.viewport.addEventListener('click', function (ev) {

	ev.preventDefault();

	if (!formLocked) {

		if (formSentCount < formSentCountLimit) {

			var allow = true;
			var msg = "";

			/* Form input validation */

			if (form.fields.cName.value && form.fields.cMessage.value) {

				if (form.fields.cPhone.value || form.fields.cEmail.value) {

					if (!form.fields.cPhone.parentNode.classList.contains("is-error") && !form.fields.cEmail.parentNode.classList.contains("is-error")) {

						allow = true;

					} else {
						msg = "Não foi possível enviar, informe os dados corretamente.";
						allow = false;
					}

				} else {
					msg = "Não foi possível enviar, informe pelos menos um email ou um telefone.";
					allow = false;
				}

			} else {
				msg = "Não foi possível enviar, preencha os campos e tente novamente.";
				allow = false;
			}

			if (allow) {

				formLocked = true;
				formSentCount++;

				var requestData = {
					cName: form.fields.cName.value,
					cPhone: form.fields.cPhone.value,
					cEmail: form.fields.cEmail.value,
					cMessage: form.fields.cMessage.value
				};

				form.send(requestData, false);

			} else {
				form.changeStateError('is-error', msg);
			}

		} else {
			form.changeStateError('is-error', "Limite de mensagens atingido por sessão.");
		}

	}

});