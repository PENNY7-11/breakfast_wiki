/**
 * 早餐店品項 Breakfast Wiki - 核心互動邏輯 (main.js)
 * 包含：資料非同步讀取、分類篩選、搜尋、卡片渲染、詳細資訊彈窗互動
 */

// 備援預設資料：若使用者直接透過本機 file:// 協議雙擊開啟 index.html 導致 fetch 被瀏覽器安全策略阻擋時，自動啟動備援資料，確保網站 100% 隨開即用！
const BACKUP_BREAKFAST_DATA = [
  {
    "id": "item-01",
    "name": "原味蛋餅",
    "category": "蛋餅類",
    "healthLevel": "good",
    "healthLabel": "均衡搭配推薦",
    "calories": 260,
    "carbs": 31.0,
    "protein": 11.0,
    "fat": 10.5,
    "description": "經典傳統蛋餅，餅皮薄煎配上新鮮雞蛋，提供基礎優質蛋白質與適量碳水。",
    "image": "assets/images/plain-egg-crepe.svg",
    "source": "衛生福利部食品營養成分資料庫及連鎖早餐店製程估算",
    "tips": "油脂主要來自煎台油量，建議請店家少油少醬，並搭配無糖豆漿，營養更均衡。"
  },
  {
    "id": "item-02",
    "name": "玉米蛋餅",
    "category": "蛋餅類",
    "healthLevel": "good",
    "healthLabel": "均衡搭配推薦",
    "calories": 300,
    "carbs": 39.0,
    "protein": 12.0,
    "fat": 11.0,
    "description": "加入清甜玉米粒的蛋餅，增添膳食纖維與自然甘甜，是老少咸宜的人氣首選。",
    "image": "assets/images/corn-egg-crepe.svg",
    "source": "衛生福利部食品營養成分資料庫估算",
    "tips": "玉米為全穀雜糧類，碳水化合物含量略高於原味蛋餅，建議飲品選擇無糖茶或無糖豆漿。"
  },
  {
    "id": "item-03",
    "name": "起司蛋餅",
    "category": "蛋餅類",
    "healthLevel": "mid",
    "healthLabel": "份量留意",
    "calories": 345,
    "carbs": 31.5,
    "protein": 15.0,
    "fat": 17.5,
    "description": "濃郁融化起司片包入蛋餅中，提供豐富鈣質與蛋白質，但起司片本身帶有些許鈉含量。",
    "image": "assets/images/cheese-egg-crepe.svg",
    "source": "市售起司片與傳統蛋餅熱量平均估算",
    "tips": "起司已具備鹹香奶味，建議不額外添加醬油膏或甜辣醬，以控制鈉攝取。"
  },
  {
    "id": "item-04",
    "name": "蔬菜蛋餅",
    "category": "蛋餅類",
    "healthLevel": "good",
    "healthLabel": "均衡搭配推薦",
    "calories": 270,
    "carbs": 32.0,
    "protein": 11.5,
    "fat": 11.0,
    "description": "包入高麗菜絲、小白菜或萵苣，清爽多汁，能有效補充早餐常見缺乏的蔬菜纖維。",
    "image": "assets/images/veggie-egg-crepe.svg",
    "source": "連鎖早餐店蔬菜蛋餅平均配方估算",
    "tips": "外食族補充纖維的好選擇，搭配不加糖飲品即可構成理想的活力低負擔早餐。"
  },
  {
    "id": "item-05",
    "name": "培根蛋餅",
    "category": "蛋餅類",
    "healthLevel": "alert",
    "healthLabel": "油脂或鈉含量留意",
    "calories": 375,
    "carbs": 31.0,
    "protein": 13.0,
    "fat": 22.0,
    "description": "培根肉香濃郁，但培根為加工肉品，煎製後油脂融出，脂肪比例與鈉含量較顯著。",
    "image": "assets/images/bacon-egg-crepe.svg",
    "source": "加工肉品與早餐煎台烹調熱量估算",
    "tips": "偶爾解饞即可，食用時建議瀝乾油脂、不沾醬，並於當天其他餐次多攝取深綠色蔬菜。"
  },
  {
    "id": "item-06",
    "name": "火腿蛋吐司",
    "category": "吐司／三明治",
    "healthLevel": "mid",
    "healthLabel": "份量留意",
    "calories": 380,
    "carbs": 44.0,
    "protein": 15.0,
    "fat": 16.0,
    "description": "兩片吐司夾入荷包蛋與火腿片，若塗抹美乃滋或乳酪抹醬，熱量會稍有提升。",
    "image": "assets/images/ham-egg-toast.svg",
    "source": "台灣常見美而美型早餐店規格估算",
    "tips": "點餐時可請店家「不抹美乃滋」或「少醬」，能直接省下約 50～80 kcal 的精緻脂肪。"
  },
  {
    "id": "item-07",
    "name": "鮪魚蛋吐司",
    "category": "吐司／三明治",
    "healthLevel": "good",
    "healthLabel": "均衡搭配推薦",
    "calories": 390,
    "carbs": 43.0,
    "protein": 21.0,
    "fat": 15.5,
    "description": "富含深海魚優質蛋白質與 Omega-3 脂肪酸，搭配荷包蛋是優質蛋白質的高分配方。",
    "image": "assets/images/tuna-egg-toast.svg",
    "source": "水煮/油漬鮪魚拌美乃滋與雙片吐司估算",
    "tips": "部分早餐店鮪魚醬調入較多美乃滋，若店家提供水煮或黑胡椒清拌鮪魚，熱量會更理想。"
  },
  {
    "id": "item-08",
    "name": "豬排蛋三明治",
    "category": "吐司／三明治",
    "healthLevel": "good",
    "healthLabel": "均衡搭配推薦",
    "calories": 420,
    "carbs": 46.0,
    "protein": 24.0,
    "fat": 15.0,
    "description": "醃製里肌肉排搭配荷包蛋、生菜與吐司，蛋白質非常充足，原肉里肌肉脂肪含量相對較低。",
    "image": "assets/images/pork-chop-sandwich.svg",
    "source": "未裹粉原塊里肌肉煎製三明治估算",
    "tips": "選擇非油炸的原肉排是維持健美體態的極佳早餐，飽足感可持續至中午。"
  },
  {
    "id": "item-09",
    "name": "卡啦雞腿堡",
    "category": "漢堡／炸物",
    "healthLevel": "alert",
    "healthLabel": "油脂或鈉含量留意",
    "calories": 590,
    "carbs": 52.0,
    "protein": 22.0,
    "fat": 33.0,
    "description": "厚實炸雞腿排外皮酥脆香辣，夾入漢堡包與美乃滋，熱量與油脂含量皆為早餐店前段班。",
    "image": "assets/images/spicy-chicken-burger.svg",
    "source": "連鎖漢堡門市酥炸雞腿漢堡數值平均估算",
    "tips": "油炸裹粉吸油率較高，建議可去皮食用或請店家少加美乃滋，飲品配黑咖啡或無糖茶解膩。"
  },
  {
    "id": "item-10",
    "name": "照燒豬肉堡",
    "category": "漢堡／炸物",
    "healthLevel": "mid",
    "healthLabel": "份量留意",
    "calories": 450,
    "carbs": 48.0,
    "protein": 19.0,
    "fat": 20.0,
    "description": "台式漢堡經典漢堡肉排淋上微甜照燒醬，夾洋蔥與小黃瓜絲，風味鹹甜開胃。",
    "image": "assets/images/teriyaki-pork-burger.svg",
    "source": "常見混合肉排漢堡與醬汁平均值估算",
    "tips": "絞肉漢堡排通常混有部分肥肉以維持多汁口感，醬汁含糖分，留意當日其他餐次精緻糖攝取。"
  },
  {
    "id": "item-11",
    "name": "香酥薯餅",
    "category": "漢堡／炸物",
    "healthLevel": "alert",
    "healthLabel": "油脂或鈉含量留意",
    "calories": 165,
    "carbs": 18.0,
    "protein": 1.5,
    "fat": 10.0,
    "description": "碎馬鈴薯壓製後高溫油炸，外酥內軟，體積雖小但油脂熱量佔比達 55% 以上。",
    "image": "assets/images/hash-brown.svg",
    "source": "市售冷凍油炸薯餅單片 (約 60g) 估算",
    "tips": "屬於單純碳水與油脂組合，缺乏蛋白質，適合作為偶爾分享的小點心，不宜作為正餐單一來源。"
  },
  {
    "id": "item-12",
    "name": "黑胡椒鐵板麵",
    "category": "鐵板麵／中式",
    "healthLevel": "alert",
    "healthLabel": "油脂或鈉含量留意",
    "calories": 530,
    "carbs": 76.0,
    "protein": 14.0,
    "fat": 19.0,
    "description": "滑順油麵拌炒濃稠黑胡椒燴醬，香辣過癮，但醬汁通常勾芡且鈉含量超過 1200mg。",
    "image": "assets/images/pepper-noodles.svg",
    "source": "鐵板麵調理包加荷包蛋標準份量估算",
    "tips": "碳水與鈉含量偏高，建議加點一顆荷包蛋補充蛋白質，並多喝水促進代謝，醬汁勿飲用完畢。"
  },
  {
    "id": "item-13",
    "name": "港式蘿蔔糕",
    "category": "鐵板麵／中式",
    "healthLevel": "mid",
    "healthLabel": "份量留意",
    "calories": 310,
    "carbs": 42.0,
    "protein": 6.5,
    "fat": 13.0,
    "description": "兩片煎至雙面金黃酥脆的蘿蔔糕，主要原料為在來米粉與白蘿蔔，常混入蝦米或絞肉粒。",
    "image": "assets/images/turnip-cake.svg",
    "source": "傳統蘿蔔糕 2 片 (約 120g) 煎製吸油率估算",
    "tips": "吸油率較高且蛋白質較不足，建議加一顆煎蛋，並以純白胡椒或少量薄鹽醬油代替重鹹沾醬。"
  },
  {
    "id": "item-14",
    "name": "台式傳統飯糰",
    "category": "鐵板麵／中式",
    "healthLevel": "alert",
    "healthLabel": "油脂或鈉含量留意",
    "calories": 580,
    "carbs": 82.0,
    "protein": 15.0,
    "fat": 21.0,
    "description": "緊實糯米包覆老油條、肉鬆、菜脯與酸菜，紮實飽足，但也集結了高升糖碳水與加工油脂。",
    "image": "assets/images/rice-roll.svg",
    "source": "中式傳統早餐店包油條飯糰標準份估算",
    "tips": "糯米消化較慢，胃腸易脹氣者宜細嚼慢嚥；可請店家「油條折半」或改包滷蛋以降低油脂負擔。"
  },
  {
    "id": "item-15",
    "name": "無糖高纖豆漿",
    "category": "飲品與湯品",
    "healthLevel": "good",
    "healthLabel": "均衡搭配推薦",
    "calories": 140,
    "carbs": 10.0,
    "protein": 14.5,
    "fat": 5.0,
    "description": "天然黃豆熬煮，不額外加糖，提供豐富大豆異黃酮、植物性優質蛋白質與飽足感。",
    "image": "assets/images/soy-milk.svg",
    "source": "無糖中杯豆漿 (約 350ml) 食品營養資料庫",
    "tips": "早餐店最推薦的黃金健康飲品，幾乎能與所有主餐完美搭配，補足蛋奶素者的蛋白質需求。"
  },
  {
    "id": "item-16",
    "name": "古早味紅茶",
    "category": "飲品與湯品",
    "healthLevel": "mid",
    "healthLabel": "份量留意",
    "calories": 110,
    "carbs": 26.0,
    "protein": 0.5,
    "fat": 0.2,
    "description": "加入決明子與二砂糖熬煮的懷舊紅茶，香氣濃郁甘醇，但通常含糖量在半糖至全糖之間。",
    "image": "assets/images/black-tea.svg",
    "source": "早餐店中杯加糖紅茶平均甜度估算",
    "tips": "如果早餐主食已經包含較多碳水化合物，飲品建議優先選無糖茶飲或分次飲用。"
  },
  {
    "id": "item-17",
    "name": "經典台式奶茶",
    "category": "飲品與湯品",
    "healthLevel": "alert",
    "healthLabel": "油脂或鈉含量留意",
    "calories": 195,
    "carbs": 29.0,
    "protein": 1.0,
    "fat": 8.5,
    "description": "古早味紅茶調入奶精粉或煉乳，口感絲滑濃甜，被許多人戲稱為「早餐店清腸神飲」。",
    "image": "assets/images/milk-tea.svg",
    "source": "連鎖早餐店中杯奶精奶茶 (約 350ml) 估算",
    "tips": "奶精主要成分為氫化植物油與糖，含飽和脂肪較高，建議可升級為鮮奶茶以獲取真正乳鈣質。"
  },
  {
    "id": "item-18",
    "name": "台式玉米濃湯",
    "category": "飲品與湯品",
    "healthLevel": "mid",
    "healthLabel": "份量留意",
    "calories": 160,
    "carbs": 24.0,
    "protein": 4.5,
    "fat": 5.5,
    "description": "含有玉米粒、蛋花與洋蔥，湯頭通常使用奶油炒麵粉或太白粉勾芡，暖心且具有濃稠感。",
    "image": "assets/images/corn-soup.svg",
    "source": "早餐店單碗玉米濃湯配方熱量估算",
    "tips": "勾芡湯品碳水較高，天冷時暖胃佳品，搭配蛋白質豐富的原味蛋餅或里肌吐司相得益彰。"
  }
];

