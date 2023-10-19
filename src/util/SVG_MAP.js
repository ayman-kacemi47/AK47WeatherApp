export const SVG_MAP = new Map();

function addMapElement(val, svg) {
  val.forEach((code) => SVG_MAP.set(code, svg));
}

addMapElement([0], 'sun');
addMapElement([1, 2, 3], 'sun-behind-cloud');
addMapElement([45, 48], 'smog');
addMapElement([51, 53, 55, 61, 63, 65, 66, 67], 'cloud-with-rain');
addMapElement([56, 57], 'cloud-with-lightning-and-rain');
addMapElement([71, 73, 75, 77], 'cloud-with-snow');
addMapElement([80, 81, 82, 85, 86], 'sun-behind-rain-cloud');
addMapElement([95, 96, 99], 'cloud-with-lightning');
