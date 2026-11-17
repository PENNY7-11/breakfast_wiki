# 早餐店品項 Breakfast Wiki (LLM Wiki Architecture)

> 🍳 從日常早餐開始，認識每一份餐點的營養資訊。  
> 本專案實踐 **Andrej Karpathy LLM Wiki** 核心理念，打造持續累積、結構化維護的台灣在地早餐營養知識庫。

---

## 🌟 專案特色

1. **Karpathy LLM Wiki 理念落地**：
   - 三層架構：原始資料（Raw Sources）→ 知識維基（The Wiki / JSON）→ AI 規範手冊（The Schema / `AGENTS.md`）。
   - 知識庫是一份可持續複利增長的資產（Persistent Compounding Artifact），由人類負責選題引導、AI 負責摘要維護與格式校驗。
   - 配備內容目錄索引（`index.md`）與異動紀錄（`log.md`）。
2. **溫暖生活感視覺設計**：
   - 採用米白色為主背景，搭配奶油黃、天空淡藍與溫潤咖啡色。
   - 圓角卡片設計（`border-radius: 20px`）搭配細緻陰影與清楚邊框。
   - 包含 18 款高品質原創 SVG 食物插圖，不依賴外部圖床，零破圖風險。
3. **客觀健康資訊分級**：
   - 🟢 `good` 均衡搭配推薦
   - 🟡 `mid` 份量留意
   - 🟠 `alert` 油脂或鈉含量留意
   - 遵守食物中立性，不作評價式批評論述。
4. **豐富卡片與互動彈窗（Modal）**：
   - 支援 5 大分類按鈕篩選與即時模糊搜尋。
   - 點擊卡片彈出完整營養資訊、三大營養素百分比條、營養師搭配小訣竅與來源估算依據。
5. **雙模式隨開即用**：
   - 支援直接雙擊 `index.html`（本機 `file://` 協議自動啟動備援資料），亦支援本地 HTTP 伺服器或 GitHub Pages 部署。

---

## 📁 專案資料夾結構

```text
breakfast-wiki/
│
├── AGENTS.md               # 核心規範：繁體中文 AI 開發與維護手冊 (11 大指引)
├── index.html              # 網站首頁（Hero 區、分類篩選、卡片網格、詳細彈窗、頁尾）
├── index.md                # Karpathy LLM Wiki 內容總目錄
├── log.md                  # Karpathy LLM Wiki 異動日誌 (Append-only)
├── README.md               # 專案說明與操作導覽
│
├── data/
│   └── breakfast.json      # 核心結構化早餐營養資料庫 (18 筆初版餐點)
│
├── css/
│   └── style.css           # 現代生活感樣式表 (響應式適配電腦、平板與手機)
│
├── js/
│   └── main.js             # 分類篩選、搜尋、動態渲染、三大營養素計算與彈窗邏輯
│
├── pages/
│   └── about.html          # 關於本專案獨立頁面（介紹 Karpathy 理念與搭餐指南）
│
└── assets/
    └── images/             # 早餐食物向量插圖集與網站 Favicon
        ├── favicon.svg
        ├── breakfast-hero.svg
        ├── plain-egg-crepe.svg
        ├── corn-egg-crepe.svg
        ├── cheese-egg-crepe.svg
        ├── veggie-egg-crepe.svg
        ├── bacon-egg-crepe.svg
        ├── ham-egg-toast.svg
        ├── tuna-egg-toast.svg
        ├── pork-chop-sandwich.svg
        ├── spicy-chicken-burger.svg
        ├── teriyaki-pork-burger.svg
        ├── hash-brown.svg
        ├── pepper-noodles.svg
        ├── turnip-cake.svg
        ├── rice-roll.svg
        ├── soy-milk.svg
        ├── black-tea.svg
        ├── milk-tea.svg
        └── corn-soup.svg
```

---

## 🚀 如何在本機預覽網站

### 方法一：直接雙擊開啟（最快速）
進入資料夾後，直接以滑鼠雙擊 **`index.html`**。`js/main.js` 內建自動偵測機制，即使瀏覽器安全策略阻擋 `file://` 下的 `fetch()`，也會無縫切換至備援資料庫，所有分類、搜尋、卡片與彈窗均能正常互動！

### 方法二：使用 Python 快速架設本地伺服器
若電腦中安裝有 Python，可在本資料夾開啟終端機或命令提示字元輸入：
```bash
python -m http.server 8000
```
接著在瀏覽器打開網址：
`http://localhost:8000`

### 方法三：使用 VS Code Live Server 擴充套件
在 VS Code 中開啟本資料夾，右鍵點擊 `index.html`，選擇 **「Open with Live Server」**。

---

## 🌐 如何部署到 GitHub Pages

若想將本網站公開發布讓所有人瀏覽，可免費部署至 GitHub Pages：

1. **建立 GitHub 儲存庫**：
   - 登入 GitHub，點擊右上角 `+` → **New repository**。
   - 儲存庫名稱填寫 `breakfast-wiki`，設為 **Public**，點擊 **Create repository**。
2. **上傳專案檔案**：
   - 在專案目錄打開終端機，執行以下指令：
     ```bash
     git init
     git add .
     git commit -m "feat: 初版發布早餐店品項 Breakfast Wiki"
     git branch -M main
     git remote add origin https://github.com/<你的使用者名稱>/breakfast-wiki.git
     git push -u origin main
     ```
3. **啟用 GitHub Pages**：
   - 在 GitHub 該專案頁面點擊 **Settings**（設定）→ 左側選單選擇 **Pages**。
   - 在 **Build and deployment** 下方的 **Source** 選擇 `Deploy from a branch`。
   - Branch 選擇 `main` 分支與 `/ (root)` 資料夾，點擊 **Save**。
4. **瀏覽網站**：
   - 等候約 1~2 分鐘，上方即會出現你的專屬線上網址：  
     `https://<你的使用者名稱>.github.io/breakfast-wiki/`。
