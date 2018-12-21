Lyte.Component.register("lyte-calculator", {
_template:"<template tag-name=\"lyte-calculator\">  <div id=\"lyteCalculator\" tabindex=\"0\" onkeydown=\"{{action('calculate', event)}}\" onclick=\"{{action('calculate',event)}}\">    <div id=\"calculatorDisplay\">      <span id=\"calculatorDispspan\">M</span>      <input type=\"text\" id=\"calculatorDispInp\" readonly=\"\">    </div>    <div id=\"calculatorClear\">      <span id=\"calculatorclearb\" value=\"D\">D</span>      <span id=\"calculatorClearc\" value=\"C\">C</span>      <span id=\"calculatorClearce\" value=\"CE\">CE</span>    </div>    <div id=\"calculatorMemory\">      <span id=\"calculatorMemoryMs\" value=\"MS\">MS</span>      <span id=\"calculatorMemoryMp\" value=\"M+\">M+</span>      <span id=\"calculatorMemoryMm\" value=\"M-\">M-</span>      <span id=\"calculatorMemoryMr\" value=\"MR\">MR</span>      <span id=\"calculatorMemoryMc\" value=\"MC\">MC</span>    </div>    <div id=\"calculatorNumbers\">      <span id=\"calculatorNumbers1\" value=\"1\">1</span>      <span id=\"calculatorNumbers2\" value=\"2\">2</span>      <span id=\"calculatorNumbers3\" value=\"3\">3</span>      <span id=\"calculatorNumbers4\" value=\"4\">4</span>      <span id=\"calculatorNumbers5\" value=\"5\">5</span>      <span id=\"calculatorNumbers6\" value=\"6\">6</span>      <span id=\"calculatorNumbers7\" value=\"7\">7</span>      <span id=\"calculatorNumbers8\" value=\"8\">8</span>      <span id=\"calculatorNumbers9\" value=\"9\">9</span>      <span id=\"calculatorNumbers0\" value=\"0\">0</span>      <span id=\"calculatorNumbersd\" value=\".\">.</span>      <span id=\"calculatorNumberse\" value=\"=\" style=\"background:#ff9600;color:white\">=</span>    </div>    <div id=\"calculatordmos\">      <span id=\"calculatordivivde\" value=\"/\">/</span>      <span id=\"calculatormultiply\" value=\"*\">*</span>      <span id=\"calculatoradd\" value=\"+\">+</span>      <span id=\"calculatorminus\" value=\"-\">-</span>    </div>    <div id=\"calculatorispr\">      <span id=\"calculatorinverse\" value=\"inverse\">+/-</span>      <span id=\"calculatorsqrt\" value=\"sqrt\">sqrt</span>      <span id=\"calculatorreciprocal\" value=\"reci\">1/x</span>      <span id=\"calculatorpercent\" value=\"percent\">%</span>    </div>    <div id=\"advancedCalculator\">      <span id=\"openBrac\" value=\"(\">(</span>      <span id=\"closeBrac\" value=\")\">)</span>      <span id=\"xsqd\" value=\"x^2\">x^2</span>      <span id=\"xcube\" value=\"x^3\">x^3</span>      <span id=\"xpwry\" value=\"x^y\">x^y</span>      <span id=\"epwrx\" value=\"e^x\">e^x</span>      <span id=\"tenpwrx\" value=\"10^x\">10^x</span>      <span id=\"cuberoot\" value=\"cbrt\">cbrt</span>      <span id=\"xroot\" value=\"xrt\">xrt</span>      <span id=\"ln\" value=\"ln\">ln</span>      <span id=\"xfact\" value=\"x!\">x!</span>      <span id=\"log10\" value=\"log10\">log10</span>      <span id=\"sin\" value=\"sin\">sin</span>      <span id=\"cos\" value=\"cos\">cos</span>      <span id=\"tan\" value=\"tan\">tan</span>      <span id=\"pie\" value=\"pie\">pie</span>      <span id=\"expo\" value=\"e\">e</span>      <span id=\"sinh\" value=\"sinh\">sinh</span>      <span id=\"cosh\" value=\"cosh\">cosh</span>      <span id=\"tanh\" value=\"tanh\">tanh</span>      <span id=\"rad\" value=\"rad\">rad</span>      <span id=\"ee\" value=\"EE\">EE</span>      <span id=\"rand\" value=\"rand\">rand</span>    </div>  </div></template>\n<style>#lyteCalculator{\n  font-size: .9em;\n  color: white;\n  margin: 1%;\n  position: absolute;\n  width: 410px;\n  height: 330px;\n  background: white;\n  box-shadow: 0px 0px 10px #ccc;\n}\n#calculatorDisplay{\n  position: relative;\n  top: 0px;\n  height: 50px;\n  width: 210px;\n  /* background: red; */\n}\n#calculatorDispspan{\n  position: absolute;\n  top: 10px;\n  height: 50px;\n  background: #eee;\n  width: 410px;\n  color: #ccc;\n  padding: 17px 10px;\n  font-size: .8em;\n}\n#calculatorDispInp{\n  text-align: right;\n  padding-right:10px;\n  position: relative;\n  top: 10px;\n  left: 220px;\n  height: 50px;\n  width: 180px;\n  background: #eee;\n  border: none;\n}\n#calculatorClear{\n  position: relative;\n  top: 30px;\n  width: 100%;\n  height: 30px;\n  /* background: red; */\n}\n#calculatorclearb{\n  position: absolute;\n  width: 30px;\n  height: 30px;\n  top: 0px;\n  left: 10px;\n  font-size: .8em;\n  padding:8.5px 11px;\n  border-radius: 50%;\n  background: #b00000;\n  box-shadow: 0px 0px 5px #ccc;\n}\n#calculatorClearc{\n  position: absolute;\n  width: 30px;\n  height: 30px;\n  top: 0px;\n  right: 10px;\n  font-size: .8em;\n  padding:8.5px 11px;\n  border-radius: 50%;\n  background: #b00000;\n  box-shadow: 0px 0px 5px #ccc;\n}\n#calculatorClearce{\n  position: absolute;\n  width: 30px;\n  height: 30px;\n  top: 0px;\n  right: 50px;\n  font-size: .8em;\n  padding:8px 7.5px;\n  background: #b00000;\n  border-radius: 50%;\n  box-shadow: 0px 0px 5px #ccc;\n}\n#calculatorMemory{\n  position: relative;\n  top: 40px;\n  width: 210px;\n  height: 30px;\n  /* background: red; */\n}\n#calculatorMemoryMs{\n  position: absolute;\n  top: 0px;\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  background: #2c2d67;\n  font-size: .8em;\n  padding: 8px 6px;\n  box-shadow: 0px 0px 5px #ccc;\n  left: 10px;\n}\n#calculatorMemoryMp{\n  position: absolute;\n  top: 0px;\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  background: #2c2d67;\n  font-size: .8em;\n  padding: 8px 7px;\n  box-shadow: 0px 0px 5px #ccc;\n  left: 50px;\n}\n#calculatorMemoryMm{\n  position: absolute;\n  top: 0px;\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  background: #2c2d67;\n  font-size: .8em;\n  padding: 8px 7px;\n  box-shadow: 0px 0px 5px #ccc;\n  left: 90px;\n}\n#calculatorMemoryMr{\n  position: absolute;\n  top: 0px;\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  background: #2c2d67;\n  font-size: .8em;\n  padding: 8px 6px;\n  box-shadow: 0px 0px 5px #ccc;\n  left: 130px;\n}\n#calculatorMemoryMc{\n  position: absolute;\n  top: 0px;\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  background: #2c2d67;\n  font-size: .8em;\n  padding: 8px 6px;\n  box-shadow: 0px 0px 5px #ccc;\n  left: 170px;\n}\n#calculatorNumbers{\n  position: relative;\n  top: 50px;\n  width: 130px;\n  height: 160px;\n  /* background: red; */\n}\n#calculatorNumbers1,#calculatorNumbers2,#calculatorNumbers3,#calculatorNumbers4,#calculatorNumbers5,#calculatorNumbers6,\n#calculatorNumbers7,#calculatorNumbers8,#calculatorNumbers9,#calculatorNumbers0,#calculatorNumbersd,#calculatorNumberse{\n  position: absolute;\n  padding: 8px 11px;\n  font-size: .8em;\n  width: 30px;\n  color: #888;\n  height: 30px;\n  border-radius: 50%;\n  box-shadow: 0px 0px 5px #ccc;\n  cursor: pointer;\n}\n#calculatorNumbers1,#calculatorNumbers2,#calculatorNumbers3{\n  top: 0px;\n}\n#calculatorNumbers4,#calculatorNumbers5,#calculatorNumbers6{\n  top: 40px;\n}\n#calculatorNumbers7,#calculatorNumbers8,#calculatorNumbers9{\n  top: 80px;\n}\n#calculatorNumbers0,#calculatorNumbersd,#calculatorNumberse{\n  top: 120px;\n}\n#calculatorNumbers1,#calculatorNumbers4,#calculatorNumbers7,#calculatorNumbersd{\n  left: 10px;\n}\n#calculatorNumbers2,#calculatorNumbers5,#calculatorNumbers8,#calculatorNumbers0{\n  left: 50px;\n}\n#calculatorNumbers3,#calculatorNumbers6,#calculatorNumbers9,#calculatorNumberse{\n  left: 90px;\n}\n#calculatorNumbersd{\n  padding:7px 13px;\n}\n#calculatordmos{\n  position: relative;\n  top: -110px;\n  left: 130px;\n  width: 30px;\n  height: 160px;\n  /* background: blue; */\n}\n#calculatordivivde,#calculatoradd,#calculatormultiply,#calculatorminus{\n  position: absolute;\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  font-size: .8em;\n  background: #97983a;\n  box-shadow: 0px 0px 5px #ccc;\n  left: 0px;\n}\n#calculatordivivde{\n  padding:8px 12.5px;\n  top: 0px;\n}\n#calculatormultiply{\n  padding:9.5px 12.5px;\n  top: 40px;\n}\n#calculatoradd{\n  padding:8px 11.5px;\n  top: 80px;\n}\n#calculatorminus{\n  padding:9px 13px;\n  top: 120px;\n}\n#calculatorispr{\n  position: relative;\n  top: -320px;\n  left: 170px;\n  width: 30px;\n  height: 160px;\n  display: inline-block;\n}\n#calculatorinverse,#calculatorreciprocal,#calculatorpercent,#calculatorsqrt{\n  position: absolute;\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  background: #0cb09e;\n  font-size: .8em;\n  box-shadow: 0px 0px 5px #ccc;\n  left: 0px;\n}\n#calculatorinverse{\n  top: 0px;\n  padding: 8px 8px;\n}\n#calculatorreciprocal{\n  padding: 8px 7px;\n  top: 40px;\n}\n#calculatorsqrt{\n  padding: 8px 5px;\n  top: 80px;\n}\n#calculatorpercent{\n  padding: 8px 10px;\n  top: 120px;\n}\n#advancedCalculator{\n  position: relative;\n  width: 200px;\n  height: 210px;\n  /* background-color: blue; */\n  top: -310px;\n  left: 176.5px;\n  display: inline-block;\n}\n\n\n#openBrac,\n#closeBrac,\n#xsqd,\n#xcube,\n#xpwry,\n#epwrx,\n#tenpwrx,\n#cuberoot,\n#xroot,\n#ln,\n#xfact,\n#log10,\n#sin,\n#cos,\n#tan,\n#pie,\n#expo,\n#sinh,\n#cosh,\n#tanh,\n#rad,\n#ee,\n#rand{\n  position: absolute;\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  box-shadow: 0px 0px 5px #ccc;\n  background: #fff;\n  color: #000;\n  font-size: .6em;\n  /* text-align: center; */\n}\n\n\n#openBrac{\n  padding: 10px 12px;\n}\n#closeBrac{\n  padding: 10px 14px;\n  left: 40px;\n}\n#xsqd{\n  padding: 10px 9.5px;\n  left: 80px;\n}\n#xcube{\n  padding: 10px 9.5px;\n  left: 120px;\n}\n#xpwry{\n  padding: 10px 9.5px;\n  left: 160px;\n}\n#epwrx{\n  padding: 10px 9.5px;\n  top: 40px;\n}\n#tenpwrx{\n  padding: 10px 5.5px;\n  top: 40px;\n  left: 40px;\n}\n#cuberoot{\n  padding: 10px 8px;\n  top: 40px;\n  left: 80px;\n}\n#xroot{\n  padding: 10px 10.5px;\n  top: 40px;\n  left: 120px;\n}\n#ln{\n  padding: 10px 12px;\n  top: 40px;\n  left: 160px;\n}\n#xfact{\n  padding: 10px 12.5px;\n  top: 80px;\n}\n#log10{\n  padding: 10px 5.5px;\n  top: 80px;\n  left: 40px;\n}\n#sin{\n  padding: 10px 9.5px;\n  top: 80px;\n  left: 80px;\n}\n#cos{\n  padding: 10px 9.5px;\n  top: 80px;\n  left: 120px;\n}\n#tan{\n  padding: 10px 9.5px;\n  top: 80px;\n  left: 160px;\n}\n#pie{\n  padding: 10px 9.5px;\n top: 120px;\n}\n#expo{\n  padding: 10px 12.5px;\n  top: 120px;\n  left: 40px;\n}\n#sinh{\n  padding: 10px 7.5px;\n  top: 120px;\n  left: 80px;\n}\n#cosh{\n  padding: 10px 7.5px;\n  top: 120px;\n  left: 120px;\n}\n#tanh{\n  padding: 10px 7.5px;\n  top: 120px;\n  left: 160px;\n}\n#rad{\n  padding: 10px 27.5px;\n  top: 160px;\n  width: 70px;\n  border-radius: 24px;\n}\n#ee{\n  padding: 10px 10px;\n  top: 160px;\n  left: 80px;\n}\n#rand{\n  padding: 10px 25px;\n  top: 160px;\n  left: 120px;\n  width: 70px;\n  border-radius: 24px;\n}\n</style>",
_dynamicNodes : [{"type":"attr","position":[1]}],
_observedAttributes :["firstOperand","secondOperand","previousOperator","currentOperator","operatorAr","openIndex","closeIndex","operator","pushIndex","popIndex","opPushIndex","opPopIndex","finalAns","memoryData"],
	data : function(){
		return {

			firstOperand : Lyte.attr("array",{
				"default" : []
			}),

			secondOperand : Lyte.attr("string",{
				"default" : ""
			}),

			previousOperator : Lyte.attr("string",{
				"default" : ""
			}),

			currentOperator : Lyte.attr("string",{
				"default" : ""
			}),

			operatorAr : Lyte.attr("array" , {
				"default" : []
			}),

			openIndex : Lyte.attr("array" , {
				"default" : []
			}),

			closeIndex : Lyte.attr("array" , {
				"default" : []
			}),

			operator : Lyte.attr("string" , {
				"default" : ""
			}),

			pushIndex : Lyte.attr("number",{
				"default" : 0
			}),

			popIndex : Lyte.attr("number", {
				"default" : 0
			}),

			opPushIndex : Lyte.attr("number", {
				"default" : 0
			}),

			opPopIndex : Lyte.attr("number",{
				"default" : 0
			}),

			finalAns : Lyte.attr("number",{
				"default" : 0
			}),

			memoryData : Lyte.attr("string",{
				"default" : "0"
			})
		}
	},
	actions : {
		calculate : function(e){
			const pie = Math.PI;
			var firstOperand = this.getData('firstOperand');
			var secondOperand = this.getData('secondOperand');
			var operatorAr = this.getData('operatorAr');
			var operator = this.getData('operator');
			var pushIndex = this.getData('pushIndex');
			var popIndex = this.getData('popIndex');
			var opPushIndex = this.getData('opPushIndex');
			var opPopIndex = this.getData('opPopIndex');
			var openIndex = this.getData('openIndex');
			var closeIndex = this.getData('closeIndex');
			var currentOperator = this.getData('currentOperator');
			var previousOperator = this.getData('previousOperator');
			var finalAns = this.getData('finalAns');



			function add(a,b){
				console.log(a + " aaaaa " +b);
				return parseFloat(a)+parseFloat(b);
			}
			function sub(a,b){
				console.log(a + " sssss " + b);
				return (parseFloat(a)-parseFloat(b));
			}
			function multiply(a,b){
				console.log(a + " mmmmm " + b);
				return (parseFloat(a)*parseFloat(b));
			}
			function divide(a,b){
				console.log(a + " ddddd " + b);
				return (parseFloat(a)/parseFloat(b));
			}
			function log(a){
				return Math.log10(a);
			}
			function power(a,b){
				return Math.pow(a, b);
			}
			function sqrt(a){
				return Math.sqrt(a);
			}
			function cbrt(a){
				return Math.cbrt(a);
			}


			switch (e.type) {

				case "click":

				break;




				case "keydown":

				//inserting firstOperand value


				if((((e.keyCode >= 48)&&(e.keyCode <= 57))||(e.keyCode === 190))&&(!e.shiftKey)){



					if(operatorAr.length === 0){
						if(firstOperand.length === 0){
							firstOperand.push(e.key);
						} else {
							firstOperand[firstOperand.length-1] = firstOperand[firstOperand.length-1] + e.key;
						}
					} else {
						secondOperand += e.key;
					}



				}

				// inserting operator

				if(((e.keyCode === 187)&&(e.shiftKey))||((e.keyCode === 189)&&(!e.shiftKey))||((e.keyCode === 56)&&(e.shiftKey))||((e.keyCode === 191)&&(!e.shiftKey))||((e.keyCode === 187)&&(!e.shiftKey))){

					// debugger


						operator = currentOperator = e.key;
						operatorAr.push(operator);

						if(secondOperand !== ""){
							firstOperand.push(secondOperand);
							secondOperand = "";
						}


					if((((currentOperator === "+")||(currentOperator === "-"))&&(operatorAr.length>1))&&(openIndex.length === 0)) {

						// firstOperand.push(secondOperand);
						// secondOperand = "";

						if(operatorAr[operatorAr.length-2] === "+"){
							var tempVar = add(firstOperand[firstOperand.length-2] , firstOperand[firstOperand.length-1]);
							firstOperand.pop();
							firstOperand.pop();
							firstOperand.push(tempVar);
						}
						if(operatorAr[operatorAr.length-2] === "-"){
							if(operatorAr[operatorAr.length-3] === "-"){
								var tempVar = add(firstOperand[firstOperand.length-2] , firstOperand[firstOperand.length-1]);
								firstOperand.pop();
								firstOperand.pop();
								firstOperand.push(tempVar);
							} else {
								var tempVar = sub(firstOperand[firstOperand.length-2] , firstOperand[firstOperand.length-1]);
								firstOperand.pop();
								firstOperand.pop();
								firstOperand.push(tempVar);
							}
						}
						if(operatorAr[operatorAr.length-2] === "*"){
							var tempVar = multiply(firstOperand[firstOperand.length-2] , firstOperand[firstOperand.length-1]);
							firstOperand.pop();
							firstOperand.pop();
							firstOperand.push(tempVar);
							// operatorAr.pop();
							// operatorAr.pop();
							// operatorAr.push(currentOperator);
						}
						if(operatorAr[operatorAr.length-2] === "/"){
							var tempVar = divide(firstOperand[firstOperand.length-2] , firstOperand[firstOperand.length-1]);
							firstOperand.pop();
							firstOperand.pop();
							firstOperand.push(tempVar);
							// operatorAr.pop();
							// operatorAr.pop();
							// operatorAr.push(currentOperator);
						}

						operatorAr.pop();
						operatorAr.pop();
						operatorAr.push(currentOperator);

						// operatorAr.shift();

					}


					if((((currentOperator === "*")||(currentOperator === "/"))&&(operatorAr.length>1)||((e.keyCode === 187)&&(!e.shiftKey)))&&(openIndex.length === 0)) {

						// firstOperand.push(secondOperand);
						// secondOperand = "";

						if(operatorAr[operatorAr.length-2] === "*"){
							var tempVar = multiply(firstOperand[firstOperand.length-2] , firstOperand[firstOperand.length-1]);
							firstOperand.pop();
							firstOperand.pop();
							firstOperand.push(tempVar);
							operatorAr.pop();
							operatorAr.pop();
							operatorAr.push(currentOperator);
						}
						if(operatorAr[operatorAr.length-2] === "/"){
							var tempVar = divide(firstOperand[firstOperand.length-2] , firstOperand[firstOperand.length-1]);
							firstOperand.pop();
							firstOperand.pop();
							firstOperand.push(tempVar);
							operatorAr.pop();
							operatorAr.pop();
							operatorAr.push(currentOperator);
						}



					}

				}


				// on equal todo

				if((e.keyCode === 187)&&(!e.shiftKey)){

					firstOperand.push(parseFloat(secondOperand));
					secondOperand = "";

					console.log("==========================" , firstOperand);
					console.log("==========================" , operatorAr);
					console.log("==========================" , openIndex);
					console.log("==========================" , closeIndex);

					finalAns = firstOperand[0];
					firstOperand.shift();

					for(var i=0 ; i<firstOperand.length ; i++){

						if(operatorAr[i] === "+"){
							finalAns = add(finalAns , firstOperand[i]);
						}
						if(operatorAr[i] === "-"){
							finalAns = sub(finalAns , firstOperand[i]);
						}
						if(operatorAr[i] === "*"){
							finalAns = multiply(finalAns , firstOperand[i]);
						}
						if(operatorAr[i] === "/"){
							finalAns = divide(finalAns , firstOperand[i]);
						}

					}

					firstOperand = [];
					operatorAr = [];
					firstOperand.push(finalAns);

				}


				// inserting brackets

				if(((e.keyCode === 57)&&(e.shiftKey))||((e.keyCode === 48)&&(e.shiftKey))){



					if(e.key === "("){
						if(secondOperand !== ""){
							firstOperand.push(secondOperand);
							secondOperand = "";
						}
						openIndex.push(firstOperand.length);
					}
					if(e.key === ")"){
						if(secondOperand !== ""){
							firstOperand.push(secondOperand);
							secondOperand = "";
						}
						closeIndex.push(firstOperand.length-1);

						var i = openIndex[openIndex.length-1]
						var tempOperandAr = [];
						var tempOperatorAr = [];

						tempOperandAr.push(firstOperand[i]);
						tempOperatorAr.push(operatorAr[i]);

						i++;

						while(i <= closeIndex[closeIndex.length-1]){

							if((operatorAr[i] === "+")||(operatorAr[i] === "-")){

								tempOperandAr.push(firstOperand[i]);
								tempOperatorAr.push(operatorAr[i]);

								if(tempOperatorAr[length-2] === "*"){
									var tempVar = multiply(tempOperandAr[i-1] , tempOperandAr[i]);
									tempOperandAr.pop();
									tempOperandAr.pop();
									tempOperandAr.push(tempVar);
									tempOperatorAr.shift();
								}
								if(tempOperatorAr[length-2] === "/"){
									var tempVar = divide(tempOperandAr[i-1] , tempOperandAr[i]);
									tempOperandAr.pop();
									tempOperandAr.pop();
									tempOperandAr.push(tempVar);
									tempOperatorAr.shift();
								}
								if(tempOperatorAr[length-2] === "+"){
									var tempVar = add(tempOperandAr[i-1] , tempOperandAr[i]);
									tempOperandAr.pop();
									tempOperandAr.pop();
									tempOperandAr.push(tempVar);
									tempOperatorAr.shift();
								}
								if(tempOperatorAr[length-2] === "-"){
									var tempVar = sub(tempOperandAr[i-1] , tempOperandAr[i]);
									tempOperandAr.pop();
									tempOperandAr.pop();
									tempOperandAr.push(tempVar);
									tempOperatorAr.shift();
								}

							}



							// if(operatorAr[i] === "+"){
							// 	var tempVar = add(firstOperand[i] , firstOperand[i+1]);
							// 	firstOperand.pop();
							// 	firstOperand.pop();
							// 	firstOperand.push(tempVar);
							// }
							// if(operatorAr[i] === "-"){
							// 	var tempVar = sub(firstOperand[i] , firstOperand[i+1]);
							// 	firstOperand.pop();
							// 	firstOperand.pop();
							// 	firstOperand.push(tempVar);
							// }
							//
							// closeIndex.pop();
							// openIndex.pop();
							// operatorAr.pop();
							i++;
						}


					}



				}



				this.setData('firstOperand' , firstOperand);
				this.setData('secondOperand' , secondOperand);
				this.setData('operatorAr' , operatorAr);
				this.setData('operator' , operator);
				this.setData('pushIndex' , pushIndex);
				this.setData('popIndex' , popIndex);
				this.setData('opPushIndex' , opPushIndex);
				this.setData('opPopIndex' , opPopIndex);
				this.setData('currentOperator' , currentOperator);
				this.setData('previousOperator' , previousOperator);
				this.setData('finalAns' , finalAns);



				if((((e.keyCode >= 48)&&(e.keyCode <= 57))||(e.keyCode === 190))&&(!e.shiftKey)){
					console.log("firstOperand" + "     " +this.getData('firstOperand'));
					console.log("operatorAr" + "       " +operatorAr);
					console.log("secondOperand" + "    " +this.getData('secondOperand'));
					console.log("--------------------------------------------------");
					// console.log(this.getData("firstOperand"));
				}
				if(((e.keyCode === 187)&&(e.shiftKey))||((e.keyCode === 189)&&(!e.shiftKey))||((e.keyCode === 56)&&(e.shiftKey))||((e.keyCode === 191)&&(!e.shiftKey))){
					// console.log("operatorAr" + "       " +operatorAr);
				}
				if(((e.keyCode === 57)&&(e.shiftKey))||((e.keyCode === 48)&&(e.shiftKey))){
					console.log("openIndex" + "        " +openIndex);
					console.log("closeIndex" + "       " +closeIndex);
				}
				if((e.keyCode === 187)&&(!e.shiftKey)){
					console.log("finalAns" + "         " + finalAns);
				}



				break;

			}
		}

	}
});
