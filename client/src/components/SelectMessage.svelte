<script>
    export let toggleMessageModal;
</script>

<div id="content-column" class="col-md-8 border-right d-flex flex-column align-items-center justify-content-center">
    <div class="p-3 text-center">
        <h3 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 800; font-size: 31px; line-height: 36px; color: #e7e9ea;">
            Select a message
        </h3>
        <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 400; font-size: 15px; line-height: 20px; color: #71767b;">
            Choose from your existing conversations, or start a new one.
        </p>
        <button class="btn p-3" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 700; font-size: 17px; line-height: 20px; color: #ffffff; background-color: #1d9bf0; border-radius: 50px;" on:click={toggleMessageModal}>
            New message
        </button>
    </div>
</div>

<style>
    .border-right {
        border-right: 1px solid #2f3336;
    }
</style>
