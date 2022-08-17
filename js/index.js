function start() {
  localStorage.clear();
  document.getElementById("practiceButton").addEventListener("click", function () { 
    if (localStorage.length === 0 || localStorage.length === 1) {
      alert("파일을 업로드 하세요.");
    } else {
      location.href = "./html/choose.html";
    }
  })
}

function moveTo(name) {
  loc = name + ".html";
  if (localStorage.length == 0) {
    alert("파일을 업로드하세요");
    return;
  }
  location.replace(loc);
}

function readExcel() {
  localStorage.clear();
  let input = event.target;
  let reader = new FileReader();
  reader.onload = function () {
    let data = reader.result;
    let workBook = XLSX.read(data, { type: 'binary' });
    workBook.SheetNames.forEach(function (sheetName) {
      console.log('SheetName: ' + sheetName);
      let rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
      for (let step = 0; step < rows.length; step++) {
        localStorage.setItem(rows[step].Cultivar, JSON.stringify(rows[step]))
      }
      
    })
    if (localStorage.length !== 0) {
      document.getElementById("excelUpload").classList.add("uploaded");
      document.getElementById("input-file").disabled = true;
    }
  };
  reader.readAsBinaryString(input.files[0]);
  
}

window.addEventListener("load", start, false);