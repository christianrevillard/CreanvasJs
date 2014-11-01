// TODO, log levels, other logging output.
(function()
{
	var isLogging = true; // on/off, to improve... Or just test DEBUG? to see...
	
	var log = CreJs.Crelog = CreJs.Crelog || {};
	
	log.Logger = function()
	{
		this.logMessage = function(logData)
		{
			if (!isLogging)
				return;
			
			console.log(logData);
		};
	};	
	
	// Available after ADVANCED_OPTIMIZATION 
	// Needed ??
	CreJs["Crelog"] = log;
	log["Logger"] = log.Logger;
	log.Logger["log"] = log.Logger.logMessage;	
}());