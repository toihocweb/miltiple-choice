$(function () {
  console.log("Admin Script!!!");
  // my code
  const listQuestion = [];
  renderTable();
  // handle show modal
  $(".btn-modal").click(function (e) {
    e.preventDefault();
    $(".modal").fadeIn().css("display", "flex");
  });

  $(".btn-cancel").click(function (e) {
    e.preventDefault();
    $(".modal").fadeOut();
  });

  // handle click add button
  $(".btn-add").click(function (e) {
    e.preventDefault();
    const question = $(".q").val();
    const a = $(".a-a").val();
    const b = $(".a-b").val();
    const c = $(".a-c").val();
    const d = $(".a-d").val();
    const code = $(".code").val();
    const correct = $(".a-correct").val();

    // console.log(question);
    listQuestion.push({
      id: listQuestion.length + 1,
      description: question,
      answers: {
        a,
        b,
        c,
        d,
      },
      code,
      correct,
    });

    $(".q-total").text(listQuestion.length);
  });
  // handle click submit button
  $(".btn-submit").click(function (e) {
    e.preventDefault();
    const testName = $(".test-name").val();
    const testImage = $(".test-image").val();

    if (!testName) {
      alert("test name is empty");
      return;
    }
    // console.log("testName", testName);
    const blob = new Blob([JSON.stringify({list: listQuestion, image: testImage})], {
      type: "application/json;utf-8",
    });
    const link = document.createElement("a");
    link.setAttribute("download", `${testName}-${Date.now()}.json`);
    link.setAttribute("href", window.URL.createObjectURL(blob));
    link.click();
    // clear object
    listQuestion.length = 0;
    // render table
    renderTable();
  });
  // handle click cancel button
});

async function renderTable() {
  const list = await listAllFiles();
  list.forEach((val) => {
    $("table tbody").append(`
    <tr>
        <td><span  onclick="handleClick('${val}')">${val}</span> </td>
    </tr>
`);
  });
}

function handleClick(val) {
  localStorage.setItem("file", val);
  window.location.href = "/";
}

function listAllFiles() {
  const fileExt = ".json";
  const list = [];
  return new Promise((resolve, reject) => {
    $.get("files/", function (data) {
      $(data)
        .find("a:contains(" + fileExt + ")")
        .each(function () {
          const file = $(this).text();
          list.push(file.split(".")[0]);
          resolve(list);
        });
    });
  });
}
