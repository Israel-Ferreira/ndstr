class ValidationContract {    
    constructor(){
        this.errors = [];
    }

	isRequired(value, message) {
		if (!value || value.length <= 0) this._pushMessage(message);
	}

	hasMinLen(value, min, message) {
		if (!value || value.length < min) this._pushMessage(message);
	}

	hasMaxLen(value, max, message) {
		if (!value || value.length > max) this._pushMessage(message);
	}

	isFixedLen(value, len, message) {
		if (value.length != len) this._pushMessage(message);
	}

	isEmail(value, message) {
		let reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
		if (!reg.test(value)) this._pushMessage(message);
    }

    getErrors(){
        return this.errors;
    }

    clear(){
        this.errors = [];
    }

    isValid(){
        return this.errors == 0;
    }
    
	_pushMessage(message) {
		this.errors.push({ message });
	}
}

module.exports = ValidationContract;
