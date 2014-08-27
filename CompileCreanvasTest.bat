java ^
-jar ..\closure-compiler\compiler.jar ^
--js ^
	./js/Core/*.js ^
	./js/Creanvas/*.js ^
	./js/Creanvas/ElementDecorators/*.js ^
	./js/Creevents/*.js ./js/CreHelpers/*.js ^
	./js/Crelog/*.js ^
--js_output_file out/CreanvasTest.js ^
--define TEST=true ^
--define DEBUG=false ^
--compilation_level SIMPLE_OPTIMIZATIONS

copy out\CreanvasTest.js C:\Users\Christian\Development\WebApps\lib\CreanvasTest.js
