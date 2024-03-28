// start: Sidebar

(function () {
  const socket = io(); // Không cần chọn ".app" vì không có class "app" trong HTML mới
  let uname;
  let messageHistory = [];
  // Xử lý khi nhấn nút gửi tin nhắn
  document
    .querySelector(".chat-sidebar-profile-toggle")
    .addEventListener("click", function (e) {
      e.preventDefault();
      this.parentElement.classList.toggle("active");
    });

  document.addEventListener("click", function (e) {
    if (!e.target.matches(".chat-sidebar-profile, .chat-sidebar-profile *")) {
      document
        .querySelector(".chat-sidebar-profile")
        .classList.remove("active");
    }
  });
  // end: Sidebar

  // start: Coversation

  document.addEventListener("click", function (e) {
    if (
      !e.target.matches(
        ".conversation-item-dropdown, .conversation-item-dropdown *"
      )
    ) {
      document
        .querySelectorAll(".conversation-item-dropdown")
        .forEach(function (i) {
          i.classList.remove("active");
        });
    }
  });

  document
    .querySelectorAll(".conversation-form-input")
    .forEach(function (item) {
      item.addEventListener("input", function () {
        this.rows = this.value.split("\n").length;
      });
    });

  document.querySelectorAll("[data-conversation]").forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelectorAll(".conversation").forEach(function (i) {
        i.classList.remove("active");
      });
      document.querySelector(this.dataset.conversation).classList.add("active");
    });
  });

  document.querySelectorAll(".conversation-back").forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      this.closest(".conversation").classList.remove("active");
      document.querySelector(".conversation-default").classList.add("active");
    });
  });
  document
    .querySelector(".conversation-form-submit")
    .addEventListener("click", function () {
      let message = document.getElementById("message-input").value;
      if (message.length == 0) {
        return;
      }
      sendMessage(message);
    });

  // Xử lý khi nhấn nút quay lại
  document
    .querySelector(".conversation-back")
    .addEventListener("click", function () {
      document.querySelector(".conversation").classList.remove("active");
      document.querySelector(".content-sidebar").classList.add("active");
    });
  socket.on("update", function (update) {
    renderMessage("update", update);
  });
  socket.on("chat", function (message) {
    renderMessage("other", message);
    addToMessageHistory(message); // Thêm tin nhắn mới vào lịch sử
    addDropdownToggleEvents();
  });

  function sendMessage(message) {
    renderMessage("my", { text: message });
    socket.emit("chat", { text: message });
    document.getElementById("message-input").value = "";
    addToMessageHistory({ text: message, sender: "my" }); // Thêm tin nhắn gửi đi vào lịch sử
  }
  function addToMessageHistory(message) {
    messageHistory.push(message);
  }
  function renderMessage(type, message) {
    let conversationWrapper = document.querySelector(".conversation-wrapper");
    if (type == "my") {
      let el = document.createElement("li");
      el.setAttribute("class", "conversation-item");
      el.innerHTML = `
        <div class="conversation-item-side">
        <img class="conversation-item-image" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" alt="" />
        </div>
        <div class="conversation-item-content">
      <div class="conversation-item-wrapper">
          <div class="conversation-item-box">
              <div class="conversation-item-text">
                  <p>${message.text}</p>
                  <div class="conversation-item-time">${getCurrentTime()}</div>
              </div>
              <div class="conversation-item-dropdown">
                  <button type="button" class="conversation-item-dropdown-toggle">
                      <i class="ri-more-2-line"></i>
                  </button>
                  <ul class="conversation-item-dropdown-list">
                      <li>
                          <a href="#"><i class="ri-share-forward-line"></i> Forward</a>
                      </li>
                      <li>
                          <a href="#"><i class="ri-delete-bin-line"></i> Delete</a>
                      </li>
                  </ul>
              </div>
          </div>
      </div>
  </div>


      `;

      conversationWrapper.appendChild(el);

      addDropdownToggleEvents();
    } else if (type == "other") {
      let el = document.createElement("li");
      el.setAttribute("class", "conversation-item me");
      el.innerHTML = `
      <div class="conversation-item-side">
      <img class="conversation-item-image" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" alt="" />
  </div>
  <div class="conversation-item-content">
      <div class="conversation-item-wrapper">
          <div class="conversation-item-box">
              <div class="conversation-item-text">
                  <p>${message.text}</p>
                  <div class="conversation-item-time">${getCurrentTime()}</div>
              </div>
              <div class="conversation-item-dropdown">
                  <button type="button" class="conversation-item-dropdown-toggle">
                      <i class="ri-more-2-line"></i>
                  </button>
                  <ul class="conversation-item-dropdown-list">
                      <li>
                          <a href="#"><i class="ri-share-forward-line"></i> Forward</a>
                      </li>
                      <li>
                          <a href="#"><i class="ri-delete-bin-line"></i> Delete</a>
                      </li>
                  </ul>
              </div>
          </div>
      </div>
  </div>


      `;

      conversationWrapper.appendChild(el);

      addDropdownToggleEvents();
    } else if (type == "update") {
      let el = document.createElement("div");
      el.setAttribute("class", "update");
      el.innerText = message;
      conversationWrapper.appendChild(el);
    }
  }

  function getCurrentTime() {
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  function addDropdownToggleEvents() {
    document
      .querySelectorAll(".conversation-item-dropdown-toggle")
      .forEach(function (item) {
        item.addEventListener("click", function (e) {
          e.preventDefault();
          if (this.parentElement.classList.contains("active")) {
            this.parentElement.classList.remove("active");
          } else {
            document
              .querySelectorAll(".conversation-item-dropdown")
              .forEach(function (i) {
                i.classList.remove("active");
              });
            this.parentElement.classList.add("active");
          }
        });
      });
  }
})();
