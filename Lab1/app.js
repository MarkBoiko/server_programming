const triangle = (value1, type1, value2, type2) => {
		// Перевірка на коректність типів
		const validTypes = ['leg', 'hypotenuse', 'adjacent angle', 'opposite angle', 'angle'];
		if (!validTypes.includes(type1) || !validTypes.includes(type2)) {
				console.log("Перевірте уведені значення типів.");
				return "failed";
		}
		
		// Перевірка на некоректні значення
		if (value1 <= 0 || value2 <= 0) {
				console.log("Значення повинні бути додатніми числами.");
				return "failed";
		}
		
		const toRadians = (degrees) => degrees * (Math.PI / 180);
		const toDegrees = (radians) => radians * (180 / Math.PI);
		
		let a, b, c, alpha, beta;
		
		const solveTriangle = () => {
				if (type1 === 'leg' && type2 === 'leg') {
						a = value1;
						b = value2;
						c = Math.sqrt(a * a + b * b);
						alpha = toDegrees(Math.atan(a / b));
						beta = toDegrees(Math.atan(b / a));
				} else if (type1 === 'leg' && type2 === 'hypotenuse') {
						a = value1;
						c = value2;
						if (a >= c) {
								console.log("Катет не може бути більшим або рівним гіпотенузі.");
								return "failed";
						}
						b = Math.sqrt(c * c - a * a);
						alpha = toDegrees(Math.asin(a / c));
						beta = toDegrees(Math.acos(a / c));
				} else if (type1 === 'hypotenuse' && type2 === 'leg') {
						c = value1;
						a = value2;
						if (a >= c) {
								console.log("Катет не може бути більшим або рівним гіпотенузі.");
								return "failed";
						}
						b = Math.sqrt(c * c - a * a);
						alpha = toDegrees(Math.asin(a / c));
						beta = toDegrees(Math.acos(a / c));
				} else if (type1 === 'leg' && type2 === 'adjacent angle') {
						a = value1;
						beta = value2;
						b = a / Math.tan(toRadians(beta));
						c = Math.sqrt(a * a + b * b);
						alpha = 90 - beta;
				} else if (type1 === 'adjacent angle' && type2 === 'leg') {
						beta = value1;
						a = value2;
						b = a / Math.tan(toRadians(beta));
						c = Math.sqrt(a * a + b * b);
						alpha = 90 - beta;
				} else if (type1 === 'leg' && type2 === 'opposite angle') {
						a = value1;
						alpha = value2;
						b = a / Math.tan(toRadians(alpha));
						c = Math.sqrt(a * a + b * b);
						beta = 90 - alpha;
				} else if (type1 === 'opposite angle' && type2 === 'leg') {
						alpha = value1;
						a = value2;
						b = a / Math.tan(toRadians(alpha));
						c = Math.sqrt(a * a + b * b);
						beta = 90 - alpha;
				} else if (type1 === 'hypotenuse' && type2 === 'adjacent angle') {
						c = value1;
						beta = value2;
						a = c * Math.cos(toRadians(beta));
						b = Math.sqrt(c * c - a * a);
						alpha = 90 - beta;
				} else if (type1 === 'adjacent angle' && type2 === 'hypotenuse') {
						beta = value1;
						c = value2;
						a = c * Math.cos(toRadians(beta));
						b = Math.sqrt(c * c - a * a);
						alpha = 90 - beta;
				} else if (type1 === 'hypotenuse' && type2 === 'opposite angle') {
						c = value1;
						alpha = value2;
						a = c * Math.sin(toRadians(alpha));
						b = Math.sqrt(c * c - a * a);
						beta = 90 - alpha;
				} else if (type1 === 'opposite angle' && type2 === 'hypotenuse') {
						alpha = value1;
						c = value2;
						a = c * Math.sin(toRadians(alpha));
						b = Math.sqrt(c * c - a * a);
						beta = 90 - alpha;
				} else if (type1 === 'angle' && type2 === 'hypotenuse') {
						alpha = value1;
						c = value2;
						a = c * Math.sin(toRadians(alpha));
						b = c * Math.cos(toRadians(alpha));
						beta = 90 - alpha;
				} else if (type1 === 'hypotenuse' && type2 === 'angle') {
						c = value1;
						alpha = value2;
						a = c * Math.sin(toRadians(alpha));
						b = c * Math.cos(toRadians(alpha));
						beta = 90 - alpha;
				} else {
						console.log("Перевірте уведені значення типів.");
						return "failed";
				}
				
				console.log(`a = ${a.toFixed(2)}, b = ${b.toFixed(2)}, c = ${c.toFixed(2)}`);
				console.log(`alpha = ${alpha.toFixed(2)}°, beta = ${beta.toFixed(2)}°`);
				return "success";
		};
		
		return solveTriangle();
};

const args = process.argv.slice(2);

if (args.length !== 4) {
		console.log("Введіть 4 аргументи: значення1 тип1 значення2 тип2");
		process.exit(1);
}

const [value1, type1, value2, type2] = args;
const result = triangle(parseFloat(value1), type1, parseFloat(value2), type2);

console.log(result);
