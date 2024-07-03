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
</style>


<div id="content-column" class="col-md-8 border-right d-flex flex-column p-3">
  <div class="d-flex align-items-center mb-3">
    <img src="/user-img.png" alt="" class="rounded-circle" style="width: 40px; height: 40px;">
    <span class="username ms-2" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 700; font-size: 17px; line-height: 20px; color: #e7e9ea;">{currentChatUser.username}</span>
  </div>
  <div class="chat-body flex-grow-1 mb-3" style="overflow-y: auto;">
    <!-- This space will be filled with chat messages -->
  </div>
  <div class="chat-footer d-flex align-items-center" style="border-top: 1px solid #555;">
    <div class="flex-grow-1 d-flex align-items-center justify-content-center p-2 mt-2" style="background-color: #202327; border-radius: 30px;">
      <i class="bi bi-file-image text-primary ms-2 me-3"></i>
      <i class="bi bi-filetype-gif text-primary me-3"></i>
      <i class="bi bi-emoji-smile text-primary me-3"></i>
      <textarea class="form-control bg-transparent border-0 flex-grow-1" placeholder="Start a new message" style="color: #e7e9ea; box-shadow: none; resize: none; height: 40px;"></textarea>
      <i class="bi bi-send text-primary ms-3"></i>
    </div>
  </div>
</div>
