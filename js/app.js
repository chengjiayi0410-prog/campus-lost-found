// 第 1 周使用静态假数据，先把页面结构和交互跑通。
// 第 2 周会用 Vue 重写视图，第 3 周开始把这些数据换成后端接口。
const items = [
  {
    id: 1,
    type: "lost",
    category: "card",
    title: "校园卡丢失，姓名李同学",
    description: "蓝色卡套，里面有一张校园卡和一张公交卡，可能落在第二教学楼。",
    location: "第二教学楼 305",
    date: "11月17日 14:20"
  },
  {
    id: 2,
    type: "found",
    category: "electronics",
    title: "捡到一副白色蓝牙耳机",
    description: "白色充电盒，盒盖内侧有一道浅浅的划痕，已交给图书馆服务台。",
    location: "图书馆三楼自习区",
    date: "11月18日 09:40"
  },
  {
    id: 3,
    type: "lost",
    category: "book",
    title: "《数据结构》教材，内有笔记",
    description: "绿色封面，扉页写着名字，书里夹着两张便利贴，复习急用。",
    location: "东区食堂二楼",
    date: "11月16日 18:05"
  },
  {
    id: 4,
    type: "found",
    category: "key",
    title: "捡到一串钥匙，挂着蓝色小熊",
    description: "一共三把钥匙，钥匙扣是蓝色小熊，目前在体育馆门卫处。",
    location: "体育馆正门",
    date: "11月18日 08:15"
  },
  {
    id: 5,
    type: "lost",
    category: "electronics",
    title: "黑色充电宝，侧面有白色贴纸",
    description: "容量 10000mAh，贴纸上写着英文名字，充电线一起丢失。",
    location: "图书馆一楼大厅",
    date: "11月17日 16:30"
  },
  {
    id: 6,
    type: "found",
    category: "card",
    title: "拾到学生证一张，姓名王同学",
    description: "在自动售货机旁边捡到，已拍照登记，请失主描述证件信息认领。",
    location: "一号教学楼 201 门口",
    date: "11月18日 11:10"
  },
  {
    id: 7,
    type: "lost",
    category: "other",
    title: "灰色雨伞，伞柄有姓名贴",
    description: "折叠伞，伞面是深灰色，伞柄贴着一张白色姓名贴，可能落在快递站。",
    location: "南门快递站",
    date: "11月15日 19:25"
  },
  {
    id: 8,
    type: "found",
    category: "book",
    title: "捡到一本《高等数学》习题册",
    description: "封面写着班级和学号后四位，里面有很多铅笔演算，暂放在自习室管理员处。",
    location: "西区自习室",
    date: "11月16日 21:00"
  },
  {
    id: 9,
    type: "lost",
    category: "electronics",
    title: "银色 U 盘，里面有课程资料",
    description: "金属外壳，挂着一根短绳，里面是小组作业和课程课件，非常重要。",
    location: "机房 A402",
    date: "11月17日 10:50"
  },
  {
    id: 10,
    type: "found",
    category: "other",
    title: "捡到一只粉色保温杯",
    description: "杯身有卡通图案，杯底贴着一张小贴纸，已放在田径场器材室。",
    location: "田径场看台",
    date: "11月18日 07:55"
  },
  {
    id: 11,
    type: "lost",
    category: "key",
    title: "宿舍钥匙，挂着小黄鸭",
    description: "钥匙圈上有一个小黄鸭挂件，可能是在去食堂的路上掉的。",
    location: "北区食堂",
    date: "11月16日 12:35"
  },
  {
    id: 12,
    type: "found",
    category: "card",
    title: "捡到身份证一张，请失主联系",
    description: "在校医院门口捡到，证件信息已做遮挡处理，请失主说明姓名后认领。",
    location: "校医院门口",
    date: "11月17日 09:05"
  }
];

const typeLabels = {
  lost: "失物",
  found: "招领"
};

const categoryLabels = {
  card: "证件卡片",
  electronics: "电子产品",
  book: "书籍资料",
  key: "钥匙",
  other: "其他"
};

const categoryIcons = {
  card: "💳",
  electronics: "📱",
  book: "📚",
  key: "🔑",
  other: "🎒"
};

const state = {
  keyword: "",
  type: "all",
  category: "all"
};

