	//doing the job, synchronous or in worker thread.

var CreJs = CreJs || {};

(function(){
	
	CreJs.Creanvas = CreJs.Creanvas || {};		

	// heavy load stuff can be handled here. Collision, gravity, things involving several elements
	CreJs.Creanvas.HeavyLoadController = function() {
		
		var heavyLoadController = this;
				
		this.receiveMessage = function (e)
		{
			heavyLoadController.sendMessage("Yes, handled " + e + " !");			
		};
	};
}());