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
//RenderStatus
//Changes the status of the popup
function renderStatus(statusText) {
 document.getElementById('status').textContent = statusText;
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
     renderStatus(host_name);
  });

  //Load data
	// Call to function with anonymous callback
	loadJSON(function(response) {
		// Do Something with the response e.g.
		jsonresponse = JSON.parse(response);

		// Assuming json data is wrapped in square brackets as Drew suggests
		//Loop through the entire json (test)
		for(i = 0; i<31; ++i){
			//Check if we are on a news site
			if(host_name == jsonresponse[i].url_){
				renderStatus("You are on " + jsonresponse[i].content);
			}
		}

	});
});
