let characters = [];
let currentList = [];
let statusOn = true;
let hpAsc = false;
let atkAsc = false;
let groovy = false;

const body = document.getElementById('character-table-body');
const iconGrid = document.getElementById('icon-grid');
const listSection = document.getElementById('character-list-section');
const iconSection = document.getElementById('icon-only-section');

const toggleBtn = document.getElementById('toggleBtn');
const sortHpBtn = document.getElementById('sortHpBtn');
const sortAtkBtn = document.getElementById('sortAtkBtn');
const resetBtn = document.getElementById('resetBtn');
const searchInput = document.getElementById('searchInput');

function getAttrIcon(attr) {
  if (!attr) return '';
  if (attr === '火') return 'image/attr/fire.png';
  if (attr === '水') return 'image/attr/water.png';
  if (attr === '木') return 'image/attr/wood.png';
  if (attr === '無') return 'image/attr/none.png';
  return '';
}

fetch('./characters.json')
  .then(res => res.json())
  .then(data => {
    characters = data;
    render(characters);
  });

function render(list) {
  currentList = list;
  body.innerHTML = '';
  iconGrid.innerHTML = '';

  list.forEach(c => {
    body.innerHTML += `
      <tr onclick='openDetail(${JSON.stringify(c)})'>
        <td>
          <div class="name-cell">
            <img src="${c.icon}">
            ${c.name}
          </div>
        </td>
        <td>${c.hp ?? '-'}</td>
        <td>${c.atk ?? '-'}</td>
        <td>${c.mg1 ? `<img src="${getAttrIcon(c.mg1)}">` : ''}</td>
        <td>${c.mg2 ? `<img src="${getAttrIcon(c.mg2)}">` : ''}</td>
        <td>${c.mg3 ? `<img src="${getAttrIcon(c.mg3)}">` : ''}</td>
      </tr>
    `;

    iconGrid.innerHTML += `
      <div class="icon-item" onclick='openDetail(${JSON.stringify(c)})'>
        <img src="${c.icon}">
        <div>${c.name}</div>
      </div>
    `;
  });
}

/* ===== ステータスON/OFF ===== */
toggleBtn.onclick = () => {
  statusOn = !statusOn;
  listSection.style.display = statusOn ? 'block' : 'none';
  iconSection.style.display = statusOn ? 'none' : 'block';
  toggleBtn.textContent = statusOn ? 'ステータス表示：ON' : 'ステータス表示：OFF';
};

/* ===== ソート ===== */
sortHpBtn.onclick = () => {
  hpAsc = !hpAsc;
  atkAsc = false;

  sortHpBtn.textContent = hpAsc ? 'HP ↑' : 'HP ↓';
  sortAtkBtn.textContent = 'ATK ↓';

  sortHpBtn.classList.add('active');
  sortAtkBtn.classList.remove('active');
  resetBtn.classList.remove('active');

  render([...currentList].sort((a,b)=>
    hpAsc ? (a.hp??0)-(b.hp??0) : (b.hp??0)-(a.hp??0)
  ));
};

sortAtkBtn.onclick = () => {
  atkAsc = !atkAsc;
  hpAsc = false;

  sortAtkBtn.textContent = atkAsc ? 'ATK ↑' : 'ATK ↓';
  sortHpBtn.textContent = 'HP ↓';

  sortAtkBtn.classList.add('active');
  sortHpBtn.classList.remove('active');
  resetBtn.classList.remove('active');

  render([...currentList].sort((a,b)=>
    atkAsc ? (a.atk??0)-(b.atk??0) : (b.atk??0)-(a.atk??0)
  ));
};

resetBtn.onclick = () => {
  hpAsc = false;
  atkAsc = false;

  sortHpBtn.textContent = 'HP ↓';
  sortAtkBtn.textContent = 'ATK ↓';

  sortHpBtn.classList.remove('active');
  sortAtkBtn.classList.remove('active');
  resetBtn.classList.add('active');

  render(characters);
};

/* ===== 検索 ===== */
searchInput.oninput = () => {
  render(characters.filter(c => c.name.includes(searchInput.value)));
};

/* ===== モーダル ===== */
function openDetail(c) {
  overlay.style.display = 'block';

  detailName.textContent = c.name;
  detailHp.textContent = c.hp ?? '-';
  detailAtk.textContent = c.atk ?? '-';

  setupMagic(c.mg1, c.mg1_description, m1Icon, detailM1Desc, magic1Row);
  setupMagic(c.mg2, c.mg2_description, m2Icon, detailM2Desc, magic2Row);
  setupMagic(c.mg3, c.mg3_description, m3Icon, detailM3Desc, magic3Row);

  buddy1.textContent = c.buddy1 || '';
  buddy1Bonus.textContent = c.buddy1_bonus || '';
  buddy2.textContent = c.buddy2 || '';
  buddy2Bonus.textContent = c.buddy2_bonus || '';
  buddy3.textContent = c.buddy3 || '';
  buddy3Bonus.textContent = c.buddy3_bonus || '';

  groovy = false;
  detailImage.src = c.groovyBefore;

  if (c.rarity === 'R') {
    groovyBtn.style.display = 'none';
  } else {
    groovyBtn.style.display = 'block';
    groovyBtn.onclick = () => {
      groovy = !groovy;
      detailImage.src = groovy ? c.groovyAfter : c.groovyBefore;
    };
  }
}

function setupMagic(attr, desc, iconEl, descEl, rowEl) {
  if (!attr) {
    rowEl.style.display = 'none';
    return;
  }
  rowEl.style.display = '';
  iconEl.src = getAttrIcon(attr);
  descEl.textContent = desc || '';
}

closeModal.onclick = () => overlay.style.display = 'none';