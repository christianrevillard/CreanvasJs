java ^
-jar ..\closure-compiler\compiler.jar ^
--js ^
	./js/Core/*.js ^
	./js/Creanvas/*.js ^
	./js/Creanvas/ElementDecorators/*.js ^
	./js/Creevents/*.js ./js/CreHelpers/*.js ^
	./js/Crelog/*.js ^
	./js/CreanvasNodeClient/*.js ^
--js_output_file out/CreanvasTest.js ^
--define TEST=true ^
--define DEBUG=false ^
--externs js/externs.js ^
--formatting=pretty_print ^
--compilation_level SIMPLE_OPTIMIZATIONS

copy out\CreanvasTest.js C:\Users\Christian\Development\WebApps\lib\CreanvasTest.js
copy out\CreanvasTest.js C:\Users\Christian\Development\NodeJs\TestNodeJs\resources\WebApps\lib\CreanvasTest.js
