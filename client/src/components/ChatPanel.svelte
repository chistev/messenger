<script>
  import ChatContent from "./ChatContent.svelte";
  import { onMount } from "svelte";

  export let currentChatUser;

  let newMessage = "";
  let messages = [];

  // Function to handle form submission
  function sendMessage(event) {
    event.preventDefault();
    if (newMessage.trim()) {
      messages = [...messages, { content: newMessage, type: "sent", timestamp: new Date() }];
      newMessage = "";
    }
  }

  // Mock data (You might want to fetch this from a database in a real application)
  onMount(() => {
    messages = [
      { content: "Hello! How are you?", type: "received", timestamp: new Date("2023-06-07T10:00:00") },
      { content: "I'm good, thank you! How about you?", type: "sent", timestamp: new Date("2023-06-07T10:02:00") },
      { content: "I'm doing great! What are you up to?", type: "received", timestamp: new Date("2023-06-07T10:03:00") },
      { content: "Just working on some projects. How's everything with you?", type: "sent", timestamp: new Date("2023-06-07T10:05:00") },
      { content: "Same here. Just keeping busy with work.", type: "received", timestamp: new Date("2023-06-07T10:07:00") },
      { content: "Hey, are you free to catch up this weekend?", type: "received", timestamp: new Date("2023-06-12T11:00:00") },
      { content: "Yes, let's plan something!", type: "sent", timestamp: new Date("2023-06-12T11:05:00") }
    ];
  });
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
    <ChatContent {messages}/>
  </div>
  <div class="chat-footer d-flex align-items-center">
    <form class="input-container" on:submit={sendMessage}>
      <i class="bi bi-file-image text-primary ms-2 me-3"></i>
      <i class="bi bi-filetype-gif text-primary me-3"></i>
      <i class="bi bi-emoji-smile text-primary me-3"></i>
      <textarea bind:value={newMessage} class="form-control" placeholder="Start a new message"></textarea>
      <button type="submit" style="background: none; border: none; padding: 0;">
        <i class="bi bi-send text-primary ms-3"></i>
      </button>
    </form>
  </div>
</div>
