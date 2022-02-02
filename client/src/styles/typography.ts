interface FontWeight {
  [index: string]: number;
}

interface FontProperties {
  [index: string]: string;
}

const fontWeights: FontWeight = {
  largest: 900,
  larger: 900,
  large: 900,
  mediumLarge: 900,
  medium: 700,
  mediumSmall: 700,
  small: 400,
  smaller: 400,
  smallest: 400,
};

const fontSizes: FontProperties = {
  largest: '3rem', // 48px
  larger: '2.5rem', // 40px
  large: '2rem', // 32px
  mediumLarge: '1.5rem', // 24px
  medium: '1.25rem', // 20px
  mediumSmall: '1rem', // 16px
  small: '0.8rem', // 12.8px
  smaller: '0.64rem', // 10.24px
  smallest: '0.5rem', // 8px
};

const lineHeights: FontProperties = {
  largest: '3.75rem',
  larger: '3rem',
  large: '2.25rem',
  mediumLarge: '1.875rem',
  medium: '1.5rem',
  mediumSmall: '1.25rem',
  small: '1rem',
  smaller: '0.75rem',
  smallest: '0.625rem',
};

const letterSpacings: FontProperties = {
  largest: '-1.53px',
  larger: '-1.22px',
  large: '-0.98px',
  mediumLarge: '-0.78px',
  medium: '-0.62px',
  mediumSmall: '-0.5px',
  small: '-0.4px',
  smaller: '-0.32px',
  smallest: '-0.26px',
};

const font = (type: string): string => {
  return `
    font-weight: ${fontWeights[type]};
    font-size: ${fontSizes[type]};
    line-height: ${lineHeights[type]};
    letter-spacing: ${letterSpacings[type]};
  `;
};

export const fontLargest = font('largest');
export const fontLarger = font('larger');
export const fontLarge = font('large');
export const fontMediumLarge = font('mediumLarge');
export const fontMedium = font('medium');
export const fontMediumSmall = font('mediumSmall');
export const fontSmall = font('small');
export const fontSmaller = font('smaller');
export const fontSmallest = font('smallest');
