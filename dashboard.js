
import { getSession, getMyProfile, signOut } from './auth.js';

const modules = {
  OWNER: ['إدارة الحسابات', 'إدارة الطلاب', 'إدارة المدرسين', 'الصفوف', 'الجداول', 'الواجبات', 'الإعلانات', 'الحضور', 'الدرجات'],
  ADMIN: ['إدارة الطلاب', 'إدارة المدرسين', 'الصفوف', 'الجداول', 'الإعلانات', 'الحضور', 'الدرجات'],
  TEACHER: ['موادي الدراسية', 'الواجبات', 'الجداول', 'الحضور', 'الدرجات'],
  STUDENT: ['جدولي الدراسي', 'موادي', 'واجباتي', 'الإعلانات', 'الحضور', 'درجاتي']
};

async function initialize() {
  const status = document.getElementById('status');

  try {
    const session = await getSession();

    if (!session) {
      location.replace('./index.html');
      return;
    }

    const profile = await getMyProfile();

    if (profile.status !== 'ACTIVE' || !modules[profile.role]) {
      throw new Error('ACCOUNT_NOT_AUTHORIZED');
    }

    document.getElementById('welcome').textContent =
      `مرحباً، ${profile.full_name}`;

    document.getElementById('role').textContent =
      `نوع الحساب: ${profile.role}`;

    const container = document.getElementById('modules');

    modules[profile.role].forEach(name => {
      const card = document.createElement('article');
      card.className = 'card';

      const title = document.createElement('h3');
      title.textContent = name;

      const description = document.createElement('p');
      description.textContent = 'الخدمة المدرسية';

      card.append(title, description);
      container.appendChild(card);
    });

    status.textContent = 'تم التحقق من الحساب.';
  } catch (error) {
    await signOut();
    location.replace('./index.html');
  }
}

document.getElementById('logout').addEventListener('click', async () => {
  await signOut();
  location.replace('./index.html');
});

initialize();
