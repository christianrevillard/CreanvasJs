var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators["customTimer"] = 
	{
		applyTo: function(element, customTimerData)
		{	
			setInterval(
				function()
				{
					customTimerData["action"].call(element);					
				},
				customTimerData["time"]);
		}
	};
}());
