// =============================================================================
// 1. 変数定義 & 状態管理
// =============================================================================
let characters = [];
let currentList = [];
let statusOn = true;
let hpAsc = false;
let atkAsc = false;
let groovy = false;

// 複数選択用の状態管理配列（空配列の時は「すべて」が選択されている状態）
let selectedRarities = [];
let selectedAttrs = [];
let selectedTypes = [];
let selectedEffects = []; // 新規追加：魔法効果用の管理配列

// DOM要素（マジック関連）
const m1Attr = document.getElementById('m1Attr');
const m2Attr = document.getElementById('m2Attr');
const m3Attr = document.getElementById('m3Attr');
const m1Type = document.getElementById('m1Type');
const m2Type = document.getElementById('m2Type');
const m3Type = document.getElementById('m3Type');
const m1Name = document.getElementById('m1Name');
const m2Name = document.getElementById('m2Name');
const m3Name = document.getElementById('m3Name');
const detailM1Desc = document.getElementById('detailM1Desc');
const detailM2Desc = document.getElementById('detailM2Desc');
const detailM3Desc = document.getElementById('detailM3Desc');
const magic1Row = document.getElementById('magic1Row');
const magic2Row = document.getElementById('magic2Row');
const magic3Row = document.getElementById('magic3Row');

// DOM要素（バディ関連）
const buddy1 = document.getElementById('buddy1');
const buddy2 = document.getElementById('buddy2');
const buddy3 = document.getElementById('buddy3');
const buddy1Bonus = document.getElementById('buddy1Bonus');
const buddy2Bonus = document.getElementById('buddy2Bonus');
const buddy3Bonus = document.getElementById('buddy3Bonus');

// DOM要素（画面表示・操作関連）
const body = document.getElementById('character-table-body');
const iconGrid = document.getElementById('icon-grid');
const listSection = document.getElementById('character-list-section');
const iconSection = document.getElementById('icon-only-section');
const toggleBtn = document.getElementById('toggleBtn');
const sortHpBtn = document.getElementById('sortHpBtn');
const sortAtkBtn = document.getElementById('sortAtkBtn');
const resetBtn = document.getElementById('resetBtn');
const searchInput = document.getElementById('searchInput');

// DOM要素（フィルタモーダル関連）
const openFilterBtn = document.getElementById('openFilterBtn');
const filterOverlay = document.getElementById('filter-overlay');
const closeFilterModal = document.getElementById('closeFilterModal');

// DOM要素（フィルタ：レアリティ）
const filterAllBtn = document.getElementById('filterAllBtn');
const filterSsrBtn = document.getElementById('filterSsrBtn');
const filterSrBtn = document.getElementById('filterSrBtn');
const filterRBtn = document.getElementById('filterRBtn');

// DOM要素（フィルタ：魔法属性）
const attrAllBtn = document.getElementById('attrAllBtn');
const attrFireBtn = document.getElementById('attrFireBtn');
const attrWaterBtn = document.getElementById('attrWaterBtn');
const attrLeafBtn = document.getElementById('attrLeafBtn');
const attrZeroBtn = document.getElementById('attrZeroBtn');

// DOM要素（フィルタ：タイプ）
const typeAllBtn = document.getElementById('typeAllBtn');
const typeBalanceBtn = document.getElementById('typeBalanceBtn');
const typeDefenseBtn = document.getElementById('typeDefenseBtn');
const typeAttackBtn = document.getElementById('typeAttackBtn');

// DOM要素（フィルタ：魔法効果関連）
const effectAllBtn = document.getElementById('effectAllBtn');
const effectButtons = document.querySelectorAll('.effect-btn'); // クラスでまとめて取得

// DOM要素（詳細モーダル関連）
const overlay = document.getElementById('overlay');
const closeModal = document.getElementById('closeModal');
const detailName = document.getElementById('detailName');
const detailHp = document.getElementById('detailHp');
const detailAtk = document.getElementById('detailAtk');
const detailImage = document.getElementById('detailImage');
const groovyBtn = document.getElementById('groovyBtn');

