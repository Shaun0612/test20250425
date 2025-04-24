let table;
let currentQuestionIndex = 0;
let totalQuestions = 0;
let correctCount = 0;
let incorrectCount = 0;
let question = "";
let options;
let inputBox;
let submitButton;
let result = "";
let correctAnswer = "";
let questionType = "";

function preload() {
  // 載入 CSV 檔案
  table = loadTable("questions.csv", "csv", "header");
}

function setup() {
  // 產生一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);
  background("#CECEFF");

  // 設定題目總數
  totalQuestions = table.getRowCount();

  // 設定選項 (radio 按鈕)
  options = createRadio();
  options.style("font-size", "35px");
  options.style("color", "yellow");
  options.position(windowWidth / 2 - 200, windowHeight / 2 - 70);

  // 設定填空題輸入框
  inputBox = createInput();
  inputBox.style("font-size", "20px");
  inputBox.position(windowWidth / 2 - 100, windowHeight / 2 + 50);
  inputBox.hide(); // 預設隱藏

  // 設定送出按鈕
  submitButton = createButton("下一題");
  submitButton.style("font-size", "20px");
  submitButton.position(windowWidth / 2 - 30, windowHeight / 2 );
  submitButton.mousePressed(nextQuestion);

  // 顯示第一題
  loadQuestion(currentQuestionIndex);
}

function draw() {
  background("#CECEFF");

  // 繪製矩形
  fill("#FF359A");
  noStroke();
  rectMode(CENTER);
  rect(windowWidth / 2, windowHeight / 2, windowWidth / 2, windowHeight / 2);

  // 顯示題目
  fill(0);
  textSize(35);
  textAlign(CENTER, CENTER);
  text(question, windowWidth / 2, windowHeight / 2 - 100);

  // 顯示結果
//  text(result, windowWidth / 2, windowHeight / 2 + 75);
}

function loadQuestion(index) {
  // 從 CSV 中讀取題目與選項
  let row = table.getRow(index);
  questionType = row.get("type");
  question = row.get("question");
  correctAnswer = row.get("correct");   //取得正確答案
  correctAnswer = row.get("correct2");   //取得正確答案

  if (questionType === "choice") {
    // 顯示選擇題
    let option1 = row.get("option1");
    let option2 = row.get("option2");
    let option3 = row.get("option3");
    let option4 = row.get("option4");

    options.html("");
    options.option(option1);
    options.option(option2);
    options.option(option3);
    options.option(option4);
    options.show();
    inputBox.hide();
  } else if (questionType === "fill") {
    // 顯示填空題
    options.hide();   
    inputBox.show();  
    inputBox.value(""); // 清空輸入框
    inputBox.attribute("placeholder", "請輸入答案");
    inputBox.size(300, 50);   //設定輸入框大小
    inputBox.style("font-size", "24px");  //設定輸入框字體大小
    //動態調整輸入框位置
    inputBox.position(windowWidth / 2 - 150, windowHeight / 2 - 75);
  }

  // 清空結果
  result = "";
}

function nextQuestion() {
  // 檢查答案
  let selected;
  if (questionType === "choice") {
    selected = options.value(); // 取得選取的選項
  } else if (questionType === "fill") {
    selected = inputBox.value().trim(); // 取得填空題的輸入值
  }

  if (selected === correctAnswer) {
    correctCount++;
    result = "答對了！";
  } else {
    incorrectCount++;
    result = "答錯了！";
  }

  // 前往下一題或結束測驗
  currentQuestionIndex++;
  if (currentQuestionIndex < totalQuestions) {
    loadQuestion(currentQuestionIndex);
  } else {
    endQuiz();
  }
}

function endQuiz() {
  // 顯示測驗結果
  question = `測驗結束！答對：${correctCount} 題，答錯：${incorrectCount} 題`;
  options.hide();
  inputBox.hide();
  submitButton.html("再試一次");
  submitButton.mousePressed(restartQuiz);
}

function restartQuiz() {
  // 重置測驗
  currentQuestionIndex = 0;
  correctCount = 0;
  incorrectCount = 0;
  options.show();
  submitButton.html("下一題");
  loadQuestion(currentQuestionIndex);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  options.position(windowWidth / 2 - 100, windowHeight / 2 + 50);
  inputBox.position(windowWidth / 2 - 100, windowHeight / 2 + 50);
  submitButton.position(windowWidth / 2 - 30, windowHeight / 2 + 150);
}