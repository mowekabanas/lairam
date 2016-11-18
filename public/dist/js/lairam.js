/*!
 * Mowe {ProjectName} Project v0.0.0 (http://letsmowe.org/)
 * Copyright 2013-2015 Mowe Developers
 * Licensed under MIT (https://github.com/mowekabanas/base/blob/master/LICENSE)
*/



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

/* Mowe Logo 1.0 */

var Logo = (function () {

	/**
	 * SVG Logo request
	 * @param element {Element}
	 * @param url {string}
	 * @param fallback {object}
	 * @constructor
	 */
	function Logo(element, url, fallback) {

		var self = this;

		this.element = element;
		this.url = url;
		this.fallback = fallback;

		this.get();

	}

	/**
	 * Append to element
	 * @param toElement {Element}
	 * @param before {Element}
	 */
	Logo.prototype.appendTo = function (toElement, before) {

		if (!before)
			toElement.appendChild(this.element);
		else
			toElement.insertBefore(this.element, before);

	};

	/**
	 * Clone the logo and append to element
	 * @param toElement {Element}
	 */
	Logo.prototype.cloneTo = function (toElement) {

		toElement.appendChild(this.element.cloneNode(this.element));

	};

	Logo.prototype.get = function () {

		var self = this;

		if (this.element && this.url) {

			var request = new XMLHttpRequest();
			request.open('GET', this.url, true);

			request.onreadystatechange = function() {

				if (this.readyState === 4)
					if (this.status == 200)
						if (this.responseText) {
							self.element.innerHTML = this.responseText;
							if (self.fallback)
								self.fallback();
						}

			};

			request.send();
			request = null;

		}

	};

	return Logo;

})();


/* Required fields */

var RequiredField = (function () {

	/**
	 * Required Field constructor
	 * @constructor
	 */
	function RequiredField(viewport, fieldClass) {

		var self = this;

		this.viewport = viewport;

		this.input = {};
		this.label = {};
		this.fieldClass = fieldClass;
		this.message = {
			label: '',
			empty: this.viewport.dataset.empty,
			invalid: this.viewport.dataset.invalid
		};

		this.onClick = function () {

			try {

				self.input.viewport.focus();

			} catch (e) { }

		};

		this.onFocus = function () {

			self.viewport.classList.add('has-focus');

		};

		this.onBlur = function () {

			self.viewport.classList.remove('has-focus');

			// teste
			if (self.input.viewport.value) {

				// validation on input blur (act as first time validation)
				if (self.validateInput(self.input.viewport)) {

					self.viewport.classList.add('is-valid');
					self.viewport.classList.remove('is-error');

				} else {

					self.viewport.classList.remove('is-valid');
					self.viewport.classList.add('is-error');
					self.viewport.classList.add('has-label');

				}

			} else {

				self.toggleLabel("default");
				self.viewport.classList.remove('is-valid');
				self.viewport.classList.remove('is-error');

			}

		};

		this.onInput = function () {

			// current
			/*
			 if (self.input.viewport.value) {
			 self.viewport.classList.remove('is-empty');
			 self.viewport.classList.add('has-label');
			 self.viewport.classList.add('is-valid');
			 } else {
			 self.viewport.classList.remove('has-label');
			 self.viewport.classList.remove('is-valid');
			 }*/

			if (self.input.viewport.value) {

				// show label on field input
				self.viewport.classList.add('has-label');

				// validation update routine
				if (self.viewport.classList.contains('is-error')) {

					if (self.validateInput(self.input.viewport)) {
						self.viewport.classList.add('is-valid');
						self.viewport.classList.remove('is-error');
					}

				} else if (self.viewport.classList.contains('is-valid')) {

					if (!self.validateInput(self.input.viewport)) {
						self.viewport.classList.remove('is-valid');
						self.viewport.classList.add('is-error');
						self.viewport.classList.add('has-label');
					}

				}

			} else {

				// hide label on field input empty
				self.viewport.classList.remove('has-label');

			}

		};

		if (this.viewport)
			this.init();

	}

	/**
	 * Normalize
	 */
	RequiredField.prototype.normalize = function () {

		if (this.input.viewport.value)
			this.viewport.classList.add('has-label');

	};

	/**
	 * Add the listeners
	 * It support IE8
	 */
	RequiredField.prototype.addListeners = function () {

		try {

			this.viewport.addEventListener('click', this.onClick, false);

			this.input.viewport.addEventListener('focus', this.onFocus, false);
			this.input.viewport.addEventListener('blur', this.onBlur, false);
			this.input.viewport.addEventListener('input', this.onInput, false);

		} catch (e) { }

	};

	/**
	 * Get the input element
	 * @return {boolean}
	 */
	RequiredField.prototype.getInputElement = function () {

		this.input.viewport = this.viewport.querySelector(this.fieldClass);
		this.label.viewport = this.viewport.querySelector("label");
		this.message.label = this.label.viewport.innerText;

		return !!this.input.viewport;

	};

	/**
	 * Validate input element values
	 * returns true on valid input and returns false on invalid input
	 * @return {boolean}
	 */
	RequiredField.prototype.validateInput = function (input) {

		if (input.value == "") {

			this.toggleLabel("empty");
			return false;

		} else {

			this.toggleLabel("default");

		}

		if (input.type == "text") {

			this.toggleLabel("default");
			return true;

		} else if (input.type == "email") {

			var regexMail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

			if (input.validity.valid && regexMail.test(input.value)) {

				this.toggleLabel("default");
				return true;

			} else {

				this.toggleLabel("invalid");
				return false;

			}

		} else if (input.type == "tel") {

			(input.value.replace(/\s/g, "").length <= 13)
				? input.value = input.value.replace(/\s/g, "")
				: false;

			// var regexPhone = /^[1-9][0-9]\s?[2-9][0-9]{3,4}[-\s]?[0-9]{4}$/;
			var regexPhone = /^[+#*]?[0-9]{8,13}$/;

			if (regexPhone.test(input.value)) {

				this.toggleLabel("default");
				return true;

			} else {

				this.toggleLabel("invalid");
				return false;

			}

		}

		return (input.validity.valid);

	};

	/**
	 *
	 */
	RequiredField.prototype.toggleLabel = function (state) {

		switch (state) {
			case "invalid":
				this.label.viewport.innerText = this.message.invalid;
				break;
			case "empty":
				this.label.viewport.innerText = this.message.empty;
				break;
			case "default":
				this.label.viewport.innerText = this.message.label;
				break;
		}

	};

	/**
	 * Init the instance
	 */
	RequiredField.prototype.init = function () {

		if (this.getInputElement())
			this.addListeners();

		this.normalize();

	};

	return RequiredField;

})();