import { SVG_MAP } from './SVG_MAP';

export function getIcon(code) {
  return SVG_MAP.get(code);
}
