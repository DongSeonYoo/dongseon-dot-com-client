const logSection = document.getElementById('log-section');
const menuAreaSection = document.getElementById('menu-area-section');

const recentOption = document.getElementById('recent-option');
const oldOption = document.getElementById('old-option');
const prevPageBtn = document.getElementById('prev-page-button');
const nextPageBtn = document.getElementById('next-page-button');
const logCountDiv = document.getElementById('log-count');
const idSerchForm = document.getElementById('loginid-search-form');

const recentSerchArea = document.getElementById('recent-search-area');

let apiCounts;
let maxPageCount;
// 전역 검색 필터
let selectedOrderValue = 'recent';
let selectedMethodValue = 'all';
let selectedSerchValue = '';
let currentPage = 1;

window.onload = async () => {
  // 관리자 권한 체크
  try {
    // await adminAuthCheck();
    // const logCount = await loadApiFetch(selectedOrderValue, selectedMethodValue);
    // apiCounts = logCount;
  } catch (error) {
    console.log(error);
  }
};

const onchangePage = (page) => {
  currentPage = page;
  loadApiFetch(selectedOrderValue, selectedMethodValue);
};

const updatePageMoveButton = () => {
  if (currentPage === 1) {
    return (prevPageBtn.disabled = true);
  }
  prevPageBtn.disabled = false;

  if (currentPage === maxPageCount) {
    return (nextPageBtn.disabled = true);
  }
  nextPageBtn.disabled = false;
};

const makeTag = (data) => {
  const logDiv = document.createElement('div');
  logDiv.classList.add('log');
  logDiv.onclick = clickLog;

  const timeSpan = document.createElement('span');
  timeSpan.classList.add('time');
  timeSpan.textContent = data.time;

  const ipSpan = document.createElement('span');
  ipSpan.classList.add('ip');
  ipSpan.textContent = data.ip;

  const statusSpan = document.createElement('span');
  statusSpan.classList.add('status');
  statusSpan.textContent = data.status;

  const methodSpan = document.createElement('span');
  methodSpan.classList.add('method');
  methodSpan.textContent = data.method;

  const loginIdSpan = document.createElement('span');
  loginIdSpan.classList.add('loginId');
  if (data.loginId) {
    loginIdSpan.textContent = data.loginId;
  } else {
    loginIdSpan.textContent = '로그인 X';
  }

  const apiSpan = document.createElement('span');
  apiSpan.classList.add('api');
  apiSpan.textContent = truncateData(JSON.stringify(data.api));

  const reqSpan = document.createElement('span');
  reqSpan.classList.add('request');
  reqSpan.textContent = truncateData(JSON.stringify(data.req));
  if (reqSpan.textContent === '{}') {
    reqSpan.textContent = 'none';
  }

  const resSpan = document.createElement('span');
  resSpan.classList.add('response');
  resSpan.textContent = truncateData(JSON.stringify(data.res));

  const reqValue = document.createElement('input');
  reqValue.value = JSON.stringify(data.req);
  reqValue.type = 'hidden';

  const resValue = document.createElement('input');
  resValue.value = JSON.stringify(data.res);
  resValue.type = 'hidden';

  logDiv.appendChild(timeSpan);
  logDiv.appendChild(ipSpan);
  logDiv.appendChild(statusSpan);
  logDiv.appendChild(methodSpan);
  logDiv.appendChild(loginIdSpan);
  logDiv.appendChild(apiSpan);
  logDiv.appendChild(reqSpan);
  logDiv.appendChild(resSpan);
  logDiv.appendChild(reqValue);
  logDiv.appendChild(resValue);

  logSection.appendChild(logDiv);
};

const makeRecentSearchTag = (data) => {
  const recentSearchTag = document.createElement('button');
  recentSearchTag.classList.add('recent-search');
  recentSearchTag.innerHTML = data;
  recentSearchTag.onclick = function () {
    selectedSerchValue = this.innerHTML;
    idSerchForm.value = this.innerHTML;
    currentPage = 1;
    loadApiFetch(selectedOrderValue, selectedMethodValue);
  };

  recentSerchArea.appendChild(recentSearchTag);
  menuAreaSection.appendChild(recentSerchArea);
};

const clickLog = (e) => {
  console.log(e.target);
};

// 요청과 응답 데이터가 너무 길 경우 줄여서 표시
const truncateData = (data) => {
  const maxLength = 28;
  if (data.length > maxLength) {
    return data.slice(0, maxLength) + '...';
  }
  return data;
};

const onchangeOrderOption = () => {
  const orderOptionList = document.getElementById('order-option-list');

  selectedOrderValue = orderOptionList[orderOptionList.selectedIndex].value;
  loadApiFetch(selectedOrderValue, selectedMethodValue);
};

const onchangeMethodOption = () => {
  const methodOptionList = document.getElementById('method-option-list');

  selectedMethodValue = methodOptionList[methodOptionList.selectedIndex].value;
  loadApiFetch(selectedOrderValue, selectedMethodValue);
};

const onclickPrevButton = () => {
  if (currentPage > 1) {
    onchangePage(currentPage - 1);
  }
};

const onclickNextButton = () => {
  if (currentPage < maxPageCount) {
    onchangePage(currentPage + 1);
  }
};

const onclickSerchButton = () => {
  selectedSerchValue = idSerchForm.value;
  if (selectedSerchValue === '') {
    alert('아이디를 입력해주세요');
    return;
  }

  if (selectedSerchValue.length > 20) {
    alert('아이디는 20자 이하로 입력해주세요');
    idSerchForm.value = '';
    return;
  }

  if (selectedSerchValue) {
    currentPage = 1;
    loadApiFetch(selectedOrderValue, selectedMethodValue);
  }
};

const onclickInitFilter = () => {
  // selectedOrderValue = "recent";
  // selectedMethodValue = "all";
  // currentPage = 1;
  // selectedSerchValue = "";

  // loadApiFetch(selectedOrderValue, selectedMethodValue, currentPage);
  // 임..시....방.......편
  location.reload();
};

const loadApiFetch = async (order, method, page = currentPage, loginId = selectedSerchValue) => {
  try {
    const response = await fetch(
      `/api/log?order=${order}&method=${method}&page=${page}&loginId=${loginId}`,
    );
    const json = await response.json();

    // 응답 실패시
    if (response.status !== 200) {
      alert(json.message + 'q');
      location.reload();
      return;
    }
    if (json.data) {
      recentSerchArea.innerHTML = '';
      loadSearchHistoryFetch();

      logSection.innerHTML = '';
      const responsedData = json.data.log;
      responsedData.forEach((data) => makeTag(data));
      updatePageMoveButton();

      apiCounts = json.data.logCount;
      maxPageCount = Math.ceil(apiCounts / 16);
      logCountDiv.innerHTML = apiCounts + '개의 로그';
      return apiCounts;
    }
  } catch (error) {
    console.error(error);
  }
};

const loadSearchHistoryFetch = async () => {
  try {
    const response = await fetch('/api/log/recentSearch');
    const json = await response.json();

    if (response.status !== 200) {
      alert(json.message);
      return;
    }
    const recentSearchData = json.data.reverse();
    recentSearchData.forEach((data) => makeRecentSearchTag(data));
  } catch (error) {
    console.error(error);
  }
};
