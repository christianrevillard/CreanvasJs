importScripts("HeavyLoadController.js");

var controller = new CreJs.Creanvas.HeavyLoadController();

onmessage = function(e)
{
	postMessage("Asynchronous task: " + e.data); 
	controller.receiveMessage(e.data);
};

controller.sendMessage = function(data)
{
	postMessage("Asynchronous response: " + data);
	postMessage(data);
}; 