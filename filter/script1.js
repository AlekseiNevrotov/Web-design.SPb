const upload = document.getElementById('upload');
const preview = document.getElementById('preview');
const output = document.getElementById('asciiOutput');
const chars = '@#W$9876543210?!abc;:+=-,._ '.split('').reverse();
const palettes = [
  ['#6A9955', '#569CD6', '#C586C0', '#CE9178', '#DCDCAA', '#D4D4D4', '#808080'],
  ['#F92672', '#A6E22E', '#66D9EF', '#FD971F', '#E6DB74', '#F8F8F2', '#75715E'],
  ['#268BD2', '#2AA198', '#859900', '#B58900', '#CB4B16', '#DC322F', '#EEE8D5'],
  ['#8BE9FD', '#50FA7B', '#BD93F9', '#FF79C6', '#FFB86C', '#F8F8F2', '#6272A4'],
  ['#61AFEF', '#98C379', '#E5C07B', '#E06C75', '#C678DD', '#ABB2BF', '#5C6370']
];
const colorPalette = palettes[Math.floor(Math.random() * palettes.length)];
const isMobile = window.innerWidth <= 600;
const maxWidth = isMobile ? 80 : 120;
upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.onload = () => {
    const ctx = preview.getContext('2d');
    const aspectRatioCorrection = isMobile ? 0.8 : 1;
    const scale = maxWidth / img.width;
    const width = Math.floor(img.width * scale);
    const height = Math.floor(img.height * scale * aspectRatioCorrection);
    preview.width = width;
    preview.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height).data;
    let ascii = '';
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const offset = (y * width + x) * 4;
        const r = imageData[offset];
        const g = imageData[offset + 1];
        const b = imageData[offset + 2];
        const brightness = (r + g + b) / 3;
        const charIndex = Math.floor(brightness / 255 * (chars.length - 1));
        const colorIndex = Math.floor(brightness / 255 * (colorPalette.length - 1));
        const char = chars[charIndex];
        const color = colorPalette[colorIndex];
        ascii += `<span style="color:${color}">${char}</span>`;
      }
      ascii += '\n';
    }
    output.innerHTML = ascii;
    let oldWrapper = document.getElementById('downloadPngWrapper');
    if (oldWrapper) oldWrapper.remove();
    const wrapper = document.createElement('div');
    wrapper.id = 'downloadPngWrapper';
    const savePngButton = document.createElement('button');
    savePngButton.textContent = 'Скачать PNG';
    savePngButton.id = 'downloadPng';
    const progressBar = document.createElement('div');
    progressBar.id = 'downloadPngProgress';
    wrapper.appendChild(savePngButton);
    wrapper.appendChild(progressBar);
    output.after(wrapper);
    savePngButton.addEventListener('click', () => {
      savePngButton.classList.add('loading');
      progressBar.style.width = '0';
      progressBar.style.transition = 'none';
      setTimeout(() => {
        progressBar.style.transition = 'width 2s ease';
        progressBar.style.width = '100%';
      }, 50);
      html2canvas(output, {
        backgroundColor: '#000',
        scale: 10,
        useCORS: true
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'ascii-art.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        progressBar.style.width = '100%';
        setTimeout(() => {
          savePngButton.classList.remove('loading');
          progressBar.style.width = '0';
        }, 500);
      });
    });
  };
  const reader = new FileReader();
  reader.onload = (event) => {
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});