var CreJs = CreJs || {};

CreJs.CreHelpers = CreJs.CreHelpers || {};

(function()
{
	var helpers = CreJs.CreHelpers;
	
	helpers.GetGuid = function()
	{
		var timeStampPart = Date.now().toString(16);
		var tail = helpers.repeatString('x',15-timeStampPart.length) + timeStampPart; 
		var template = 'xxxxxxxx-xxxx-4xxx-y' + tail.slice(0,3) + '-' + tail.slice(3);
		return template.replace(
				/[xy]/g, 
				function(c) {					
					var r = Math.random()*16|0;
					var v = c == 'x' ? r : (r&0x3|0x8);
					return v.toString(16);});		
	};	
	
	helpers.repeatString = function s(s,n)
	{
		if (n<=0)
			return '';
		
		return s + helpers.repeatString(s, n-1)
	};
})();