// 應用程式狀態管理
const state = {
  items: [],
  selectedCategory: '全部',
  searchQuery: '',
  selectedItem: null
};

// DOM 元素選取
const cardsContainer = document.getElementById('breakfastCardsContainer');
const categoryButtons = document.querySelectorAll('.category-btn');
const searchInput = document.getElementById('searchInput');
const resultsCountEl = document.getElementById('resultsCount');
const totalItemsStatEl = document.getElementById('totalItemsStat');
const avgCaloriesStatEl = document.getElementById('avgCaloriesStat');
const modalOverlay = document.getElementById('detailModalOverlay');
const modalCloseBtn = document.getElementById('modalCloseBtn');

/**
 * 載入早餐資料庫
 */
async function loadBreakfastData() {
  try {
    const response = await fetch('data/breakfast.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    state.items = data;
    console.log(`成功由 data/breakfast.json 載入 ${data.length} 筆早餐品項。`);
  } catch (error) {
    console.warn('非伺服器環境或讀取 JSON 失敗，改用內建備援資料顯示：', error);
    state.items = BACKUP_BREAKFAST_DATA;
  }

  updateHeroStats();
  renderCards();
}

/**
 * 更新 Hero 統計數據
 */
function updateHeroStats() {
  if (totalItemsStatEl) {
    totalItemsStatEl.textContent = `${state.items.length} 項`;
  }
  if (avgCaloriesStatEl && state.items.length > 0) {
    const sumCal = state.items.reduce((acc, cur) => acc + (cur.calories || 0), 0);
    const avgCal = Math.round(sumCal / state.items.length);
    avgCaloriesStatEl.textContent = `${avgCal} kcal`;
  }
}

/**
 * 篩選資料
 */
function getFilteredItems() {
  return state.items.filter(item => {
    // 分類篩選
    const matchCategory = (state.selectedCategory === '全部') || (item.category === state.selectedCategory);
    // 關鍵字搜尋
    const query = state.searchQuery.trim().toLowerCase();
    const matchSearch = !query || 
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      (item.healthLabel && item.healthLabel.toLowerCase().includes(query)) ||
      (item.description && item.description.toLowerCase().includes(query));

    return matchCategory && matchSearch;
  });
}

/**
 * 渲染卡片清單
 */
function renderCards() {
  if (!cardsContainer) return;

  const filtered = getFilteredItems();

  // 更新目前搜尋比數提示
  if (resultsCountEl) {
    resultsCountEl.textContent = `共顯示 ${filtered.length} 項餐點`;
  }

  if (filtered.length === 0) {
    cardsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🍳</div>
        <div class="empty-title">查無符合的早餐品項</div>
        <div class="empty-desc">試著切換分類或搜尋其他餐點關鍵字（例如：蛋餅、吐司、豆漿）</div>
      </div>
    `;
    return;
  }

  cardsContainer.innerHTML = filtered.map(item => `
    <article class="breakfast-card" data-id="${item.id}">
      <div class="card-image-wrap">
        <span class="card-category-badge">${escapeHTML(item.category)}</span>
        <img class="card-image" src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" loading="lazy" onerror="this.src='assets/images/favicon.svg'">
      </div>
      <div class="card-body">
        <div class="card-header-row">
          <h3 class="card-title">${escapeHTML(item.name)}</h3>
          <span class="health-badge ${escapeHTML(item.healthLevel)}">
            ${getHealthBadgeIcon(item.healthLevel)} ${escapeHTML(item.healthLabel)}
          </span>
        </div>

        <p class="card-desc">${escapeHTML(item.description)}</p>

        <div class="card-nutrition-grid">
          <div class="nutrition-item">
            <span class="nutrition-label">熱量</span>
            <span class="nutrition-value calories">${item.calories}</span>
            <span class="nutrition-unit">kcal</span>
          </div>
          <div class="nutrition-item">
            <span class="nutrition-label">碳水</span>
            <span class="nutrition-value">${item.carbs}</span>
            <span class="nutrition-unit">g</span>
          </div>
          <div class="nutrition-item">
            <span class="nutrition-label">蛋白質</span>
            <span class="nutrition-value">${item.protein}</span>
            <span class="nutrition-unit">g</span>
          </div>
          <div class="nutrition-item">
            <span class="nutrition-label">脂肪</span>
            <span class="nutrition-value">${item.fat}</span>
            <span class="nutrition-unit">g</span>
          </div>
        </div>

        <button class="card-action-btn" type="button" onclick="openItemModal('${item.id}')">
          查看詳細資訊 🔍
        </button>
      </div>
    </article>
  `).join('');
}

/**
 * 輔助：健康等級圖示
 */
function getHealthBadgeIcon(level) {
  switch (level) {
    case 'good': return '🟢';
    case 'mid': return '🟡';
    case 'alert': return '🟠';
    default: return '⚪';
  }
}

/**
 * 安全跳脫 HTML 避免 XSS
 */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 開啟詳細資訊彈窗 (Modal)
 */
window.openItemModal = function(itemId) {
  const item = state.items.find(i => i.id === itemId);
  if (!item || !modalOverlay) return;

  state.selectedItem = item;

  // 計算三大營養素熱量佔比條
  // 碳水 4 kcal/g, 蛋白質 4 kcal/g, 脂肪 9 kcal/g
  const carbsCal = (item.carbs || 0) * 4;
  const proteinCal = (item.protein || 0) * 4;
  const fatCal = (item.fat || 0) * 9;
  const totalMacroCal = (carbsCal + proteinCal + fatCal) || 1;

  const carbsPct = Math.round((carbsCal / totalMacroCal) * 100);
  const proteinPct = Math.round((proteinCal / totalMacroCal) * 100);
  const fatPct = Math.max(0, 100 - carbsPct - proteinPct);

  // 填入 Modal 內容
  document.getElementById('modalImage').src = item.image;
  document.getElementById('modalImage').alt = item.name;
  document.getElementById('modalCategoryBadge').textContent = item.category;
  
  const healthBadgeEl = document.getElementById('modalHealthBadge');
  healthBadgeEl.className = `health-badge ${item.healthLevel}`;
  healthBadgeEl.innerHTML = `${getHealthBadgeIcon(item.healthLevel)} ${escapeHTML(item.healthLabel)}`;

  document.getElementById('modalTitle').textContent = item.name;
  document.getElementById('modalDesc').textContent = item.description;

  // 營養素進度條
  document.getElementById('modalCarbsText').textContent = `${item.carbs}g (${carbsPct}%)`;
  document.getElementById('modalCarbsBar').style.width = `${carbsPct}%`;

  document.getElementById('modalProteinText').textContent = `${item.protein}g (${proteinPct}%)`;
  document.getElementById('modalProteinBar').style.width = `${proteinPct}%`;

  document.getElementById('modalFatText').textContent = `${item.fat}g (${fatPct}%)`;
  document.getElementById('modalFatBar').style.width = `${fatPct}%`;

  document.getElementById('modalTotalCalText').textContent = `${item.calories} kcal`;

  // 飲食與搭配建議
  const tipsContentEl = document.getElementById('modalTipsContent');
  tipsContentEl.textContent = item.tips || '均衡攝取各類營養素，並根據個人一天的活動量進行搭配。';

  // 資料來源
  document.getElementById('modalSourceText').textContent = item.source || '台灣在地常見早餐料理估算依據';

  // 顯示 Modal
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

/**
 * 關閉 Modal
 */
function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  state.selectedItem = null;
}

// 註冊分類篩選按鈕事件
categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.selectedCategory = btn.getAttribute('data-category');
    renderCards();
  });
});

// 註冊搜尋框事件
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderCards();
  });
}

// 註冊 Modal 關閉事件
if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeModal);
}

if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
}

// 鍵盤 ESC 關閉 Modal
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
    closeModal();
  }
});

// 初始化應用程式
document.addEventListener('DOMContentLoaded', () => {
  loadBreakfastData();
});
