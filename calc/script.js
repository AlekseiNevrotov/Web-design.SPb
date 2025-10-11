document.fonts.ready.then(() => {
        document.querySelector('.preloader').style.display = 'none';
    });
    const pages = document.getElementById('pages');
    const pagesValue = document.getElementById('pagesValue');
    const design = document.getElementById('design');
    const adaptive = document.getElementById('adaptive');
    const crm = document.getElementById('crm');
    const dop = document.getElementById('dop');
    const seo = document.getElementById('seo');
    const platform_type = document.getElementById('platform_type');
    const total = document.getElementById('total');
    function calculate() {
      let cost = pages.value * 10000;
      if (design.checked) cost += pages.value * 5000;
      if (adaptive.checked) cost += pages.value * 4000;
      if (crm.checked) cost += 20000;
      if (dop.checked) cost += 15000;
      if (seo.checked) cost += pages.value * 2000;
      const toggleSwitch = document.getElementById('toggleSwitch');
      if (toggleSwitch && toggleSwitch.checked) {
        cost *= 2;
      }
      pagesValue.textContent = pages.value;
      total.textContent = cost.toLocaleString();
      document.getElementById('pages_count').value = pages.value;
      document.getElementById('design_selected').value = design.checked ? 'Да' : 'Нет';
      document.getElementById('adaptive_selected').value = adaptive.checked ? 'Да' : 'Нет';
      document.getElementById('crm_selected').value = crm.checked ? 'Да' : 'Нет';
      document.getElementById('dop_selected').value = dop.checked ? 'Да' : 'Нет';
      document.getElementById('seo_selected').value = seo.checked ? 'Да' : 'Нет';
      document.getElementById('platform_type').value = toggleSwitch.checked ? 'Код' : 'CMS';
      document.getElementById('total_cost').value = cost;
    }
    pages.addEventListener('input', calculate);
    design.addEventListener('change', calculate);
    adaptive.addEventListener('change', calculate);
    crm.addEventListener('change', calculate);
    dop.addEventListener('change', calculate);
    seo.addEventListener('change', calculate);
    calculate();
    function closeModal() {
      document.getElementById('form-status').innerText = '';
      document.getElementById('auditForm').reset();
      calculate();
    }
document.getElementById('auditForm').onsubmit = async function(e) {
  e.preventDefault();
  const status = document.getElementById('form-status');
  status.className = 'sending';
  status.innerText = 'Cогласие на обработку персональных данных.';
  const form = e.target;
  let digits = form.phone.value.replace(/\D/g, '');
  if (digits.startsWith('7') || digits.startsWith('8')) {
    digits = digits.slice(1);
  }
  if (digits.length !== 10) {
    status.className = 'error';
    status.innerText = 'Заполните пожалуйста телефон полностью!';
    form.phone.focus();
    return;
  }
  const data = {
    name: form.name.value,
    phone: digits,
    message: form.message.value,
    pages_count: form.pages_count.value,
    design_selected: form.design_selected.value,
    adaptive_selected: form.adaptive_selected.value,
    crm_selected: form.crm_selected.value,
    dop_selected: form.dop_selected.value,
    seo_selected: form.seo_selected.value,
    total_cost: form.total_cost.value
  };
  try {
    const res = await fetch('/api/sendMail', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    if (res.ok) {
      status.className = 'success';
      status.innerText = 'Спасибо за заявку!';
      setTimeout(closeModal, 1500);
    } else {
      status.className = 'error';
      status.innerText = 'Ошибка при отправке. Попробуйте позже.';
    }
  } catch {
    status.className = 'error';
    status.innerText = 'Ошибка сети. Попробуйте позже.';
  }
};
const phoneInput = document.getElementById('phone');
    const mask = '+7 (___) ___-__-__';
    function applyMask(digits) {
      let output = '+7 (';
      output += digits.substring(0, 3);
      if (digits.length >= 3) {
        output += ') ';
        output += digits.substring(3, 6);
      }
      if (digits.length >= 6) {
        output += '-';
        output += digits.substring(6, 8);
      }
      if (digits.length >= 8) {
        output += '-';
        output += digits.substring(8, 10);
      }
      return output;
    }
    phoneInput.addEventListener('input', function(e) {
  let digits = this.value.replace(/\D/g, '');
  if (digits.startsWith('7') || digits.startsWith('8')) {
    digits = digits.slice(1);
  }
  digits = digits.slice(0, 10);
  let masked = '+7 (';
  if (digits.length > 0) masked += digits.substring(0, 3);
  if (digits.length >= 3) masked += ') ';
  if (digits.length >= 4) masked += digits.substring(3, 6);
  if (digits.length >= 6) masked += '-';
  if (digits.length >= 6) masked += digits.substring(6, 8);
  if (digits.length >= 8) masked += '-';
  if (digits.length >= 8) masked += digits.substring(8, 10);
  this.value = masked;
});
const toggleSwitch = document.getElementById('toggleSwitch');
const toggleStatus = document.getElementById('toggleStatus');
const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
toggleStatus.textContent = "CMS";
toggleSwitch.addEventListener('change', () => {
    const isChecked = toggleSwitch.checked;
    toggleStatus.textContent = isChecked ? "Код" : "CMS";
    calculate();
});
toggleSwitch.addEventListener('change', () => {
    const isChecked = toggleSwitch.checked;
    toggleStatus.textContent = isChecked ? "Код" : "CMS";
    if (isChecked) {
        dop.checked = false;
        dop.disabled = true;
    } else {
        dop.disabled = false;
    }
    calculate();
});