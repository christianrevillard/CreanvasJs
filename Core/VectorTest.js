if (TEST)
{	
	(function()
	{
		var core = CreJs.Test.Core= CreJs.Test.Core|| {};
		
		core["test_Vector_constructor"] = function()
		{
			var x=1, y=2, z=3;
			
			var vector = new CreJs.Core.Vector(x,y,z);
			
			if(vector.vectorX != x)
			{
				return "FAILED! vector.x: Expected " + x + ", was " + vector.vectorX;
			}
			
			if(vector.vectorY != y)
			{
				return "FAILED! vector.y: Expected " + y + ", was " + vector.vectorY;
			}

			if(vector.vectorZ != z)
			{
				return "FAILED! vector.z: Expected " + z + ", was " + vector.vectorZ;
			}
			
			return "OK";
		};

		// vector.draw = function(context, x, y, color)
		// vector.getCoordinates = function(unitVectors)
		// vector.setCoordinates = function(unitVectors, u, v, w)
		
		// core.getUnitVectors = function(x1, y1, x2, y2)
		// core.drawUnitVectors = function(context, x, y, unitVectors, color)
		// core.drawCoordinateVector = function(context, x, y, unitVectors, ux, vx, color)
		// core.scalarProduct = function(v1, v2)
		//	core.vectorProduct = function(v1,v2)
			
	})();
};