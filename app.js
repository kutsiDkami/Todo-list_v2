let editButton = document.querySelector("#edit");
let inputBox = document.querySelector("#todoText");
let todoBox = document.querySelector("#todoBox");
let del = document.getElementsByClassName("bi-trash");
let add = document.querySelector("#add");
var mainUrl = "https://64fc6978605a026163ae77aa.mockapi.io/listTodo";

//! edit buton ve css düzeltilecek, anabox css sıkıntısı var

async function displayData() {
  todoBox.innerHTML = "";
  const response = await fetch(mainUrl);

  const dataBase = await response.json();
  // console.log(dataBase); //? datanın gelidiğini kontrol etiğim kısım
  dataBase.forEach((item) => {
    // console.log(item); //? kontrol onclick="remove()"
    const data = item.Todo;
    let newLi = document.createElement("li");
    newLi.classList.add("Newlist" + item.id);
    newLi.innerHTML = `
    ${data} <span>
    <i class="bi bi-pencil-square" id="edit" onclick="update(${item.id})" ></i>
    <i class="bi bi-trash" id="del" onclick="remove(${item.id})"></i>
  </span>
  `;
    todoBox.appendChild(newLi);
  });
}

add.addEventListener("click", () => {
  addTodo();
});

function addTodo() {
  // console.log("click"); //?kontrol
  if (inputBox.value.trim() == "") {
    alert("hata");
  } else {
    async function postJSON(data) {
      const response = await fetch(mainUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      let newLi = document.createElement("li");
      newLi.classList.add("Newlist" + result.id);
      newLi.innerHTML = `
    ${inputBox.value} <span>
    <i class="bi bi-pencil-square" id="edit"  onclick="update(${result.id})"></i>
    <i class="bi bi-trash" id="del" onclick="remove(${result.id})" ></i>
  </span>
  `;
      todoBox.appendChild(newLi);
      inputBox.value = "";
    }

    const todo = { Todo: inputBox.value.trim() };
    postJSON(todo);

    // displayData();
  }
}

async function update(id) {
  const response = await fetch(mainUrl + "/" + id);
  const dataBase = await response.json();
  // console.log(dataBase); //?kontrol
  const newLi = todoBox.querySelector(".Newlist" + id);

  newLi.innerHTML = `
 <input type="text" id="yeni_${dataBase.id}" 
 autocomplete="off" maxlength="52" 
 style="
 width:80%; height:30px; font-size:18px;" 
 value="${dataBase.Todo}"/>
 <span>
 <i class="bi bi-pencil-square" id="edit" onclick="updateSave(${dataBase.id})" ></i>
 <i class="bi bi-trash" id="del" onclick="remove(${dataBase.id})"></i></span>
`;
}
async function updateSave(id) {
  let data = {
    Todo: document.getElementById("yeni_" + id).value,
    id: id,
  };

  const response = await fetch(mainUrl + "/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  // console.log(data); //?kontrol
  const newLi = todoBox.querySelector(".Newlist" + id);

  newLi.innerHTML = `
  ${data.Todo} <span>
  <i class="bi bi-pencil-square" id="edit" onclick="update(${data.id})" ></i>
  <i class="bi bi-trash" id="del" onclick="remove(${data.id})"></i>
</span>

`;
}

async function remove(id) {
  const response = await fetch(mainUrl + "/" + id, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();

  //? console.log(response); //?kontrol
  //? console.log(data);
  //?  console.log(id);

  const fakeDel = todoBox.querySelector(".Newlist" + id);
  //? console.log(fakeDel);
  fakeDel.remove();
}

document.addEventListener("DOMContentLoaded", () => {
  displayData();
});
