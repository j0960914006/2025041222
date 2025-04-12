let buttonLabels = ["首頁", "自我介紹", "作品集", "測驗卷", "教學影片"];
let buttons = [];
let circles = [];
let dropdown;
let subButtons = [];
let popupWindow = null; // 用於存放小視窗的 DOM 元素

function setup() {
  createCanvas(windowWidth, windowHeight); // 畫布與螢幕大小一致

  // 建立按鈕
  let buttonX = width - 600; // 調整按鈕的起始 X 座標，向左再移動 50
  let buttonY = 10;          // 按鈕的 Y 座標
  let buttonWidth = 100;     // 按鈕寬度
  let buttonHeight = 50;     // 按鈕高度
  let buttonSpacing = 15;    // 按鈕間距

  for (let i = 0; i < buttonLabels.length; i++) {
    let x = buttonX + i * (buttonWidth + buttonSpacing);
    let btn = createButton(buttonLabels[i]);
    btn.position(x, buttonY);
    btn.size(buttonWidth, buttonHeight);
    btn.style('font-size', '18px'); // 字體大小
    btn.style('font-weight', 'bold'); // 字體變粗
    btn.style('border-radius', '10px'); // 框變圓潤
    btn.style('transition', 'background-color 0.3s'); // 平滑變色過渡
    btn.mouseOver(() => btn.style('background-color', '#ADD8E6')); // 滑鼠移入變為淡藍色
    btn.mouseOut(() => btn.style('background-color', '')); // 滑鼠移出恢復原色
    if (buttonLabels[i] === "作品集") {
      btn.mousePressed(() => toggleDropdown(x, buttonY + buttonHeight + 5)); // 點擊作品集按鈕顯示選項
    } else if (buttonLabels[i] === "自我介紹") {
      btn.mousePressed(() => showIntroduction()); // 自我介紹按鈕事件
    } else if (buttonLabels[i] === "教學影片") {
      btn.mousePressed(() => showPopup("https://cfchen58.synology.me/%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%882024/B2/week5/20250317_103952.mp4")); // 教學影片連結
    } else if (buttonLabels[i] === "測驗卷") {
      btn.mousePressed(() => generateQuiz()); // 測驗卷按鈕事件
    } else {
      btn.mousePressed(() => handleButtonClick(buttonLabels[i])); // 設定其他按鈕點擊事件
    }
    buttons.push(btn);
  }

  // 建立小視窗的 DOM 元素
  popupWindow = createDiv('');
  popupWindow.style('position', 'absolute');
  popupWindow.style('width', '80%');
  popupWindow.style('height', '80%');
  popupWindow.style('top', '10%');
  popupWindow.style('left', '10%');
  popupWindow.style('background-color', 'white');
  popupWindow.style('border', '2px solid black');
  popupWindow.style('border-radius', '10px');
  popupWindow.style('overflow', 'auto');
  popupWindow.style('display', 'none'); // 預設隱藏
  let closeButton = createButton('關閉');
  closeButton.parent(popupWindow);
  closeButton.style('position', 'absolute');
  closeButton.style('top', '10px');
  closeButton.style('right', '10px');
  closeButton.mousePressed(() => popupWindow.style('display', 'none')); // 點擊關閉按鈕隱藏小視窗

  // 隨機產生更多圓，並讓圓分散得更均勻
  for (let i = 0; i < 50; i++) { // 增加圓的數量
    let r, g, b;
    do {
      r = random(100, 255);
      g = random(100, 255);
      b = random(100, 255);
    } while (dist(r, g, b, 0, 255, 0) < 100 || dist(r, g, b, 255, 182, 193) < 100); 
    // 確保顏色與綠色 (0, 255, 0) 和背景顏色 (255, 182, 193) 差異足夠
    circles.push({
      x: random(50, width - 50), // 確保圓不會靠近邊界
      y: random(50, height - 50),
      r: random(10, 50),
      color: color(r, g, b)
    });
  }
}

function draw() {
  background(185, 251, 192); // 設定背景顏色為 b9fbc0 (RGB: 185, 251, 192)

  // 繪製圓，並讓圓隨滑鼠移動改變大小
  for (let circle of circles) {
    let distance = dist(mouseX, mouseY, circle.x, circle.y);
    let newRadius = circle.r + map(distance, 0, width, 20, -10); // 根據滑鼠距離調整大小
    newRadius = constrain(newRadius, 5, 100); // 限制圓的大小範圍
    fill(circle.color);
    noStroke();
    ellipse(circle.x, circle.y, newRadius * 2);
  }
}

// 處理按鈕點擊事件
function handleButtonClick(label) {
  if (label === "首頁") {
    resetToHome(); // 點選首頁按鈕時回到最初畫面
  } else {
    console.log(label + " 按鈕被按下");
  }
}

// 回到最初畫面
function resetToHome() {
  // 移除所有子選項按鈕
  subButtons.forEach(btn => btn.remove());
  subButtons = [];
  
  // 隱藏小視窗
  popupWindow.style('display', 'none');
  
  console.log("回到首頁");
}

