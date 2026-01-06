const body = document.getElementById('character-table-body');
const overlay = document.getElementById('overlay');
const closeModal = document.getElementById('closeModal');

const magic1Row = document.getElementById('magic1Row');
const magic2Row = document.getElementById('magic2Row');
const magic3Row = document.getElementById('magic3Row');

const m1Attr = document.getElementById('m1Attr');
const m1Type = document.getElementById('m1Type');
const m1Name = document.getElementById('m1Name');
const m1Desc = document.getElementById('m1Desc');

const m2Attr = document.getElementById('m2Attr');
const m2Type = document.getElementById('m2Type');
const m2Name = document.getElementById('m2Name');
const m2Desc = document.getElementById('m2Desc');

const m3Attr = document.getElementById('m3Attr');
const m3Type = document.getElementById('m3Type');
const m3Name = document.getElementById('m3Name');
const m3Desc = document.getElementById('m3Desc');

let characters = [];

function getAttrIcon(attr) {
  return {
    火: 'image/Element/Fire.png',
    水: 'image/Element/Water.png',
    木: 'image/Element/Leaf.png',
    無: 'image/Element/ZERO.png'
  }[attr] || '';
}

function getTypeIcon(desc) {
  return desc && desc.includes('回復')
    ? 'image/Icon/heal.png'
    : 'image/Icon/attack.png';
}

fetch('./characters.json')
  .then(r => r.json())
  .then(data => {
    characters = data;
    render();
  });

function render() {
  body.innerHTML = '';
  characters.forEach((c, i) => {
    body.innerHTML += `
      <tr onclick="openDetail(${i})">
        <td>
          <div class="name-cell">
            <img src="${c.icon}">
            <span>${c.name}</span>
          </div>
        </td>
        <td>${c.hp ?? '-'}</td>
        <td>${c.atk ?? '-'}</td>
        <td>${c.mg1 ? `<img src="${getAttrIcon(c.mg1)}">` : ''}</td>
        <td>${c.mg2 ? `<img src="${getAttrIcon(c.mg2)}">` : ''}</td>
        <td>${c.mg3 ? `<img src="${getAttrIcon(c.mg3)}">` : ''}</td>
      </tr>
    `;
  });
}

function setupMagic(row, attr, name, desc, attrEl, typeEl, nameEl, descEl) {
  if (!attr) {
    row.style.display = 'none';
    return;
  }
  row.style.display = '';
  attrEl.src = getAttrIcon(attr);
  typeEl.src = getTypeIcon(desc);
  nameEl.textContent = name || '';
  descEl.textContent = desc || '';
}

function openDetail(i) {
  const c = characters[i];
  overlay.style.display = 'block';

  setupMagic(magic1Row, c.mg1, c.mg1_name, c.mg1_description, m1Attr, m1Type, m1Name, m1Desc);
  setupMagic(magic2Row, c.mg2, c.mg2_name, c.mg2_description, m2Attr, m2Type, m2Name, m2Desc);
  setupMagic(magic3Row, c.mg3, c.mg3_name, c.mg3_description, m3Attr, m3Type, m3Name, m3Desc);
}

closeModal.onclick = () => overlay.style.display = 'none';