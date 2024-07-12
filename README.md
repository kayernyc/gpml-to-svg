# GPML to SVG
### A utility for GPLATES

Convert vectors in GPlates to vectors in SVGs.

GPML-to-SVG is currently in `alpha`. It is very annoying to use, but you can get useful results if:

- you know which files you want to convert
- the shapes you are trying to convert are `SHAPES` according to GPlates and not lines or dots. _Continental Crust_ and _Ocean Crust_ are safe bets.


**To use:**
1. install Node v20.1.0 or higher 
2. clone GPML-to-SVG locally
3. navigate into the GPML-to-SVG directory
4. run `npm install`
5. run `npm run build`


To run the conversion, navigate to the project folder locally and run this command, 

where  `<FULL PATH>` is the complete path to the target file, 

`<COLOR>` is a valid CSS color name or HEX value (keep the double quotes), 

and `<TIME>` is the moment in the model when all the shapes you want converted exist.

`<ROTATION FILE>` is an optional parameter if you want to specify a rotation file in a different location than any of the directories you list. Otherwise the CLI will look for a rotation file near files you have added as parameters.

`node dist/index.js convert -c "<COLOR>" -t <TIME> <FULL PATH>`

### Example:
FULL PATH: `/Users/imauser/folderName/Big\ continents:dinosaur\ friendly.gpml`

COLOR: `teal` or `008080` or `#008080`

TIME: 900

ROTATION FILE: `/Users/imauser/folderName/shared.rot`

`node dist/index.js convert -c "008080" -t 900 /Users/imauser/folderName/Big\ continents:dinosaur\ friendly.gpml`

You can convert multiple files into one SVG.

`node dist/index.js convert -c "008080" -t 900 -r /Users/imauser/folderName/shared.rot /Users/imauser/folderName/Big\ continents:dinosaur\ friendly.gpml /Users/imauser/folderName/Big\ continents:terror\  bird.gpml`

-----------
I don't have a PC, so if anyone is willing to test this on a PC, I would appreciate the collaboration.