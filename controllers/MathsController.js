
const {log} = require('console');
const fs = require('fs');
const path = require('path');

function calculateDoubleParametersOperation (op, x, y, func) {
	let xyPresent = x != undefined &&  y != undefined;
	let isXNumber = !isNaN(x);
	let isYNumber = !isNaN(y);

	// instead of rebuilding payload everytime, generate part of it
	if (xyPresent) {
		if (!isXNumber)
			return {
				"op": op,
				"x": x,
				"y": y,
				"error": "X isn't a valid number: " + x
			};

		else if (!isYNumber)
			return {
				"op": op,
				"x": x,
				"y": y,
				"error": "Y isn't a valid number: " + y
			};

		x = parseInt(x);
		y = parseInt(y);

		if (['/', '%'].includes(op) && (x === 0))
			return {
				"op": op,
				"x": x,
				"y": y,
				"value": "NaN"
			};
		else if (op == '/' && (y === 0))
			return {
				"op": op,
				"x": x,
				"y": y,
				"value": "Infinity"
			};
		else if (op == '%' && (y === 0))
			return {
				"op": op,
				"x": x,
				"y": y,
				"value": "NaN"
			};

		return {
			"op": op,
			"x": x,
			"y": y,
			"value": func(x, y)
		};
	}
	else 
		return {
			"op": op,
			"x": x,
			"y": y,
			"error": "This operation need both parameters int(X) and int(Y)"
		};
}

function calculateFactorialOperation (n) {
	let r = 1;
	while (n > 0) {
		r *= n;
		n--;
	}

	return r;
}

function calculatePrimeNumber (n) {
	if (n < 2)
		return false;

	for (let x = 2; i < n; x++) {
		if (n % i === 0) {
			return false;
		}
	}

	return true;
}

function calculateNthPrimeNumber (n) {
	let curr, x = 0;
	while (curr < n) {
		if (calculatePrimeNumber(x))
			curr++;
		x++;
	}

	return x;
}

module.exports =
	class MathsController extends require('./Controller') {

		constructor(HttpContext) {
			super(HttpContext);
		}

		get () {
			if (this.HttpContext.path.queryString == '?') {
				let helpPagePath = path.join(process.cwd(), "wwwroot/help.html");
				console.log("Accessing help pages from " + helpPagePath);
				
				let helpPageContent = fs.readFileSync(helpPagePath);

				this.HttpContext.response.content("text/html", helpPageContent);
			}
			else if (this.HttpContext.path.params.op) {
				let operation = this.HttpContext.path.params.op
					.replace(" ", "+");

				let x = this.HttpContext.path.params.x;
				let y = this.HttpContext.path.params.y;

				let payload = {};
				switch (operation) {
					case '+':
						payload = calculateDoubleParametersOperation(operation, x, y, (x, y) => x + y);
						break;

					case '-':
						payload = calculateDoubleParametersOperation(operation, x, y, (x, y) => x - y);
						break;

					case '*':
						payload = calculateDoubleParametersOperation(operation, x, y, (x, y) => x * y);
						break;

					case '/':
						payload = calculateDoubleParametersOperation(operation, x, y, (x, y) => x / y);
						break;

					case '%':
						payload = calculateDoubleParametersOperation(operation, x, y, (x, y) => x % y);
						break;

					case '!':
						let n = this.HttpContext.path.params.n;
						if (n)
							payload = {
								"op": operation,
								"n": n,
								"value": calculateFactorialOperation(n)
							};
						else
							payload = {
								"op": operation,
								"n": n,
								"error": "N wasn't found"
							};

						break;

					case 'p':
						if (n)
							payload = {
								"op": operation,
								"n": n,
								"value": calculatePrimeNumber(n)
							};
						else
							payload = {
								"op": operation,
								"n": n,
								"error": "N wasn't found"
							};

						break;

					case 'np':
						if (n)
							payload = {
								"op": operation,
								"n": n,
								"value": calculateNthPrimeNumber(n)
							};
						else
							payload = {
								"op": operation,
								"n": n,
								"error": "N wasn't found"
							};

						break;

				}

				this.HttpContext.response.JSON(payload)
			}

		}
		

	}



