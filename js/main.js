$(function () {
  // read files
  const test = localStorage.getItem("file");
  const dir = `../files/${test}.json`;
  let currentQuestion;
  let list = [];
  var arrFaker = Array(15)
    .fill(0)
    .map((v, i) => i++);
  let timeout;

  renderFaker();
  $.ajax({
    url: dir,
    success: function (data, status) {
      if (status === "success") {
        list = data.list;
        currentQuestion = list[0];
        renderQuestion(currentQuestion, timeout);
        $(".question-content").css("background-image", `url(${data.image})`);
        data.list.map((val) => {
          if (val.id === 1) {
            $(".list-question").append(`
            <span class="chosen">${val.id}</span>
        `);
          } else {
            $(".list-question").append(`
                <span>${val.id}</span>
            `);
          }
        });
      }
    },
  });

  $(document).on("click", ".answer-area span", function (e) {
    e.preventDefault();
    // disble other answers
    $(".answer-area span").not(this).addClass("disable");
    $(this).addClass("chosen");
    timeout = setTimeout(() => {
      renderAnswer(currentQuestion, timeout);
      //remove faker
      if (check(currentQuestion, $(this).text())) {
        removeFaker(arrFaker);
      }
    }, 3000);
  });
  const renderNext = () => {
    if (currentQuestion.id === list.length) {
      currentQuestion = list[0];
      renderQuestion(currentQuestion, timeout);
    } else {
      currentQuestion = list.find((val) => val.id === currentQuestion.id + 1);
      renderQuestion(currentQuestion, timeout);
    }
  };
  $(".next").click(function (e) {
    e.preventDefault();
    renderNext();
  });

  const renderPrev = () => {
    if (currentQuestion.id === 1) {
      currentQuestion = list[list.length - 1];
      renderQuestion(currentQuestion, timeout);
    } else {
      currentQuestion = list.find((val) => val.id === currentQuestion.id - 1);
      renderQuestion(currentQuestion, timeout);
    }
  };
  $(".prev").click(function (e) {
    e.preventDefault();
    renderPrev();
  });

  $(document).on("click", ".list-question span", function () {
    currentQuestion = list.find((val) => val.id === +$(this).text());
    renderQuestion(currentQuestion, timeout);
  });

  $(".help").click(function (e) {
    e.preventDefault();
    $(this).animate({ opacity: 0.3 });
  });

  $(document).on("keyup", function (e) {
    // next = 39
    if (e.keyCode === 39) {
      renderNext();
    }

    // prev = 37
    if (e.keyCode === 37) {
      renderPrev();
    }
  });
});

function renderQuestion(data, timeout) {
  if (timeout) {
    clearTimeout(timeout);
  }
  $(".list-question span").removeClass("chosen");
  $(".list-question span")
    .eq(data.id - 1)
    .addClass("chosen");
  $(".answer-area span").removeClass();
  $(".question-num").text(`Câu hỏi ${data.id}`);

  if (data.code) {
    $(".content").html(
      `${data.description}<textarea rows="7" cols="50" style="background: white; color: #333; padding: 10px;font-size: 18px">${data.code}</textarea>`
    );
  } else {
    $(".content").html(`${data.description}`);
  }
  $(".content").css({
    background: "#27ae60",
  });
  $(".answer-area").empty();
  for (i in data.answers) {
    if (data.answers[i]) {
      $(".answer-area").append(`
      <div><span>${data.answers[i]}</span></div>
`);
    }
  }
  // renderFaker(list)
}

function renderFaker(arr) {
  const getWidth = $(".question-content").innerWidth();
  const getHeight = $(".question-content").innerHeight();
  const w = getWidth / 5;
  const h = getHeight / 3;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      $(".question-content").append(`
      <div class="faker" style="width: ${w}px; height: ${h}px; position: absolute; top: ${
        j * h
      }px; left: ${i * w}px; background: #264653"></div>
    `);
    }
  }
}

function renderAnswer(data) {
  for (i in data.answers) {
    if (i === data.correct) {
      $(".answer-area span")
        .eq(String(data.correct).charCodeAt() - 97)
        .addClass("correct");
    }
  }
}

function removeFaker(arrFaker) {
  const rd = Math.floor(Math.random() * arrFaker.length);
  const remove = arrFaker[rd];
  arrFaker.splice(rd, 1);
  $(".question-content .faker").eq(remove).fadeOut();
}

function check(data, text) {
  if (data.answers[data.correct] === text) {
    return true;
  }
  return false;
}
