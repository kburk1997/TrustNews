//Load JSON
function loadJSON(callback) {
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', 'data.json', true);
	xobj.onreadystatechange = function () {
	if (xobj.readyState == 4 && xobj.status == "200") {

	// .open will NOT return a value but simply returns undefined in async mode so use a callback
	callback(xobj.responseText);

	}
	}
	xobj.send(null);

	}




//Get current url of tab
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };



  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

//This is a very bad thing and I probably shouldn't do it
var explanationText = ""; 

//RenderStatus
//Changes the status of the popup
function renderStatus(statusText) {
 document.getElementById('status').textContent = statusText;
}

function renderSatire(statusText) {
 document.getElementById('satire').textContent = statusText;
}

function renderReliability(statusText) {
 document.getElementById('reliability').textContent = statusText;
}
function renderRating(statusText) {
 document.getElementById('rating').textContent = statusText;
}

function renderExplanation(statusText) {
 document.getElementById('explanation').textContent = statusText;
}

function showMore(){
	renderExplanation(explanationText);
}
//Main function
document.addEventListener('DOMContentLoaded', function() {


	var host_name;
	//get url of current tab
  getCurrentTabUrl(function(url) {
     // Parse and display URL
   	 var parser = document.createElement('a');
		parser.href = url;
		 
		parser.protocol; // => "http:"
		parser.hostname; // => "example.com"
		parser.port;     // => "3000"
		parser.pathname; // => "/pathname/"
		parser.search;   // => "?search=test"
		parser.hash;     // => "#hash"
		parser.host;     // => "example.com:3000"

		host_name = parser.hostname;
     //renderStatus(host_name);
  });

  //Load data
	// Call to function with anonymous callback
	loadJSON(function(response) {
		// Do Something with the response e.g.
		jsonresponse = JSON.parse(response);

		// Assuming json data is wrapped in square brackets as Drew suggests
		//Create a variable to see if match found
		var matchFound = false;
		//Create a variable

		//Loop through the entire json (test)
		for(i = 0; i<69; ++i){
			//Check if we are on a news site
			if(host_name == jsonresponse[i].url_){
				renderStatus("You are on " + jsonresponse[i].content);
				matchFound = true;
				//Check if we are on a satire site
				if(jsonresponse[i].satire){
					renderSatire(jsonresponse[i].content+ " is a satire news source.");
				}

				//Render rating if we are not
				else{
					renderReliability(jsonresponse[i].content+" has a reliability rating of: ");
					renderRating(jsonresponse[i].reliability + " out of 10" );

					//Change background color based on value
					if(jsonresponse[i].reliability < 3)
						document.body.style.backgroundColor = "#FF8080";
					else if(jsonresponse[i].reliability < 5)
						document.body.style.backgroundColor = "#FFC080";
					else if(jsonresponse[i].reliability < 6)
						document.body.style.backgroundColor = "#FFD480";
					else if(jsonresponse[i].reliability < 7)
						document.body.style.backgroundColor = "#FFE580";
					else if(jsonresponse[i].reliability < 8)
						document.body.style.backgroundColor = "#DFFF80";
					else if(jsonresponse[i].reliability < 9)
						document.body.style.backgroundColor = "#9FFF80";
					else
						document.body.style.backgroundColor = "#80FFCC";
				}

				explanationText = jsonresponse[i].explanation;
				renderExplanation(explanationText);
			}
		}

		//Check if match still not found
		if(!matchFound){
			renderStatus("We cannot determine if you are on a news site");
		}

	});
});
