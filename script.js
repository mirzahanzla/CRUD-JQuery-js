$(document).ready(function () {
  let users = [];

  function fetchData() {
    $.ajax({
      url: "http://localhost:8000/api/users",
      method: "GET",
      success: function (data) {
        users = data;
        renderUsers();
      },
      error: function (xhr, status, error) {
        console.error("Error fetching data:", status, error);
      },
    });
  }

  function renderUsers() {
    $("#userList").empty();
    users.forEach(function (user, index) {
      const row = $(`
                <tr>
                    <td><span class="editableName" data-index="${index}">${user.name}</span></td>
                    <td><span class="editableEmail" data-index="${index}">${user.email}</span></td>
                    <td>
                        <button class="editBtn" data-index="${index}">Edit</button>
                        <button class="deleteBtn" data-id="${user.id}" data-index="${index}">Delete</button>

                    </td>
                </tr>
            `);
      $("#userList").append(row);
    });
  }

  $("#addBtn").click(function () {
    const name = $("#nameInput").val();
    const email = $("#emailInput").val();
    if (name !== "" && email !== "") {
      const newUser = { name: name, email: email };
      $.ajax({
        url: "http://localhost:8000/api/users",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(newUser),
        success: function (data) {
          users.push(data);
          renderUsers();
          $("#nameInput").val("");
          $("#emailInput").val("");
        },
        error: function (xhr, status, error) {
          console.error("Error adding user:", status, error);
        },
      });
    }
  });

  $(document).on("click", ".deleteBtn", function () {
    const userId = $(this).data("id");
    const index = $(this).data("index");
    $.ajax({
      url: "http://localhost:8000/api/users/" + userId,
      method: "DELETE",
      success: function () {
        users.splice(index, 1);
        renderUsers();
      },
      error: function (xhr, status, error) {
        console.error("Error deleting user:", status, error);
      },
    });
  });

  $(document).on("click", ".editBtn", function () {
    const index = $(this).data("index");
    const newName = prompt("Enter new name");
    const newEmail = prompt("Enter new email");
    console.log(index, users);
    if (
      newName !== null &&
      newName.trim() !== "" &&
      newEmail !== null &&
      newEmail.trim() !== ""
    ) {
      const updatedUser = { name: newName, email: newEmail };
      $.ajax({
        url: "http://localhost:8000/api/users/" + users[index].id,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(updatedUser),
        success: function (data) {
          users[index] = data;
          renderUsers();
        },
        error: function (xhr, status, error) {
          console.error("Error updating user:", status, error);
        },
      });
    }
  });

  fetchData();
});