// JSONファイルパス一覧
const jsonFiles = [
  './data/01_Heartslabyul/リドル.json', './data/01_Heartslabyul/エース.json',
  './data/01_Heartslabyul/デュース.json', './data/01_Heartslabyul/ケイト.json',
  './data/01_Heartslabyul/トレイ.json','./data/02_Savanaclaw/レオナ.json',
   './data/02_Savanaclaw/ジャック.json','./data/02_Savanaclaw/ラギー.json', 
  './data/03_Octavinelle/アズール.json', './data/03_Octavinelle/ジェイド.json',
  './data/03_Octavinelle/フロイド.json', './data/04_Scarabia/カリム.json',
  './data/04_Scarabia/ジャミル.json', './data/05_Pomefiore/ヴィル.json',
  './data/05_Pomefiore/ルーク.json', './data/05_Pomefiore/エペル.json',
  './data/06_Ignihyde/イデア.json', './data/06_Ignihyde/オルト.json',
  './data/07_Diasomnia/マレウス.json', './data/07_Diasomnia/セベク.json',
  './data/07_Diasomnia/シルバー.json', './data/07_Diasomnia/リリア.json',
  './data/08_Other/クルーウェル.json', './data/08_Other/クロウリー.json',
  './data/08_Other/グリム.json', './data/08_Other/スカリー.json',
  './data/08_Other/トレイン.json', './data/08_Other/バルガス.json',
  './data/08_Other/フェロー.json', './data/08_Other/ロロ.json'
];

// =============================================================================
// 2. ユーティリティ関数（名前抽出、アイコン取得など）
// =============================================================================
function extractCharacterName(c) {
  if (c.name) return { charName: c.name, fullName: c.name };
  if (!c.icon) return { charName: "[データ不備]", fullName: "[データ不備]" };
  const normalizedPath = c.icon.replace(/\\/g, '/');
  const parts = normalizedPath.split('/');

  if (parts.length > 2 && parts[2].trim() !== "") {
    const charName = parts[2];
    const fileName = parts[parts.length - 1];
    const costumeName = fileName.replace(/\.(png|jpe?g)$/i, ''); 
    
    return {
      charName: charName,
      costumeInfo: `(${c.rarity}/${costumeName})`,
      fullName: `${charName}(${c.rarity}/${costumeName})`
    };
  } else {
    return { charName: `[パス不正]`, fullName: `[パス不正: ${c.icon}]` };
  }
}

