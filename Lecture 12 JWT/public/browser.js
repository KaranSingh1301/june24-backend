let skip = 0;

window.onload = genrateTodos;

function genrateTodos() {
  axios
    .get(`/read-item?skip=${skip}`)
    .then((res) => {
      console.log(res);
      if (res.data.status !== 200) {
        alert(res.data.message);
        return;
      }
      console.log(skip);
      const todos = res.data.data;
      skip += todos.length;
      console.log(skip);
      document.getElementById("item_list").insertAdjacentHTML(
        "beforeend",
        todos
          .map((item) => {
            return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
      <span class="item-text"> ${item.todo}</span>
      <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
      </div></li>`;
          })
          .join("")
      );
    })
    .catch((err) => {
      console.log(err);
    });
}

document.addEventListener("click", function (event) {
  //edit
  if (event.target.classList.contains("edit-me")) {
    const newData = prompt("Enter new Todo Text");
    const todoId = event.target.getAttribute("data-id");
    console.log(newData, todoId);

    axios
      .post("/edit-item", { newData, todoId })
      .then((res) => {
        if (res.data.status !== 200) {
          alert(res.data.message);
          return;
        }
        event.target.parentElement.parentElement.querySelector(
          ".item-text"
        ).innerHTML = newData;
      })
      .catch((err) => console.log(err));
  }
  //delete
  else if (event.target.classList.contains("delete-me")) {
    const todoId = event.target.getAttribute("data-id");

    axios
      .post("/delete-item", { todoId })
      .then((res) => {
        if (res.data.status !== 200) {
          alert(res.data.message);
          return;
        }
        event.target.parentElement.parentElement.remove();
      })
      .catch((err) => console.log(err));
  }
  //create
  else if (event.target.classList.contains("add_item")) {
    const todo = document.getElementById("create_field").value;

    axios
      .post("/create-item", { todo })
      .then((res) => {
        document.getElementById("create_field").value = "";
        const todo = res.data.data.todo;
        const todoId = res.data.data._id;
        document
          .getElementById("item_list")
          .insertAdjacentHTML(
            "beforeend",
            `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
          <span class="item-text"> ${todo}</span>
          <div>
          <button data-id="${todoId}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
          <button data-id="${todoId}" class="delete-me btn btn-danger btn-sm">Delete</button>
          </div></li>`
          )
          .join("");
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.status !== 500) {
          alert(err.response.data);
        }
      });
  }
  //show more
  else if (event.target.classList.contains("show_more")) {
    genrateTodos();
  }
});

//client (axios) <-----> server(api) <-----> database(I/O)
