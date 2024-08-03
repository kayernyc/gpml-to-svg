import ansis from 'ansis';

export function gpsvgHelp(): string {
  return `
    ${ansis.bgBlack.blueBright(' GPSVG cli for converting GPlates files to vectors ')}

    Use this cli to convert multiple files into a single SVG, or a single 
    file into an SVG with a color gradient that colors features according
    to age as described by a color ramp.
  `;
}
