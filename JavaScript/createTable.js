//	Type:			UiPath Inject JavaScript
//	Use: 			Finacle Table Extractor
//	Description: 	Finacle uses JSON objects to communicate with the server and store in JavaScript.
//					This script will access the variable and create a HTML table and a textfield to store the CSV version.
//					The script will also return the CSV back to UiPath.
//	Author:			Enis Husyein
//	Versions:		12-10-2019 - Initial Build
//


function(element,inputParameters) {
	try {

		//inputParameters = FinacleTableObject|FinacelTableID|FinacleContainer|OutputType(csv or table)

		var parms = inputParameters.split('|');
		
		var objTable 		 =  parms[0];		//FinacleTableObject
		var sFinacleTableID	 =  parms[1];		//FinacelTableID
		var divContainer 	 =  parms[2];		//FinacleContainer
		var sExportOption 	 =  parms[3];		//OutputType (csv or table)
		var varFrameLocation =  parms[4];		//FinacleFrameLocation

		var outputDIV = document.createElement('div'); 
		outputDIV.id = "DIV_" + sFinacleTableID;
		
		//you can comment out the following line to debug
		outputDIV.style='display:none';

		//create the javascript to build the table
		var script = document.createElement( 'script' );
		script.type = 'text/javascript';

		//construct the javascript, store in variable and append to required page for processing
		script.text =  	
				"var objTable 			= " + varFrameLocation + '.' + objTable + "; \n" +
				"var sExportOption 		= \"" + sExportOption + "\"; \n" +
				"var divContainer		= " + varFrameLocation + ".document.getElementById('DIV_" + sFinacleTableID + "'); \n\n" +

				"function buildTable(data) { \n" +
				"var sCSV = \"\";  \n" +
				"var sTemp = \"\";  \n" +
				"var table = document.createElement('table');  \n" +
				"table.id='" + sFinacleTableID + "';  \n" +
				"var thead = document.createElement('thead');  \n" +
				"var tbody = document.createElement('tbody');  \n" +
				"var headerNames = Object.getOwnPropertyNames(data[0]);  \n" +
				"var headRow = document.createElement('tr'); \n"+
				
			
				"headerNames.forEach(function(el) { \n"+
				"  var th=document.createElement('th'); \n"+
				"  th.appendChild(document.createTextNode(el)); \n"+
				
				"  sCSV = sCSV + el + '|'; \n" +
				"  sCSV = sCSV.substring(0, sCSV.length - 1); \n" +
				
				"  headRow.appendChild(th); \n"+
				"}); \n"+
				
				"  sCSV = sCSV + String.fromCharCode(13); \n" +
				
				"thead.appendChild(headRow); \n"+
				"table.appendChild(thead);  \n"+
				
				"data.forEach(function(el) { \n"+
				"  var tr = document.createElement('tr'); \n"+
				"  for (var o in el) {   \n" +
				"	var td = document.createElement('td'); \n" +
				"	td.appendChild(document.createTextNode(el[o])); \n"+
				"	tr.appendChild(td); \n"+				
				
				"   sTemp = sTemp + el[o] + '|'; \n" +
				
				"  } \n"+
				
				"  sCSV = sCSV + sTemp.substring(0, sTemp.length - 1) + String.fromCharCode(13); \n" +	
								
				"  sTemp = ''; \n" +
				
				"  tbody.appendChild(tr);  \n"+
				"}); \n"+
				"  sCSV = sCSV + '\\n'; \n" +
				"table.appendChild(tbody);    \n"+          
				"//this is where the table will be displayed \n"+
				"divContainer.appendChild( table ); \n" +
				
				"//this is where the csv will be displayed \n"+
				"var formCSV = document.createElement('p');  \n" +
				"formCSV.id='" + sFinacleTableID + "CSV';  \n" +
				"formCSV.name='" + sFinacleTableID + "CSV';  \n" +
				"formCSV.style='display:none'; \n" +
				"formCSV.appendChild(document.createTextNode(sCSV)); \n"+
				"divContainer.appendChild( formCSV ); \n" +


				"} \n"+	

				//pass in the object of the table data to get processed
				"buildTable(objTable);";
				
		//check if this has run before and delete the content so it's fresh
		if (eval(varFrameLocation).document.getElementById("DIV_" + sFinacleTableID)) { 
			eval(varFrameLocation).document.getElementById("DIV_" + sFinacleTableID).remove();			
		};
		
		//create the DIV container to add the required elements
		eval(varFrameLocation).document.getElementById(divContainer).appendChild( outputDIV );
		
		//add the requied elements into the DIV container
		eval(varFrameLocation).document.getElementById("DIV_" + sFinacleTableID).appendChild( script );	
		
		//return the data from the CSV extract to uiPath
		//this has been disabled, as it seems that it gets the value before it completes the variable load.
		//return eval(varFrameLocation).document.getElementById(sFinacleTableID + 'CSV').innerText;
		
		return ""		
		
	}
	catch(error) {
	  console.error(error);
	  return error;
	  // expected output: ReferenceError: nonExistentFunction is not defined
	  // Note - error messages will vary depending on browser
	}
}
