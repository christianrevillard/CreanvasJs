/*var Test = Test || {};

Test.onload = function ()
{		
	var canvas = document.getElementById('theCanvas');

	var controller = new Testcontroller(canvas);

	var worker = new Worker("workerTest.js");
	
	canvas.addEventListener ("click", function(e)
	{
		worker.postMessage(e);
	}); 

	worker.onmessage = function(e)
	{
		alert(e.xy);
	};
	// proxy stuff test
	
};

var Testcontroller = function()
{
};*/