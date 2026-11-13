import { signIn, getSession } from './auth.js';

const form = document.getElementById('login-form');
const message = document.getElementById('message');
const button = document.getElementById('login-button');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  button.disabled = true;
  message.textContent = 'جارٍ التحقق من بيانات الدخول...';

  try {
    await signIn(email, password);
    location.replace('./dashboard.html');
  } catch (error) {
    message.textContent = 'تعذر تسجيل الدخول. تحقق من البيانات وحالة الحساب.';
    button.disabled = false;
  }
});

async function initialize() {
  try {
    const session = await getSession();

    if (session) {
      location.replace('./dashboard.html');
    }
  } catch (error) {
    message.textContent = 'تعذر الاتصال بخدمة الحسابات.';
  }
}

initialize();