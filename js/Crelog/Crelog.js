// TODO, log levels, other logging output.

var CreJs = CreJs || {};

(function()
{
	var isLogging = false; // on/off, to improve...
	
	var log = CreJs.Crelog = CreJs.Crelog || {};
	
	log.Logger = function()
	{
		this.log = function(logData)
		{
			if (!isLogging)
				return;
			
			console.log(logData);
		};
	};	
}());