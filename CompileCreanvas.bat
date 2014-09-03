java ^
-jar ..\closure-compiler\compiler.jar ^
--js ^
	./js/Core/*.js ^
	./js/Creanvas/*.js ^
	./js/Creanvas/ElementDecorators/*.js ^
	./js/Creevents/*.js ./js/CreHelpers/*.js ^
	./js/Crelog/*.js ^
--js_output_file out/Creanvas.js ^
--define TEST=false ^
--define DEBUG=true ^
--formatting=pretty_print ^
--compilation_level ADVANCED_OPTIMIZATIONS

copy out\Creanvas.js C:\Users\Christian\Development\WebApps\lib\Creanvas.js
