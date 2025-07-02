const form = document.getElementById('alimonyForm');
const result = document.getElementById('result');
const history = document.getElementById('history').querySelector('tbody');
const rates = { 1: 15000, 2: 25000, 3: 35000 }; // Примерные суммы

function loadData() {
  return JSON.parse(localStorage.getItem('alimonyData') || '[]');
}
function saveData(data) {
  localStorage.setItem('alimonyData', JSON.stringify(data));
}
function render() {
  const data = loadData();
  history.innerHTML = '';
  let total = 0;
  data.forEach(row => {
    total += Number(row.amount);
    history.innerHTML += `<tr><td>${row.month}</td><td>${row.amount}</td></tr>`;
  });
  const children = document.getElementById('children').value;
  const expected = rates[children] || 0;
  result.innerHTML = `Ожидаемая сумма: <b>${expected}</b> ₽<br>Внесено: <b>${total}</b> ₽<br>Осталось: <b>${expected - total}</b> ₽`;
}
form.onsubmit = e => {
  e.preventDefault();
  const month = form.month.value;
  const amount = form.amount.value;
  const data = loadData();
  data.push({ month, amount });
  saveData(data);
  render();
  form.reset();
};
render();