function kataToHira(str) {
  return str.replace(/[\u30a1-\u30f6]/g, function(match) {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

function getAttrIcon(attr) {
  if (attr === '火' || attr === 'fire') return 'image/Element/Fire.png';
  if (attr === '水' || attr === 'water') return 'image/Element/Water.png';
  if (attr === '木' || attr === 'leaf' || attr === 'flora') return 'image/Element/Leaf.png';
  if (attr === '無' || attr === 'cosmic' || attr === 'void') return 'image/Element/ZERO.png';
  return '';
}

function getTypeIcon(desc) {
  if (!desc) return '';
  return desc.includes('回復') ? 'image/heal.png' : 'image/attack.png';
}

function createImagePaths(iconPath) {
  if (!iconPath) return { defaultImage: '', groovyImage: '' };
  const defaultImage = iconPath.replace('/icon/', '/');
  const groovyImage = defaultImage.replace(/\.(png|jpe?g)$/i, '_G.$1');
  return { defaultImage, groovyImage };
}

// =============================================================================
// 3. データ読み込み（Fetch）
// =============================================================================
Promise.all(
  jsonFiles.map(path =>
    fetch(path).then(res => {
      if (!res.ok) throw new Error(path + ' のファイルが見つかりません(404)');
      return res.json()})
  )
).then(results => {
  characters = results.flatMap(data => Array.isArray(data) ? data : [data]);
  render(characters);
}).catch(err => {
  console.error('JSON読み込みエラー:', err);
});

// =============================================================================
// 4. メイン描画処理（Render）
// =============================================================================
function render(list) {
  currentList = list;
  body.innerHTML = '';
  iconGrid.innerHTML = '';

  list.forEach(c => {
    if (!c || (!c.icon && !c.name)) return;
    
    const images = createImagePaths(c.icon);
    c.defaultImage = images.defaultImage;
    c.groovyImage = images.groovyImage;

    const nameObj = extractCharacterName(c);
    const nameHtml = nameObj.costumeInfo 
      ? `${nameObj.charName}<br><span class="costume-text">${nameObj.costumeInfo}</span>`
      : nameObj.charName;

    const mg1Html = c.mg1 ? `<img src="${getAttrIcon(c.mg1)}">` : '-';
    const mg2Html = c.mg2 ? `<img src="${getAttrIcon(c.mg2)}">` : '-';
    const mg3Html = c.mg3 ? `<img src="${getAttrIcon(c.mg3)}">` : '-';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="name-cell">
          <img src="${c.icon}">
          <span>${nameHtml}</span>
          <span class="detail-arrow">▶</span>
        </div>
      </td>
      <td>${c.maxHP ?? '-'}</td>
      <td>${c.maxATK ?? '-'}</td>
      <td>${mg1Html}</td>
      <td>${mg2Html}</td>
      <td>${mg3Html}</td>
    `;
    tr.addEventListener('click', () => openDetail(c, tr));
    body.appendChild(tr);

    const div = document.createElement('div');
    div.className = 'icon-item';
    div.innerHTML = `<img src="${c.icon}"><div>${nameHtml}</div>`;
    div.addEventListener('click', () => openDetail(c));
    iconGrid.appendChild(div);
  });
}

// =============================================================================
// 5. データのフィルタリング・適用共通関数
// =============================================================================
function applyFiltersAndSort() {
  // 元の並び順（初期配列）が崩れないように浅いコピーを作成
  let filtered = [...characters];

  // 1. レアリティで絞り込み
  if (selectedRarities.length > 0) {
    filtered = filtered.filter(c => selectedRarities.includes(c.rarity));
  }

  // 2. 魔法属性で絞り込み
  if (selectedAttrs.length > 0) {
    filtered = filtered.filter(c => {
      return selectedAttrs.includes(c.mg1) || selectedAttrs.includes(c.mg2) || selectedAttrs.includes(c.mg3);
    });
  }

  // 3. タイプで絞り込み
  if (selectedTypes.length > 0) {
    filtered = filtered.filter(c => selectedTypes.includes(c.genre));
  }

  // 4. 魔法効果で絞り込み
  if (selectedEffects.length > 0) {
    filtered = filtered.filter(c => {
      const m1Desc = c.mg1_description || c.mg1description || '';
      const m2Desc = c.mg2_description || c.mg2description || '';
      const m3Desc = c.mg3_description || c.mg3description || '';
      
      return selectedEffects.every(eff => {
        return m1Desc.includes(eff) || m2Desc.includes(eff) || m3Desc.includes(eff);
      });
    });
  }

  // 5. あいまい＆複数ワード（AND）検索で絞り込み
  const keyword = searchInput.value.trim();
  if (keyword) {
    const words = keyword.split(/[\s\u3000]+/);
    filtered = filtered.filter(c => {
      const targetNameHira = kataToHira(extractCharacterName(c).fullName.toLowerCase());
      return words.every(word => {
        const searchWordHira = kataToHira(word.toLowerCase());
        return targetNameHira.includes(searchWordHira);
      });
    });
  }

  // 6. 現在のソート状態を適用
  if (sortHpBtn.classList.contains('active')) {
    filtered.sort((a, b) => hpAsc ? (a.maxHP ?? 0) - (b.maxHP ?? 0) : (b.maxHP ?? 0) - (a.maxHP ?? 0));
  } else if (sortAtkBtn.classList.contains('active')) {
    filtered.sort((a, b) => atkAsc ? (a.maxATK ?? 0) - (b.maxATK ?? 0) : (b.maxATK ?? 0) - (a.maxATK ?? 0));
  }

  render(filtered);
}

// =============================================================================
// 6. イベントリスナー（ボタン操作・検索）
// =============================================================================

// --- フィルタモーダル開閉 ---
openFilterBtn.onclick = () => filterOverlay.style.display = 'block';
closeFilterModal.onclick = () => filterOverlay.style.display = 'none';

// --- ① レアリティフィルタのトグル処理 ---
filterAllBtn.onclick = () => {
  selectedRarities = [];
  filterAllBtn.classList.add('active');
  [filterSsrBtn, filterSrBtn, filterRBtn].forEach(btn => btn.classList.remove('active'));
  applyFiltersAndSort();
};

function handleRarityFilter(rarity, clickedBtn) {
  filterAllBtn.classList.remove('active');
  if (selectedRarities.includes(rarity)) {
    selectedRarities = selectedRarities.filter(r => r !== rarity);
    clickedBtn.classList.remove('active');
  } else {
    selectedRarities.push(rarity);
    clickedBtn.classList.add('active');
  }
  if (selectedRarities.length === 0) filterAllBtn.classList.add('active');
  applyFiltersAndSort();
}
filterSsrBtn.onclick = () => handleRarityFilter('SSR', filterSsrBtn);
filterSrBtn.onclick = () => handleRarityFilter('SR', filterSrBtn);
filterRBtn.onclick = () => handleRarityFilter('R', filterRBtn);


// --- ② 魔法属性フィルタのトグル処理 ---
attrAllBtn.onclick = () => {
  selectedAttrs = [];
  attrAllBtn.classList.add('active');
  [attrFireBtn, attrWaterBtn, attrLeafBtn, attrZeroBtn].forEach(btn => btn.classList.remove('active'));
  applyFiltersAndSort();
};

function handleAttrFilter(attrName, clickedBtn) {
  attrAllBtn.classList.remove('active');
  if (selectedAttrs.includes(attrName)) {
    selectedAttrs = selectedAttrs.filter(a => a !== attrName);
    clickedBtn.classList.remove('active');
  } else {
    selectedAttrs.push(attrName);
    clickedBtn.classList.add('active');
  }
  if (selectedAttrs.length === 0) attrAllBtn.classList.add('active');
  applyFiltersAndSort();
}
attrFireBtn.onclick = () => handleAttrFilter('火', attrFireBtn);
attrWaterBtn.onclick = () => handleAttrFilter('水', attrWaterBtn);
attrLeafBtn.onclick = () => handleAttrFilter('木', attrLeafBtn);
attrZeroBtn.onclick = () => handleAttrFilter('無', attrZeroBtn);


// --- ③ タイプフィルタのトグル処理 ---
typeAllBtn.onclick = () => {
  selectedTypes = [];
  typeAllBtn.classList.add('active');
  [typeBalanceBtn, typeDefenseBtn, typeAttackBtn].forEach(btn => btn.classList.remove('active'));
  applyFiltersAndSort();
};

function handleTypeFilter(typeName, clickedBtn) {
  typeAllBtn.classList.remove('active');
  if (selectedTypes.includes(typeName)) {
    selectedTypes = selectedTypes.filter(t => t !== typeName);
    clickedBtn.classList.remove('active');
  } else {
    selectedTypes.push(typeName);
    clickedBtn.classList.add('active');
  }
  if (selectedTypes.length === 0) typeAllBtn.classList.add('active');
  applyFiltersAndSort();
}
typeBalanceBtn.onclick = () => handleTypeFilter('バランス', typeBalanceBtn);
typeDefenseBtn.onclick = () => handleTypeFilter('ディフェンス', typeDefenseBtn);
typeAttackBtn.onclick = () => handleTypeFilter('アタック', typeAttackBtn);


// --- ④ 魔法効果フィルタのトグル処理（一括設定） ---
effectAllBtn.onclick = () => {
  selectedEffects = [];
  effectAllBtn.classList.add('active');
  effectButtons.forEach(btn => btn.classList.remove('active'));
  applyFiltersAndSort();
};

effectButtons.forEach(btn => {
  btn.onclick = () => {
    effectAllBtn.classList.remove('active');
    const effectValue = btn.getAttribute('data-effect');

    if (selectedEffects.includes(effectValue)) {
      selectedEffects = selectedEffects.filter(e => e !== effectValue);
      btn.classList.remove('active');
    } else {
      selectedEffects.push(effectValue);
      btn.classList.add('active');
    }

    if (selectedEffects.length === 0) effectAllBtn.classList.add('active');
    applyFiltersAndSort();
  };
});


// --- ソート・表示・リセット・検索制御 ---
toggleBtn.onclick = () => {
  statusOn = !statusOn;
  listSection.style.display = statusOn ? 'block' : 'none';
  iconSection.style.display = statusOn ? 'none' : 'block';
  toggleBtn.textContent = statusOn ? 'ステータス表示：ON' : 'ステータス表示：OFF';
};

sortHpBtn.onclick = () => {
  hpAsc = !hpAsc; atkAsc = false;
  sortHpBtn.textContent = hpAsc ? 'HP ↑' : 'HP ↓';
  sortAtkBtn.textContent = 'ATK ↓';
  sortHpBtn.classList.add('active');
  sortAtkBtn.classList.remove('active');
  resetBtn.classList.remove('active');
  applyFiltersAndSort();
};

sortAtkBtn.onclick = () => {
  atkAsc = !atkAsc; hpAsc = false;
  sortAtkBtn.textContent = atkAsc ? 'ATK ↑' : 'ATK ↓';
  sortHpBtn.textContent = 'HP ↓';
  sortAtkBtn.classList.add('active');
  sortHpBtn.classList.remove('active');
  resetBtn.classList.remove('active');
  applyFiltersAndSort();
};

resetBtn.onclick = () => {
  // ソート状態管理変数を完全に初期化
  hpAsc = false; 
  atkAsc = false;
  selectedRarities = []; 
  selectedAttrs = []; 
  selectedTypes = []; 
  selectedEffects = [];
  searchInput.value = '';
  
  // ソートボタンのテキストとアクティブクラスの初期化
  sortHpBtn.textContent = 'HP ↓'; 
  sortAtkBtn.textContent = 'ATK ↓';
  sortHpBtn.classList.remove('active'); 
  sortAtkBtn.classList.remove('active');
  
  // すべてのフィルタボタンの選択状態を初期リセット
  filterAllBtn.classList.add('active');
  [filterSsrBtn, filterSrBtn, filterRBtn].forEach(btn => btn.classList.remove('active'));
  attrAllBtn.classList.add('active');
  [attrFireBtn, attrWaterBtn, attrLeafBtn, attrZeroBtn].forEach(btn => btn.classList.remove('active'));
  typeAllBtn.classList.add('active');
  [typeBalanceBtn, typeDefenseBtn, typeAttackBtn].forEach(btn => btn.classList.remove('active'));
  effectAllBtn.classList.add('active');
  effectButtons.forEach(btn => btn.classList.remove('active'));

  resetBtn.classList.add('active');
  
  // 💡初期の読み込み順（characters配列そのもの）で再度描画する
  render([...characters]);
};

searchInput.oninput = () => applyFiltersAndSort();

// =============================================================================
// 7. モーダル制御（詳細表示） & バディ画像生成 & 枠外クリック処理
// =============================================================================

function getBuddyImgPath(baseIconPath, buddyName) {
  if (!baseIconPath || !buddyName) return '';
  const normalizedPath = baseIconPath.replace(/\\/g, '/');
  const lastSlashIndex = normalizedPath.lastIndexOf('/');
  if (lastSlashIndex === -1) return '';

  const dirPath = 'image/Buddy';
  const fileName = normalizedPath.substring(lastSlashIndex + 1);
  const extIndex = fileName.lastIndexOf('.');
  const ext = extIndex !== -1 ? fileName.substring(extIndex) : '.png';

  return `${dirPath}/${buddyName}${ext}`;
}

function openDetail(c, el) {
  document.querySelectorAll('#character-table-body tr').forEach(tr => tr.classList.remove('clicked'));
  if (el) el.classList.add('clicked');

  setTimeout(() => {
    if (el) el.classList.remove('clicked');

    detailImage.src = c.defaultImage;
    overlay.style.display = 'block';

    const nameObj = extractCharacterName(c);
    const nameHtml = nameObj.costumeInfo 
      ? `${nameObj.charName}<br><span class="costume-text">${nameObj.costumeInfo}</span>`
      : nameObj.charName;

    detailName.innerHTML = nameHtml;
    detailHp.textContent  = c.maxHP ?? '-';
    detailAtk.textContent = c.maxATK ?? '-';

    // 詳細モーダル用に、データのキー名をアンダースコア有り・無し両方から安全に取得します
    const m1NameText = c.mg1_name || c.mg1name || '';
    const m2NameText = c.mg2_name || c.mg2name || '';
    const m3NameText = c.mg3_name || c.mg3name || '';
    
    const m1DescText = c.mg1_description || c.mg1description || '';
    const m2DescText = c.mg2_description || c.mg2description || '';
    const m3DescText = c.mg3_description || c.mg3description || '';

    // 詳細モーダル側には技名テキストをしっかり渡して表示させます
    setupMagic(c.mg1, m1NameText, m1DescText, m1Attr, m1Type, m1Name, detailM1Desc, magic1Row);
    setupMagic(c.mg2, m2NameText, m2DescText, m2Attr, m2Type, m2Name, detailM2Desc, magic2Row);
    setupMagic(c.mg3, m3NameText, m3DescText, m3Attr, m3Type, m3Name, detailM3Desc, magic3Row);

    // --- バディ情報の処理 ---
    const buddy1Img = document.getElementById('buddy1Img');
    const buddy2Img = document.getElementById('buddy2Img');
    const buddy3Img = document.getElementById('buddy3Img');

    if (c.buddy1) {
      buddy1Img.src = getBuddyImgPath(c.icon, c.buddy1);
      buddy1Img.style.display = 'block';
      buddy1.textContent = c.buddy1;
      buddy1Bonus.textContent = c.buddy_bonus1 || c.buddy_bonus_1 || '';
    } else {
      buddy1Img.style.display = 'none';
      buddy1.textContent = '';
      buddy1Bonus.textContent = '';
    }

    if (c.buddy2) {
      buddy2Img.src = getBuddyImgPath(c.icon, c.buddy2);
      buddy2Img.style.display = 'block';
      buddy2.textContent = c.buddy2;
      buddy2Bonus.textContent = c.buddy_bonus2 || c.buddy_bonus_2 || '';
    } else {
      buddy2Img.style.display = 'none';
      buddy2.textContent = '';
      buddy2Bonus.textContent = '';
    }

    if (c.buddy3) {
      buddy3Img.src = getBuddyImgPath(c.icon, c.buddy3);
      buddy3Img.style.display = 'block';
      buddy3.textContent = c.buddy3;
      buddy3Bonus.textContent = c.buddy_bonus3 || c.buddy_bonus_3 || '';
    } else {
      buddy3Img.style.display = 'none';
      buddy3.textContent = '';
      buddy3Bonus.textContent = '';
    }

    groovy = false;
    if (c.rarity === 'R') {
      groovyBtn.style.display = 'none';
    } else {
      groovyBtn.style.display = 'block';
      groovyBtn.onclick = () => {
        groovy = !groovy;
        detailImage.src = groovy ? c.groovyImage : c.defaultImage;
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

// --- 💡 追加：モーダルの枠外（背景）クリックで閉じる処理 ---
overlay.addEventListener('click', (event) => {
  if (event.target === overlay) {
    overlay.style.display = 'none';
  }
});

filterOverlay.addEventListener('click', (event) => {
  if (event.target === filterOverlay) {
    filterOverlay.style.display = 'none';
  }
});