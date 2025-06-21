# Wanderlust Travel Client

Wanderlust Travel 的前端 React 應用程式，提供現代化的用戶介面來瀏覽和預訂飯店。

## 功能特色

- 🏨 飯店瀏覽和搜尋
- 🔍 智能篩選功能（地點、價格、關鍵字）
- ❤️ 收藏飯店功能
- 👤 用戶認證和個人資料管理
- 💬 完整訊息系統（發送、回覆、查看）
- 📊 員工管理面板（飯店管理、統計資訊）
- 📱 響應式設計
- 🎨 Material-UI 設計系統
- 🔐 角色權限控制

## 技術棧

- **Framework**: React 19
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v7
- **State Management**: React Context
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Handling**: React Hooks

## 快速開始

### 環境需求
- Node.js 16+
- npm 或 yarn

### 安裝步驟

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **設定環境變數**
   創建 `.env` 檔案：
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_NAME=Wanderlust Travel
   REACT_APP_VERSION=1.0.0
   ```

3. **啟動開發伺服器**
   ```bash
   npm start
   ```

4. **開啟瀏覽器**
   訪問 `http://localhost:3000`

## 專案結構

```
src/
├── components/     # 可重用組件
│   ├── Layout.tsx          # 主要佈局組件
│   └── ProtectedRoute.tsx  # 路由保護組件
├── contexts/       # React Context
│   └── AuthContext.tsx     # 認證狀態管理
├── pages/          # 頁面組件
│   ├── Home.tsx            # 首頁
│   ├── Hotels.tsx          # 飯店列表
│   ├── HotelDetail.tsx     # 飯店詳情
│   ├── Login.tsx           # 登入頁面
│   ├── Register.tsx        # 註冊頁面
│   ├── Profile.tsx         # 個人資料
│   ├── Favorites.tsx       # 收藏頁面
│   ├── Messages.tsx        # 訊息中心
│   └── Dashboard.tsx       # 管理面板
├── services/       # API 服務
│   └── api.ts             # API 整合
├── types/          # TypeScript 類型定義
│   └── index.ts           # 共用類型
└── App.tsx         # 應用程式入口
```

## 主要功能

### 用戶功能
- **首頁** (`/`) - 展示特色飯店和功能介紹
- **飯店列表** (`/hotels`) - 瀏覽和搜尋飯店，支援篩選
- **飯店詳情** (`/hotels/:id`) - 查看飯店詳細資訊，收藏功能
- **登入** (`/login`) - 用戶登入
- **註冊** (`/register`) - 用戶註冊（支援員工註冊碼）
- **個人資料** (`/profile`) - 管理個人資料，上傳頭像
- **收藏** (`/favorites`) - 查看和管理收藏的飯店
- **訊息** (`/messages`) - 發送和查看訊息

### 員工功能
- **管理面板** (`/dashboard`) - 飯店管理、統計資訊
  - 新增/編輯/刪除飯店
  - 查看統計數據
  - 管理飯店狀態

## 開發指南

### 新增頁面
1. 在 `src/pages/` 創建新的頁面組件
2. 在 `src/App.tsx` 添加路由
3. 在 `src/types/` 定義相關類型

### 新增 API 服務
1. 在 `src/services/api.ts` 添加新的 API 方法
2. 在 `src/types/` 定義相關類型

### 樣式指南
- 使用 Material-UI 組件和主題
- 遵循響應式設計原則
- 保持一致的視覺風格

## 建置和部署

### 建置生產版本
```bash
npm run build
```

### 測試
```bash
npm test
```

## 與後端整合

前端應用程式需要與後端 API 配合使用：

1. 確保後端 API 正在運行 (`http://localhost:5000`)
2. 設定正確的 `REACT_APP_API_URL` 環境變數
3. 後端 API 文檔可訪問：`http://localhost:5000/api-docs`

## 最近更新

### 功能完善
- ✅ 修正 Material-UI Grid 組件型別錯誤
- ✅ 完善收藏功能（查看、移除收藏）
- ✅ 完善訊息系統（發送、回覆、查看）
- ✅ 完善管理面板（飯店管理、統計）
- ✅ 優化響應式佈局
- ✅ 清理未使用的導入

### 技術改進
- ✅ 使用 Box 組件替代 Grid 避免型別問題
- ✅ 優化組件結構和代碼組織
- ✅ 改善錯誤處理和用戶體驗
- ✅ 完善 TypeScript 類型定義

## 授權

本專案採用 MIT 授權條款
