# GPML to SVG
### A utility for GPLATES

Convert vectors in GPlates to vectors in SVGs.

This project is currently in `alpha`. It is very annoying to use, but you can get useful results if:

- you're converting a file with no transformations
- you know which files you want to convert
- the shapes you are trying to convert are `SHAPES` according to GPlates and not lines or dots. _Continental Crust_ and _Ocean Crust_ are safe bets.


**To use:**
1. install Node v20.1.0 or higher 
2. clone the project locally
3. navigate into the project directory
4. run `npm install`
5. run `npm run build`


To run the conversion, navigate to the project folder locally and run this command, 

where  `<FULL PATH>` is the complete path to the target file, 

`<COLOR>` is a valid CSS color name or HEX value (keep the double quotes), 

and `<TIME>` is the moment in the model when all the shapes you want converted exist.

`node dist/index.js convert <FULL PATH> -c "<COLOR>" -t <TIME>`

### Example:
FULL PATH: `/Users/imauser/folderName/Big\ continents:dinosaur\ friendly.gpml`

COLOR: `teal` or `008080` or `#008080`

TIME: 900

`node dist/index.js convert /Users/imauser/folderName/Big\ continents:dinosaur\ friendly.gpml -c "008080" -t 900`

-----------
I don't have a PC, so if anyone is willing to test this on a PC, I would appreciate the collaboration.