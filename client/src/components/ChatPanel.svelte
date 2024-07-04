<script>
  export let currentChatUser;
</script>

<style>
  .border-right {
    border-right: 1px solid #2f3336;
    border-left: 1px solid #2f3336;
  }

  .form-control::placeholder {
    color: #e7e9ea;
    opacity: 1;
    font-weight: bold;
  }

  .message {
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 5px;
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    font-weight: 400;
    font-size: 15px;
    line-height: 20px;
  }

  .message.sent {
    background-color: #1d9bf0;
    align-self: flex-end;
    text-align: right;
  }

  .message.received {
    background-color: #2f3336;
    color: #e7e9ea;
    align-self: flex-start;
  }

  .timestamp {
    font-size: 0.8rem;
    color: #71767b;
    margin-top: 2px;
  }

  .message.sent .timestamp {
    color: #cce7ff; /* Change this color to something that contrasts well with the sent message background */
  }

  .date-separator {
    text-align: center;
    color: #71767b;
    font-size: 0.9rem;
    margin: 10px 0;
    position: relative;
  }

  .date-separator::before,
  .date-separator::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background-color: #71767b;
  }

  .date-separator::before {
    left: 0;
  }

  .date-separator::after {
    right: 0;
  }

  .chat-body {
    overflow-y: auto;
    flex-grow: 1;
    padding-bottom: 60px; /* Height of the footer */
  }

  .chat-footer .input-container {
    display: flex;
    align-items: center;
    background-color: #202327;
    border-radius: 30px;
    width: 100%;
    padding: 5px;
  }

  .chat-footer .input-container textarea {
    background: transparent;
    border: none;
    color: #e7e9ea;
    box-shadow: none;
    resize: none;
    height: 40px;
    flex-grow: 1;
    min-width: 0;
    max-width: 100%;
    margin: 0 10px;
  }

  .chat-footer .input-container i {
    cursor: pointer;
  }
</style>

<div id="content-column" class="col-md-8 border-right d-flex flex-column p-3" style="position: relative; height: 100vh;">
  <div class="d-flex align-items-center mb-3">
    <img src="/user-img.png" alt="" class="rounded-circle" style="width: 40px; height: 40px;">
    <span class="username ms-2" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 700; font-size: 17px; line-height: 20px; color: #e7e9ea;">{currentChatUser.username}</span>
  </div>
  <div class="chat-body mb-3 d-flex flex-column">
    <!-- Date Separator -->
    <div class="date-separator">7th June</div>
    <!-- Placeholder messages -->
    <div class="message received">
      <div>Hello! How are you?</div>
      <div class="timestamp">10:00 AM</div>
    </div>
    <div class="message sent">
      <div>I'm good, thank you! How about you?</div>
      <div class="timestamp">10:02 AM</div>
    </div>
    <div class="message received">
      <div>I'm doing great! What are you up to?</div>
      <div class="timestamp">10:03 AM</div>
    </div>
    <div class="message sent">
      <div>Just working on some projects. How's everything with you?</div>
      <div class="timestamp">10:05 AM</div>
    </div>
    <div class="message received">
      <div>Same here. Just keeping busy with work.</div>
      <div class="timestamp">10:07 AM</div>
    </div>
    <!-- New Date Separator -->
    <div class="date-separator">12th June</div>
    <!-- Placeholder messages -->
    <div class="message received">
      <div>Hey, are you free to catch up this weekend?</div>
      <div class="timestamp">11:00 AM</div>
    </div>
    <div class="message sent">
      <div>Yes, let's plan something!</div>
      <div class="timestamp">11:05 AM</div>
    </div>
  </div>
  <div class="chat-footer d-flex align-items-center">
    <div class="input-container">
      <i class="bi bi-file-image text-primary ms-2 me-3"></i>
      <i class="bi bi-filetype-gif text-primary me-3"></i>
      <i class="bi bi-emoji-smile text-primary me-3"></i>
      <textarea class="form-control" placeholder="Start a new message"></textarea>
      <i class="bi bi-send text-primary ms-3"></i>
    </div>
  </div>
</div>
