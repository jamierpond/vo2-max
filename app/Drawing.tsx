function getFirePath(
  centerX: number,
  centerY: number,
  radius: number,
  lineWidth: number,
): string {
  const fireWidth = radius * 0.6;
  const fireHeight = radius * 0.8;
  const fireLeft = centerX - fireWidth / 2;
  const fireTop = centerY - fireHeight / 2;

  return `<path d="M${fireLeft},${fireTop + fireHeight * 0.7}
    Q${fireLeft + fireWidth * 0.4},${fireTop + fireHeight * 0.4} ${fireLeft + fireWidth / 2},${fireTop}
    Q${fireLeft + fireWidth * 0.6},${fireTop + fireHeight * 0.4} ${fireLeft + fireWidth},${fireTop + fireHeight * 0.7}
    Q${fireLeft + fireWidth * 0.7},${fireTop + fireHeight} ${fireLeft + fireWidth / 2},${fireTop + fireHeight}
    Q${fireLeft + fireWidth * 0.3},${fireTop + fireHeight} ${fireLeft},${fireTop + fireHeight * 0.7}
    Z" fill="#FF5722" stroke="white" stroke-width="${lineWidth * 0.2}"/>`;
}

function getSnowflakePath(
  centerX: number,
  centerY: number,
  radius: number,
  lineWidth: number,
): string {
  const snowflakeSize = radius * 0.6;
  const snowflakeLeft = centerX - snowflakeSize / 2;
  const snowflakeTop = centerY - snowflakeSize / 2;

  return `<path d="M${centerX},${snowflakeTop}
    L${centerX},${snowflakeTop + snowflakeSize}
    M${snowflakeLeft},${centerY}
    L${snowflakeLeft + snowflakeSize},${centerY}
    M${snowflakeLeft + snowflakeSize * 0.3},${snowflakeTop + snowflakeSize * 0.3}
    L${snowflakeLeft + snowflakeSize * 0.7},${snowflakeTop + snowflakeSize * 0.7}
    M${snowflakeLeft + snowflakeSize * 0.3},${snowflakeTop + snowflakeSize * 0.7}
    L${snowflakeLeft + snowflakeSize * 0.7},${snowflakeTop + snowflakeSize * 0.3}"
    stroke="#2196F3" stroke-width="${lineWidth * 0.2}" fill="none"/>`;
}

export function progressImageSvgString(
  amount: number,
  width: number,
  height: number,
  isHighIntensity: boolean = true
): string {
  const lineWithRatio = 0.1;
  const lineWidth = Math.min(width, height) * lineWithRatio;
  const radius = Math.min(width, height) / 2 - lineWidth;
  const centerX = width / 2;
  const centerY = height / 2;

  const backgroundCircle = `<circle cx="${centerX}" cy="${centerY}" r="${radius}" stroke="#ddd" stroke-width="${lineWidth}" fill="black"/>`;

  const fullCircle = 2 * Math.PI * radius;
  const progressLength = (amount / 100) * fullCircle;
  const offset = fullCircle - progressLength;

  const color = isHighIntensity ? "#FF5722" : "#2196F3";

  const foregroundCircle = `<circle cx="${centerX}" cy="${centerY}" r="${radius}" stroke="${color}" stroke-width="${lineWidth}" fill="none"
    stroke-dasharray="${fullCircle}" stroke-dashoffset="${offset}" transform="rotate(-90 ${centerX} ${centerY})"/>`;

  const centreIcon = isHighIntensity
    ? getFirePath(centerX, centerY, radius, lineWidth)
    : getSnowflakePath(centerX, centerY, radius, lineWidth);

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    ${backgroundCircle}
    ${foregroundCircle}
    ${centreIcon}
  </svg>`;

  return svg;
}


