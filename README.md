<p align="center">
    <h1 align="center">GPML</h1>
    <h3 align="center">Convert vectors in GPlates to vectors in SVGs from your terminal program.</h3>
</p>

<table border="0">
    <tr align="center">
        <td>
        Feature in GPlates<br/> at beginning of simulation
        <img src="./documentationAssets/gplatesShot.png"></img>
        </td>
        <td>Feature in GPlates
        <img src="./documentationAssets/testPlanet1000.png"></img>
        </td>
    </tr>
    <tr align="center">
      <td colspan=2><a href="./documentationAssets/testPlanet1000.svg">Link to svg</a></td>
    </tr>
      <tr align="center">
        <td>
        Feature in GPlates<br/> after transformations
        <img src="./documentationAssets/gplatesShot700.png"></img>
        </td>
        <td>Feature in GPlates
        <img src="./documentationAssets/testPlanet1000.png"></img>
        </td>
    </tr>
    <tr align="center">
      <td colspan=2><a href="./documentationAssets/testPlanet1000.svg">Link to svg</a></td>
    </tr>
</table>

GPML-to-SVG is currently in **alpha**. You can get useful results if the shapes you are trying to convert are `SHAPES` according to GPlates and not lines or dots. _Continental Crust_ and _Ocean Crust_ are safe bets.

### System requirement
- Node 20 or higher

Node is a javascript runtime that is compatible with the major operating systems. You do not need to know Node to use this command line tool.

[How to install Node](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) 



To run the conversion, navigate to the project folder locally and run the `convert` command, 

where  `<FULL PATH>` is the complete path to the target file. 

where  `<DESTINATION DIRECTORY>` is the complete path to the target destination folder, 

`<COLOR>` is a valid CSS color name or HEX value (keep the double quotes), which defaults to gray if no other color is passed in.

and `<TIME>` is the moment in the model when all the shapes you want converted exist.

`<ROTATION FILE>` is an optional parameter if you want to specify a rotation file in a different location than any of the directories you list. Otherwise the CLI will look for a rotation file near files you have added as parameters. 

`-mc` or `--multi-color` is an optional parameter for generating multiple colors based on the primary color.

`-fn` or `--file-name` is an optional parameter for the name of the output svg. If no name is provided, the CLI will ask for one during conversion.

Destination, time and a file to convert are required. If you're not passing in a directory of files, the tool will attempt to find a rotation file near any of the files you pass in, and will use the first it finds.

**The path or paths you want to convert *MUST* come last.**

`node dist/index.js convert -d <DESTINATION DIRECTORY> -c "<COLOR>" -t <TIME> <FULL PATH>`

Please note: any path with spaces **must be in quotes.**

### Example:
FULL PATH: `/Users/imauser/folderName/Big\ continents:dinosaur\ friendly.gpml`

DESTINATION PATH: `/Users/imauser/testTheCode/`

COLOR: `teal` or `008080` or `#008080`

TIME: 900

ROTATION FILE: `/Users/imauser/folderName/shared.rot`

`node dist/index.js convert -d /Users/imauser/testTheCode/-c "008080" -t 900 "/Users/imauser/folderName/Big\ continents:dinosaur\ friendly.gpml"`

You can convert multiple files into one SVG.

`node dist/index.js convert -c "008080" -t 900 -r /Users/imauser/folderName/shared.rot "/Users/imauser/folderName/Big\ continents:dinosaur\ friendly.gpml" "/Users/imauser/folderName/Big\ continents:terror\  bird.gpml"`

or a directory.

`node dist/index.js convert -c "008080" -t 900 -r /Users/imauser/folderName/shared.rot /Users/imauser/folderName`

or combinations

`node dist/index.js convert -c "008080" -t 900 -r /Users/imauser/folderName/shared.rot /Users/imauser/folderName /Users/imauser/folderName2/bigDino.gpml`

### Limitations
As of this version (0.0.3  alpha) 
- only shapes and lines will get converted
- every file gets converted to a `<g>` group, which can be selected as a group by Illustrator

**To use local version:**
1. install Node v20.1.0 or higher: [How to install Node](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)
2. clone GPML-to-SVG locally
3. navigate into the GPML-to-SVG directory
4. run `npm install`
5. run `npm run build`

-----------
I don't have a PC, so if anyone is willing to test this on a PC, I would appreciate the collaboration.


------------

## research

https://alexewerlof.medium.com/node-shebang-e1d4b02f731d
https://tsmx.net/commander-options/

https://gist.github.com/dominikwilkowski/cba6c8c6b1ded8d3e3cc6bf0b7ddc432