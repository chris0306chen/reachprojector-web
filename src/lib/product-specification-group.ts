import type { SpecificationGroup } from './product-detail';

export function getLegacySpecificationGroup(name: string): SpecificationGroup {
  const label = name.trim().toLowerCase();
  const groups: [SpecificationGroup, string[]][] = [
    ['Optical', ['light source', 'laser life', 'throw ratio', 'optical zoom', 'lens shift', 'iris', 'aperture system']],
    ['Display', ['resolution', 'resolution / refresh rate', 'projection size', 'screen size', 'brightness', 'color space', 'color gamut', 'contrast ratio', 'native contrast ratio', 'viewing contrast with iris', 'hdr', '3d', 'aspect ratio', 'display tech']],
    ['System', ['chipset', 'smart tv platform', 'screen mirroring', 'ram', 'storage', 'automatic functions', 'audio/video', 'surround sound']],
    ['Connectivity', ['wi-fi', 'bluetooth', 'ethernet', 'hdmi', 'hdmi earc / cec', 'usb', 'audio output', 'digital audio output', 'analog audio output']],
    ['Power', ['power supply', 'power consumption', 'standby consumption']],
    ['Dimensions', ['product dimensions', 'product weight', 'weight']],
    ['Package', ['packaged dimensions', 'packaged weight']],
  ];
  return groups.find(([, labels]) => labels.includes(label))?.[0] || 'Other';
}