function toggleDropdown(x, y) {
  // 如果子選項按鈕已存在，移除它們
  if (subButtons.length > 0) {
    subButtons.forEach(btn => btn.remove());
    subButtons = [];
  } else {
    // 建立子選項按鈕
    let subButtonLabels = ["扭動作品", "問答作業", "海草"]; // 更新子選單
    let subButtonWidth = 100;
    let subButtonHeight = 40;
    let subButtonSpacing = 5;

    for (let i = 0; i < subButtonLabels.length; i++) {
      let btnY = y + i * (subButtonHeight + subButtonSpacing);
      let btn = createButton(subButtonLabels[i]);
      btn.position(x, btnY);
      btn.size(subButtonWidth, subButtonHeight);
      btn.style('font-size', '16px'); // 子選項字體大小
      btn.style('font-weight', 'bold'); // 字體變粗
      btn.style('border-radius', '8px'); // 框變圓潤
      btn.style('background-color', '#FFFFE0'); // 子選項背景顏色改為淡黃色
      if (subButtonLabels[i] === "扭動作品") {
        btn.mousePressed(() => showPopup("https://j0960914006.github.io/20250303_3/")); 
      } else if (subButtonLabels[i] === "問答作業") {
        btn.mousePressed(() => showPopup("https://j0960914006.github.io/0310/")); 
      } else if (subButtonLabels[i] === "海草") {
        btn.mousePressed(() => showPopup("https://j0960914006.github.io/20250412/")); 
      }
      subButtons.push(btn);
    }
  }
}

// 顯示小視窗並載入指定的 URL
function showPopup(url) {
  popupWindow.html(`<iframe src="${url}" style="width: 100%; height: 100%; border: none;"></iframe>`);
  popupWindow.style('width', '80%'); // 恢復文字框寬度
  popupWindow.style('height', '80%'); // 恢復文字框高度
  popupWindow.style('top', '10%'); // 恢復文字框垂直位置
  popupWindow.style('left', '10%'); // 恢復文字框水平位置
  popupWindow.style('background-color', 'white'); // 恢復背景顏色
  popupWindow.style('border', '2px solid black'); // 恢復外框線條
  popupWindow.style('border-radius', '10px'); // 恢復圓角
  popupWindow.style('display', 'block');
}

function showIntroduction() {
  popupWindow.html('<p style="font-size: 28px; font-weight: bold; color:rgb(231, 162, 78); text-align: center; line-height: 150%;">我叫高瑋佳，就讀淡江大學教育科技學系</p>');
  popupWindow.style('width', '50%'); // 調整文字框寬度
  popupWindow.style('height', '30%'); // 調整文字框高度
  popupWindow.style('top', '35%'); // 調整文字框垂直位置
  popupWindow.style('left', '25%'); // 調整文字框水平位置
  popupWindow.style('background-color', '#e9edc9'); 
  popupWindow.style('border', '4px solid rgb(200, 150, 90)'); 
  popupWindow.style('border-radius', '50%'); // 將邊框改為橢圓形
  popupWindow.style('display', 'flex'); // 使用 Flexbox
  popupWindow.style('align-items', 'center'); // 垂直置中
  popupWindow.style('justify-content', 'center'); // 水平置中
  popupWindow.style('text-align', 'center'); // 文字置中
}

function generateQuiz() {
  const questions = [
    {
      question: "1. 以下哪個是用於宣告常數的關鍵字？",
      options: ["let", "var", "const", "function"],
      correct: 2
    },
    {
      question: "2. 以下哪個是 JavaScript 中的邏輯運算子？",
      options: ["&&", "||", "!", "以上皆是"],
      correct: 3
    },
    {
      question: "3. 在 CSS 中，如何設定文字顏色？",
      options: ["font-color", "text-color", "color", "background-color"],
      correct: 2
    },
    {
      question: "4. JavaScript 中如何定義箭頭函數？",
      options: ["function() => {}", "() => {}", "=> function() {}", "以上皆是"],
      correct: 1
    },
    {
      question: "5. 以下哪個是用於迴圈的關鍵字？",
      options: ["for", "while", "do-while", "以上皆是"],
      correct: 3
    }
  ];

  // 隨機選擇 3 個題目
  const selectedQuestions = [];
  while (selectedQuestions.length < 3) {
    const randomIndex = Math.floor(Math.random() * questions.length);
    if (!selectedQuestions.includes(questions[randomIndex])) {
      selectedQuestions.push(questions[randomIndex]);
    }
  }

  // 顯示題目和選項
  let quizHTML = '<div style="font-size: 20px; font-weight: bold; color: #000; line-height: 1.5;">';
  selectedQuestions.forEach((q, index) => {
    quizHTML += `<p>${q.question}</p>`;
    q.options.forEach((option, i) => {
      quizHTML += `<button style="margin: 5px; padding: 5px 10px; font-size: 16px;" onclick="checkAnswer(${index}, ${i}, ${q.correct})">${option}</button>`;
    });
    quizHTML += `<p id="feedback-${index}" style="color: green; font-weight: bold;"></p>`;
  });
  quizHTML += '</div>';

  popupWindow.html(quizHTML);
  popupWindow.style('width', '60%'); // 調整文字框寬度
  popupWindow.style('height', '50%'); // 調整文字框高度
  popupWindow.style('top', '25%'); // 調整文字框垂直位置
  popupWindow.style('left', '20%'); // 調整文字框水平位置
  popupWindow.style('background-color', '#FFFACD'); // 淡黃色背景
  popupWindow.style('border', '3px solid #000'); // 黑色外框線條
  popupWindow.style('border-radius', '10px'); // 圓角
  popupWindow.style('display', 'block');
}

function checkAnswer(questionIndex, selectedOption, correctOption) {
  const feedbackElement = select(`#feedback-${questionIndex}`);
  if (selectedOption === correctOption) {
    feedbackElement.html("正確！");
    feedbackElement.style('color', 'green');
  } else {
    feedbackElement.html("錯誤！");
    feedbackElement.style('color', 'red');
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 當視窗大小改變時調整畫布
}
