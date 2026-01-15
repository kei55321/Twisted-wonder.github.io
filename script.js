let characters = [];
let currentList = [];
let statusOn = true;
let hpAsc = false;
let atkAsc = false;
let groovy = false;

const NO_IMAGE = 'image/noimage.png';

/* ================= DOM ================= */
const m1Attr = document.getElementById('m1Attr');
const m2Attr = document.getElementById('m2Attr');
const m3Attr = document.getElementById('m3Attr');

const m1Type = document.getElementById('m1Type');
const m2Type = document.getElementById('m2Type');
const m3Type = document.getElementById('m3Type');

const m1Name = document.getElementById('m1Name');
const m2Name = document.getElementById('m2Name');
const m3Name = document.getElementById('m3Name');

const body = document.getElementById('character-table-body');
const iconGrid = document.getElementById('icon-grid');
const listSection = document.getElementById('character-list-section');
const iconSection = document.getElementById('icon-only-section');

const toggleBtn = document.getElementById('toggleBtn');
const sortHpBtn = document.getElementById('sortHpBtn');
const sortAtkBtn = document.getElementById('sortAtkBtn');
const resetBtn = document.getElementById('resetBtn');
const searchInput = document.getElementById('searchInput');

const overlay = document.getElementById('overlay');
const closeModal = document.getElementById('closeModal');
const detailName = document.getElementById('detailName');
const detailHp = document.getElementById('detailHp');
const detailAtk = document.getElementById('detailAtk');
const detailImage = document.getElementById('detailImage');
const groovyBtn = document.getElementById('groovyBtn');

const m1Icon = document.getElementById('m1Icon');
const m2Icon = document.getElementById('m2Icon');
const m3Icon = document.getElementById('m3Icon');
const detailM1Desc = document.getElementById('detailM1Desc');
const detailM2Desc = document.getElementById('detailM2Desc');
const detailM3Desc = document.getElementById('detailM3Desc');
const magic1Row = document.getElementById('magic1Row');
const magic2Row = document.getElementById('magic2Row');
const magic3Row = document.getElementById('magic3Row');

const buddy1 = document.getElementById('buddy1');
const buddy2 = document.getElementById('buddy2');
const buddy3 = document.getElementById('buddy3');
const buddy1Bonus = document.getElementById('buddy1Bonus');
const buddy2Bonus = document.getElementById('buddy2Bonus');
const buddy3Bonus = document.getElementById('buddy3Bonus');

/* ================= Utility ================= */
function getAttrIcon(attr) {
  if (attr === '火') return 'image/Element/Fire.png';
  if (attr === '水') return 'image/Element/Water.png';
  if (attr === '木') return 'image/Element/Leaf.png';
  if (attr === '無') return 'image/Element/ZERO.png';
  return '';
}

function getTypeIcon(desc) {
  if (!desc) return '';
  return desc.includes('回復')
    ? 'image/heal.png'
    : 'image/attack.png';
}

/* ================= 画像拡張子完全対応 + NoImage ================= */
function loadImageWithFallback(imgEl, originalPath) {
  if (!originalPath) {
    imgEl.src = NO_IMAGE;
    return;
  }

  const base = originalPath.replace(/\.(png|jpe?g)$/i, '');
  const exts = ['png', 'jpg', 'jpeg', 'JPG'];
  let index = 0;

  imgEl.onerror = () => {
    index++;
    if (index < exts.length) {
      imgEl.src = `${base}.${exts[index]}`;
    } else {
      imgEl.onerror = null;
      imgEl.src = NO_IMAGE;
    }
  };

  imgEl.src = `${base}.${exts[index]}`;
}

function preloadImage(path) {
  if (!path) return;

  const base = path.replace(/\.(png|jpe?g)$/i, '');
  const exts = ['png', 'jpg', 'jpeg', 'JPG'];
  let index = 0;

  const img = new Image();
  img.onerror = () => {
    index++;
    if (index < exts.length) {
      img.src = `${base}.${exts[index]}`;
    }
  };
  img.src = `${base}.${exts[index]}`;
}

/* ================= Path生成 ================= */
function createImagePaths(iconPath) {
  if (!iconPath) return { defaultImage: '', groovyImage: '' };

  const defaultImage = iconPath.replace('/icon/', '/');
  const groovyImage = defaultImage.replace(
    /\.(png|jpe?g)$/i,
    '_G.$1'
  );

  return { defaultImage, groovyImage };
}

/* ================= Data ================= */
fetch('./characters.json')
  .then(res => res.json())
  .then(data => {
    characters = data;
    render(data);
  });

/* ================= Render ================= */
function render(list) {
  currentList = list;
  body.innerHTML = '';
  iconGrid.innerHTML = '';

  list.forEach(c => {
    const images = createImagePaths(c.icon);
    c.defaultImage = images.defaultImage;
    c.groovyImage = images.groovyImage;

    preloadImage(c.icon);
    preloadImage(c.defaultImage);
    preloadImage(c.groovyImage);

    body.innerHTML += `
      <tr onclick='openDetail(${JSON.stringify(c)}, this)'>
        <td>
          <div class="name-cell">
            <img src="${c.icon}" onerror="this.src='${NO_IMAGE}'">
            <span>${c.name}</span>
            <span class="detail-arrow">▶</span>
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
        <img src="${c.icon}" onerror="this.src='${NO_IMAGE}'">
        <div>${c.name}</div>
      </div>
    `;
  });
}

/* ================= Modal ================= */
function openDetail(c, el) {
  document.querySelectorAll('#character-table-body tr')
    .forEach(tr => tr.classList.remove('clicked'));

  if (el) el.classList.add('clicked');

  setTimeout(() => {
    if (el) el.classList.remove('clicked');

    overlay.style.display = 'block';
    detailName.textContent = c.name;
    detailHp.textContent = c.hp ?? '-';
    detailAtk.textContent = c.atk ?? '-';

    loadImageWithFallback(detailImage, c.defaultImage);

    setupMagic(c.mg1, c.mg1_name, c.mg1_description, m1Attr, m1Type, m1Name, detailM1Desc, magic1Row);
    setupMagic(c.mg2, c.mg2_name, c.mg2_description, m2Attr, m2Type, m2Name, detailM2Desc, magic2Row);
    setupMagic(c.mg3, c.mg3_name, c.mg3_description, m3Attr, m3Type, m3Name, detailM3Desc, magic3Row);

    buddy1.textContent = c.buddy1 || '';
    buddy1Bonus.textContent = c.buddy1_bonus || '';
    buddy2.textContent = c.buddy2 || '';
    buddy2Bonus.textContent = c.buddy2_bonus || '';
    buddy3.textContent = c.buddy3 || '';
    buddy3Bonus.textContent = c.buddy3_bonus || '';

    groovy = false;

    if (c.rarity === 'R') {
      groovyBtn.style.display = 'none';
    } else {
      groovyBtn.style.display = 'block';
      groovyBtn.onclick = () => {
        groovy = !groovy;
        loadImageWithFallback(
          detailImage,
          groovy ? c.groovyImage : c.defaultImage
        );
      };
    }
  }, 100);
}

function setupMagic(attr, name, desc, attrEl, typeEl, nameEl, descEl, rowEl) {
  if (!attr) {
    rowEl.style.display = 'none';
    return;
  }

  rowEl.style.display = '';
  attrEl.src = getAttrIcon(attr);
  typeEl.src = getTypeIcon(desc);
  nameEl.textContent = name || '';
  descEl.textContent = desc || '';
}

closeModal.onclick = () => overlay.style.display = 'none';