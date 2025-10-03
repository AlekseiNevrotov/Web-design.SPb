const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.querySelector('.three-container');
container.appendChild(renderer.domElement);

const geometry = new THREE.BufferGeometry();
const positions = [];
const count = 200;

// Параметры форм для разнообразия (4 формы: разные радиусы, частоты волн, типы функций)
const formParams = [
    { radius: 1.4, wave: 5, useSin: true },    // Form 0: Большой круглый sin-волны (initial)
    { radius: 1.0, wave: 8, useSin: false },   // Form 1: Компактный cos-волны (острее)
    { radius: 1.2, wave: 3, useSin: true },    // Form 2: Средний размер, медленная sin-волна
    { radius: 0.8, wave: 6, useSin: false }    // Form 3: Маленький, средняя cos-волна
];

const numForms = formParams.length;
const forms = []; // Массив позиций для каждой формы [formIndex][allCoords]
const startAngles = []; // Углы для coherence (те же для всех форм)

// Функция для генерации позиций формы по индексу
function getPosition(angle, radius, wave, useSin = true) {
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    const z = useSin ? Math.sin(angle * wave) : Math.cos(angle * wave);
    return [x, y, z];
}

// Генерация углов (одинаковые для всех форм, чтобы морфинг был coherent)
for (let i = 0; i < count; i++) {
    const angle1 = Math.random() * Math.PI * 2;
    const angle2 = Math.random() * Math.PI * 2;
    startAngles.push(angle1, angle2); // Храним пару углов для каждой линии
}

// Генерация позиций для всех форм
for (let formIndex = 0; formIndex < numForms; formIndex++) {
    const params = formParams[formIndex];
    const formPositions = [];
    for (let i = 0; i < count; i++) {
        const angle1 = startAngles[i * 2];
        const angle2 = startAngles[i * 2 + 1];
        
        const [x1, y1, z1] = getPosition(angle1, params.radius, params.wave, params.useSin);
        const [x2, y2, z2] = getPosition(angle2, params.radius, params.wave, params.useSin);
        
        formPositions.push(x1, y1, z1, x2, y2, z2);
    }
    forms.push(formPositions);
}

// Инициализация positions первой формой
positions.push(...forms[0]);
geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

const lineMaterial = new THREE.LineBasicMaterial({ color: 0x3bca98 });
const lineSegments = new THREE.LineSegments(geometry, lineMaterial);
scene.add(lineSegments);

camera.position.z = 5;

let currentFormIndex = 0; // Текущая форма (начинаем с 0)
let nextFormIndex = 1;    // Следующая форма
let morphing = false;
let progress = 0;
let lastMorphEndTime = 0; // Время завершения последнего морфинга (для паузы)
const morphDuration = 100; // Длительность морфинга в кадрах (~1-2 сек при 60fps)
const pauseDuration = 2000; // Пауза между морфингом в мс (2 сек)

function animate() {
    requestAnimationFrame(animate);
    lineSegments.rotation.x += 0.01;
    lineSegments.rotation.y += 0.01;
    
    const positionAttribute = lineSegments.geometry.attributes.position.array;
    const totalCoords = positionAttribute.length; // Всего координат (6 * count)
    
    if (morphing) {
        const deltaTime = 1 / morphDuration; // Шаг прогресса (0.01 для ~100 кадров)
        progress += deltaTime;
        
        if (progress >= 1) {
            progress = 1;
            morphing = false;
            // Финализируем: скопировать target в positions
            positions.splice(0, totalCoords, ...forms[nextFormIndex]);
            // Обновить current и next
            currentFormIndex = nextFormIndex;
            nextFormIndex = (currentFormIndex + 1) % numForms; // Цикл: 0->1->2->3->0...
            lastMorphEndTime = performance.now();
        }
        
        const t = Math.sin(progress * Math.PI / 2); // Плавный ease-in-out (медленный старт/финиш)
        
        // Lerp от current к next форме
        for (let i = 0; i < totalCoords; i++) {
            const startCoord = forms[currentFormIndex][i];
            const endCoord = forms[nextFormIndex][i];
            positionAttribute[i] = startCoord * (1 - t) + endCoord * t;
        }
    } else {
        // Пауза завершена? Запустить следующий морфинг
        if (performance.now() - lastMorphEndTime > pauseDuration) {
            morphing = true;
            progress = 0;
        }
    }
    
    lineSegments.geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
}

// Инициальный запуск морфинга через 2 сек (или сразу, если хотите)
setTimeout(() => {
    if (!morphing) {
        morphing = true;
        progress = 0;
        lastMorphEndTime = performance.now() - pauseDuration; // Чтобы первый запустился сразу
    }
}, 2000);

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});