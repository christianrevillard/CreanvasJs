java ^
-jar ..\closure-compiler\compiler.jar ^
--js ^
	./js/Core/*.js ^
	./js/Creanvas/*.js ^
	./js/Creanvas/ElementDecorators/*.js ^
	./js/Creevents/*.js ./js/CreHelpers/*.js ^
	./js/Crelog/*.js ^
--js_output_file js/CreanvasDebug.js ^
--define TEST=false ^
--define DEBUG=true ^
--compilation_level SIMPLE_OPTIMIZATIONS