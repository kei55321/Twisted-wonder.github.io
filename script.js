let characters = [];
let currentList = [];
let statusOn = true;
let hpAsc = false;
let atkAsc = false;
let groovy = false;

/* ===== 要素 ===== */
const body = document.getElementById('character-table-body');
const toggleBtn = document.getElementById('toggleBtn');
const listSection = document.getElementById('character-list-section');
const overlay = document.getElementById('overlay');

const sortHpBtn = document.getElementById('sortHpBtn');
const sortAtkBtn = document.getElementById('sortAtkBtn');
const resetBtn = document.getElementById('resetBtn');
const searchInput = document.getElementById('searchInput');

/* ===== データ ===== */
fetch('./characters.json')
  .then(res => res.json())
  .then(data => {
    characters = data;
    render(characters);
  });

/* ===== 描画 ===== */
function render(list) {
  currentList = list;
  body.innerHTML = '';

  list.forEach(c => {
    body.innerHTML += `
      <tr onclick='openDetail(${JSON.stringify(c)})'>
        <td>
          <div class="name-cell">
            <img src="${c.icon}">
            <span>${c.name}</span>
          </div>
        </td>
        <td>${c.hp ?? '-'}</td>
        <td>${c.atk ?? '-'}</td>
        <td>${c.mg1 ?? '-'}</td>
        <td>${c.mg2 ?? '-'}</td>
        <td>${c.mg3 ?? '-'}</td>
      </tr>
    `;
  });
}

/* ===== ステータス ON / OFF ===== */
toggleBtn.onclick = () => {
  statusOn = !statusOn;
  listSection.style.display = statusOn ? 'block' : 'none';
  toggleBtn.textContent = statusOn
    ? 'ステータス表示：ON'
    : 'ステータス表示：OFF';
};

/* ===== ソート ===== */
function clearActive() {
  [sortHpBtn, sortAtkBtn, resetBtn].forEach(b => b.classList.remove('active'));
}

sortHpBtn.onclick = () => {
  hpAsc = !hpAsc;
  atkAsc = false;

  sortHpBtn.textContent = hpAsc ? 'HP ↑' : 'HP ↓';
  sortAtkBtn.textContent = 'ATK ↓';

  clearActive();
  sortHpBtn.classList.add('active');

  render([...currentList].sort((a, b) =>
    hpAsc ? (a.hp ?? 0) - (b.hp ?? 0) : (b.hp ?? 0) - (a.hp ?? 0)
  ));
};

sortAtkBtn.onclick = () => {
  atkAsc = !atkAsc;
  hpAsc = false;

  sortAtkBtn.textContent = atkAsc ? 'ATK ↑' : 'ATK ↓';
  sortHpBtn.textContent = 'HP ↓';

  clearActive();
  sortAtkBtn.classList.add('active');

  render([...currentList].sort((a, b) =>
    atkAsc ? (a.atk ?? 0) - (b.atk ?? 0) : (b.atk ?? 0) - (a.atk ?? 0)
  ));
};

resetBtn.onclick = () => {
  hpAsc = false;
  atkAsc = false;

  sortHpBtn.textContent = 'HP ↓';
  sortAtkBtn.textContent = 'ATK ↓';

  clearActive();
  resetBtn.classList.add('active');

  render(characters);
};

/* ===== 検索 ===== */
searchInput.oninput = () => {
  const key = searchInput.value;
  render(characters.filter(c => c.name.includes(key)));
};

/* ===== 詳細モーダル ===== */
function openDetail(c) {
  groovy = false;
  overlay.style.display = 'block';
  updateImage(c);

  detailName.textContent = c.name;
  detailHp.textContent = c.hp ?? '-';
  detailAtk.textContent = c.atk ?? '-';
  detailS1.textContent = c.mg1 ?? '-';
  detailS2.textContent = c.mg2 ?? '-';
  detailS3.textContent = c.mg3 ?? '-';

  groovyBtn.onclick = () => {
    groovy = !groovy;
    updateImage(c);
  };
}

function updateImage(c) {
  detailImage.src = groovy ? c.groovyAfter : c.groovyBefore;
  groovyBtn.textContent = groovy ? 'Groovy Before' : 'Groovy After';
}

closeModal.onclick = () => overlay.style.display = 'none';
