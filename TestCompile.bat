java ^
-jar ..\closure-compiler\compiler.jar ^
--js ^
	./js/Core/testCompile.js ^
--js_output_file out/testCompile.js ^
--formatting=pretty_print ^
--compilation_level ADVANCED_OPTIMIZATIONS

