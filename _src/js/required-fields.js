
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