function hslToHex(h, s, l) {
      s /= 100;
      l /= 100;
      let c = (1 - Math.abs(2 * l - 1)) * s;
      let x = c * (1 - Math.abs((h / 60) % 2 - 1));
      let m = l - c / 2;
      let r = 0, g = 0, b = 0;
      if (0 <= h && h < 60) [r, g, b] = [c, x, 0];
      else if (60 <= h && h < 120) [r, g, b] = [x, c, 0];
      else if (120 <= h && h < 180) [r, g, b] = [0, c, x];
      else if (180 <= h && h < 240) [r, g, b] = [0, x, c];
      else if (240 <= h && h < 300) [r, g, b] = [x, 0, c];
      else if (300 <= h && h < 360) [r, g, b] = [c, 0, x];
      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);
      return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    }
    function getNearestColorName(hex) {
      function hexToRgb(h) {
        h = h.replace('#', '');
        return [
          parseInt(h.substring(0,2),16),
          parseInt(h.substring(2,4),16),
          parseInt(h.substring(4,6),16)
        ];
      }
      const [r1, g1, b1] = hexToRgb(hex);
      let minDist = Infinity;
      let nearest = COLOR_DICTIONARY[0].name;
      for (const color of COLOR_DICTIONARY) {
        const [r2, g2, b2] = hexToRgb(color.hex);
        const dist = Math.sqrt(
          Math.pow(r1 - r2, 2) +
          Math.pow(g1 - g2, 2) +
          Math.pow(b1 - b2, 2)
        );
        if (dist < minDist) {
          minDist = dist;
          nearest = color.name;
        }
      }
      return nearest;
    }
    function generatePalette() {
      const palette = document.getElementById('palette');
      palette.innerHTML = '';
      const schemeType = [
        'analogous', 'complementary', 'triadic', 'adjacent',
        'blackShades', 'whiteShades', 'contrastingTriadic'
      ];
      const selectedScheme = schemeType[Math.floor(Math.random() * schemeType.length)];
      const now = new Date();
const ms = now.getMilliseconds();
const randomFactor = Math.floor(Math.random() * 360);
const baseHue = Math.round(
  ((Date.now() / 1000) + Math.random() + ms / 1000 + randomFactor / 360)
  * 360
) % 360;
      const saturation = 70;
      const lightness = 50;
      let hues = [];
      switch (selectedScheme) {
        case 'analogous':
          hues = [baseHue, (baseHue + 30) % 360, (baseHue + 60) % 360];
          break;
        case 'complementary':
          hues = [baseHue, (baseHue + 180) % 360];
          break;
        case 'triadic':
          hues = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
          break;
        case 'adjacent':
          hues = [
            (baseHue + 15) % 360,
            (baseHue - 15 + 360) % 360
          ];
          break;
        case 'contrastingTriadic':
          hues = [
            baseHue,
            (baseHue + 120) % 360,
            (baseHue + 240) % 360
          ];
          break;
        case 'blackShades':
          const paletteShades = [];
          const ranges = [
            [17, 45],
            [46, 75],
            [76, 102]
          ];
          for (const [min, max] of ranges) {
            const value = Math.floor(Math.random() * (max - min + 1)) + min;
            const hex = value.toString(16).padStart(2, '0');
            paletteShades.push(`#${hex}${hex}${hex}`);
          }
          paletteShades.forEach(hex => {
            const boxContainer = document.createElement('div');
            boxContainer.className = 'color-box-container';
            const box = document.createElement('div');
            box.className = 'color-box cube3d';
            ['front','back','right','left','top','bottom'].forEach(face => {
              const faceDiv = document.createElement('div');
              faceDiv.className = 'cube-face ' + face;
              faceDiv.style.background = hex;
              box.appendChild(faceDiv);
            });
            const label = document.createElement('div');
            label.className = 'color-label';
            label.textContent = hex;
            const nameLabel = document.createElement('div');
            nameLabel.className = 'color-name-label';
            const value = parseInt(hex.slice(1, 3), 16);
            if (value < 30) nameLabel.textContent = 'Чёрный';
            else if (value < 60) nameLabel.textContent = 'Тёмно-серый';
            else nameLabel.textContent = 'Серый';
            boxContainer.appendChild(box);
            boxContainer.appendChild(label);
            boxContainer.appendChild(nameLabel);
            palette.appendChild(boxContainer);
          });
          return;
        case 'whiteShades':
          const paletteWhites = [];
          const whiteRanges = [
            [220, 240],
            [241, 250],
            [251, 255]
          ];
          for (const [min, max] of whiteRanges) {
            const value = Math.floor(Math.random() * (max - min + 1)) + min;
            const hex = value.toString(16).padStart(2, '0');
            paletteWhites.push(`#${hex}${hex}${hex}`);
          }
          paletteWhites.forEach(hex => {
            const boxContainer = document.createElement('div');
            boxContainer.className = 'color-box-container';
            const box = document.createElement('div');
            box.className = 'color-box cube3d';
            ['front','back','right','left','top','bottom'].forEach(face => {
              const faceDiv = document.createElement('div');
              faceDiv.className = 'cube-face ' + face;
              faceDiv.style.background = hex;
              box.appendChild(faceDiv);
            });
            const label = document.createElement('div');
            label.className = 'color-label';
            label.textContent = hex;
            const nameLabel = document.createElement('div');
            nameLabel.className = 'color-name-label';
            const value = parseInt(hex.slice(1, 3), 16);
            if (value > 245) nameLabel.textContent = 'Белый';
            else if (value > 235) nameLabel.textContent = 'Очень светло-серый';
            else nameLabel.textContent = 'Светло-серый';
            boxContainer.appendChild(box);
            boxContainer.appendChild(label);
            boxContainer.appendChild(nameLabel);
            palette.appendChild(boxContainer);
          });
          return;
      }
      for (let h of hues) {
        const s = saturation + (Math.random() - 0.5) * 30; 
        const l = lightness + (Math.random() - 0.5) * 30; 
        const hex = hslToHex(h, Math.max(40, Math.min(100, s)), Math.max(30, Math.min(80, l)));
        const boxContainer = document.createElement('div');
        boxContainer.className = 'color-box-container';
        const box = document.createElement('div');
        box.className = 'color-box cube3d';
        ['front','back','right','left','top','bottom'].forEach(face => {
          const faceDiv = document.createElement('div');
          faceDiv.className = 'cube-face ' + face;
          faceDiv.style.background = hex;
          box.appendChild(faceDiv);
        });
        const label = document.createElement('div');
        label.className = 'color-label';
        label.textContent = hex;
        const nameLabel = document.createElement('div');
        nameLabel.className = 'color-name-label';
        nameLabel.textContent = getNearestColorName(hex);
        boxContainer.appendChild(box);
        boxContainer.appendChild(label);
        boxContainer.appendChild(nameLabel);
        palette.appendChild(boxContainer);
      }
    }
    generatePalette();
    let lastTap = 0;
    document.querySelectorAll('.palette-box').forEach(box => {
      box.addEventListener('touchend', (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 400 && tapLength > 0) {
          e.preventDefault();
        }
        lastTap = currentTime;
      });
    });