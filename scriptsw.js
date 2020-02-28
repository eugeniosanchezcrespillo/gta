/*jshint browser:true */
/* eslint-env browser */
/* eslint no-use-before-define:0 */
/*global Uint8Array, Uint16Array, ArrayBuffer */
/*global XLSX */
var X = XLSX;
var XW = {
	/* worker message */
	msg: 'xlsx',
	/* worker scripts */
	worker: './xlsxworker.js'
};

var global_wb;

var process_wb = (function() {

	var OUT = document.getElementById('out');

	var to_csv = function to_csv(workbook) {
		//alert("paso to_csv");
		var result = [];
		workbook.SheetNames.forEach(function(sheetName) {
			var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);
			if(csv.length){
				result.push("SHEET: " + sheetName);
				result.push("");
				result.push(csv);
			}
		}); 
		//alert(result.join("\n"));
		return result;
	};

	return function process_wb(wb) {
		global_wb = wb;
		var output = to_csv(wb);
		//alert(output);
		if (OUT.innerText === undefined){
			//alert("innerContent")
			
			OUT.textContent += output;
		}	
		else {
			//alert("innerText");
			//alert(output);
			OUT.innerText += output;
		}
			
		
			//alert("paso process_wb");
			//if(typeof console !== 'undefined') 
			//console.log("output", new Date());
	};
})();

var setfmt = window.setfmt = function setfmt() { if(global_wb) process_wb(global_wb); };

/*var b64it = window.b64it = (function() {
	var tarea = document.getElementById('b64data');
	return function b64it() {
		if(typeof console !== 'undefined') console.log("onload", new Date());
		var wb = X.read(tarea.value, {type:'base64', WTF:false});
		process_wb(wb);
	};
})();
*/
var do_file = (function() {
	
	return function do_file(files) {
		/*OLD 1 file 
		var f = files[0];
		var reader = new FileReader();

		reader.onload = function(e) {
			var data = e.target.result;
			data = new Uint8Array(data); 
			process_wb(X.read(data, {type: 'array'}));
		};

		reader.readAsArrayBuffer(f);*/
		 
		//All files
		
		

		for (var i = 0; i < files.length; i++) {
			
			//alert("paso files "+i);
			var f = files[i];
			var reader = new FileReader();	
			
			reader.onload = function(e) {
				var data = e.target.result;
				data = new Uint8Array(data); 
				process_wb(X.read(data, {type: 'array'}));
			};

			reader.readAsArrayBuffer(f);
		}
	};
})();

(function() {
	var xlsf = document.getElementById('xls_gta_file');
	if(!xlsf.addEventListener) return;

	function handleFile(e) { do_file(e.target.files); }
	xlsf.addEventListener('change', handleFile, false);
		

	/* OLD 
	
	var xlsf = document.getElementById('xls_gta_file');
	if(!xlsf.addEventListener) return;
	function handleFile(e) { do_file(e.target.files); }
	xlsf.addEventListener('change', handleFile, false);
	
	*/
})();