const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const cardGrid = document.querySelector("#cardGrid");
const cardTemplate = document.querySelector("#cardTemplate");
const emptyState = document.querySelector("#emptyState");
const resultCount = document.querySelector("#resultCount");
const totalCount = document.querySelector("#totalCount");
const resetFiltersBtn = document.querySelector("#resetFiltersBtn");
const detailDialog = document.querySelector("#detailDialog");
const toast = document.querySelector("#toast");

const dialogFields = {
  title: document.querySelector("#dialogTitle"),
  badge: document.querySelector("#dialogBadge"),
  category: document.querySelector("#dialogCategory"),
  desc: document.querySelector("#dialogDesc"),
  location: document.querySelector("#dialogLocation"),
  date: document.querySelector("#dialogDate")
};

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}

function getFilteredItems() {
  const keyword = state.keyword.trim().toLowerCase();

  return items.filter((item) => {
    const matchesType = state.type === "all" || item.type === state.type;
    const matchesCategory =
      state.category === "all" || item.category === state.category;

    const searchableText = [item.title, item.description, item.location]
      .join(" ")
      .toLowerCase();

    const matchesKeyword = keyword === "" || searchableText.includes(keyword);

    return matchesType && matchesCategory && matchesKeyword;
  });
}

function createCard(item) {
  const fragment = cardTemplate.content.cloneNode(true);
  const card = fragment.querySelector(".item-card");
  const badge = fragment.querySelector(".badge");
  const category = fragment.querySelector(".category");

  card.dataset.id = item.id;
  badge.textContent = typeLabels[item.type];
  badge.classList.add(item.type === "lost" ? "badge-lost" : "badge-found");
  category.textContent = categoryLabels[item.category];
  fragment.querySelector(".item-icon").textContent = categoryIcons[item.category];
  fragment.querySelector(".item-title").textContent = item.title;
  fragment.querySelector(".item-desc").textContent = item.description;
  fragment.querySelector(".item-location").textContent = item.location;
  fragment.querySelector(".item-date").textContent = item.date;

  return fragment;
}

function render() {
  const filteredItems = getFilteredItems();
  const fragment = document.createDocumentFragment();

  filteredItems.forEach((item) => {
    fragment.append(createCard(item));
  });

  cardGrid.replaceChildren(fragment);
  resultCount.textContent = filteredItems.length;
  totalCount.textContent = items.length;
  emptyState.hidden = filteredItems.length > 0;
}

function setActiveChip(selector, activeButton) {
  document.querySelectorAll(selector).forEach((button) => {
    button.classList.toggle("is-active", button === activeButton);
  });
}

document.querySelectorAll("[data-type]").forEach((button) => {
  button.addEventListener("click", () => {
    state.type = button.dataset.type;
    setActiveChip("[data-type]", button);
    render();
  });
});

document.querySelectorAll("[data-category]").forEach((button) => {
  button.addEventListener("click", () => {
    state.category = button.dataset.category;
    setActiveChip("[data-category]", button);
    render();
  });
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.keyword = searchInput.value;
  render();
  document.querySelector(".browse").scrollIntoView({ behavior: "smooth" });
});

searchInput.addEventListener("input", () => {
  state.keyword = searchInput.value;
  render();
});

resetFiltersBtn.addEventListener("click", () => {
  state.keyword = "";
  state.type = "all";
  state.category = "all";
  searchInput.value = "";
  setActiveChip("[data-type]", document.querySelector('[data-type="all"]'));
  setActiveChip("[data-category]", document.querySelector('[data-category="all"]'));
  render();
});

document.querySelectorAll(".js-publish").forEach((button) => {
  button.addEventListener("click", () => {
    showToast("发布功能将在第 2 周接入，先完成前端原型。");
  });
});

cardGrid.addEventListener("click", (event) => {
  const detailButton = event.target.closest(".card-link");
  if (!detailButton) return;

  const card = detailButton.closest(".item-card");
  const item = items.find((entry) => entry.id === Number(card.dataset.id));
  if (!item) return;

  dialogFields.title.textContent = item.title;
  dialogFields.badge.textContent = typeLabels[item.type];
  dialogFields.badge.className =
    "badge " + (item.type === "lost" ? "badge-lost" : "badge-found");
  dialogFields.category.textContent = categoryLabels[item.category];
  dialogFields.desc.textContent = item.description;
  dialogFields.location.textContent = item.location;
  dialogFields.date.textContent = item.date;

  detailDialog.showModal();
});

detailDialog.addEventListener("click", (event) => {
  if (event.target === detailDialog) {
    detailDialog.close();
  }
});

render();
