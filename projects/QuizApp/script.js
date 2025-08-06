function generateQuestion() {
  const first = Math.floor(Math.random() * 25);
  const second = Math.floor(Math.random() * 25);
  const symbolNumber = Math.floor(Math.random() * 25);

  const question = document.getElementById('question');

  const opt1 = document.getElementById('option1');
  const opt2 = document.getElementById('option2');
  const opt3 = document.getElementById('option3');
  const opt4 = document.getElementById('option4');

  const score = document.getElementById('score');

  // Saare options ka fresh clone:
  const originalOptions = [opt1, opt2, opt3, opt4];
  const options = [];
  originalOptions.forEach(opt => {
    const newBtn = opt.cloneNode(true);
    opt.parentNode.replaceChild(newBtn, opt);
    options.push(newBtn); // Naye ref store karo
  });

  let symbol = '+';
  if (symbolNumber > 20) symbol = '+';
  else if (symbolNumber === 15) symbol = '-';
  else if (symbolNumber <= 10) symbol = '*';
  else if (symbolNumber <= 5) symbol = '/';

  question.innerHTML = `What is ${first} ${symbol} ${second}?`;
  const finalq = `${first} ${symbol} ${second}`;
  let convert = eval(finalq);

  // ✅ Random correct placement
  const correctIndex = Math.floor(Math.random() * 4);
  const used = [convert];

  options.forEach((btn, index) => {
    if (index === correctIndex) {
      btn.innerHTML = convert;
      btn.addEventListener('click', function () {
        let current = parseInt(score.innerHTML);
        score.innerHTML = current + 1;
        generateQuestion();
      });
    } else {
      let wrong;
      do {
        wrong = convert + Math.floor(Math.random() * 10) - 5;
      } while (used.includes(wrong));
      used.push(wrong);

      btn.innerHTML = wrong;
      btn.addEventListener('click', function () {
        alert("The Correct Ans Is " + convert);
        location.reload();
      });
    }
  });
}

generateQuestion();
