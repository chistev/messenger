<script>
    import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';

    let username = '';
    let csrfToken = ''; 
    let errorMessage = '';
    let successMessage = '';
    let formDisabled = true;
    let userExists = false;

    const dispatcher = createEventDispatcher();

    const checkUserStatus = async () => {
        try {
            const response = await fetch('/api/check-new-user');
            if (response.status === 401) {
                window.location.href = '/signin'; 
                return;
            }
            const data = await response.json();
            userExists = data.exists;
            if (userExists) {
                window.location.href = '/messages'; 
                return;
            } else {
                errorMessage = '';
                successMessage = '';
                formDisabled = false;
            }
        } catch (error) {
            console.error('Error checking user status:', error);
        }
    };

    onMount(checkUserStatus); 

    const checkUsernameAvailability = async (username) => {
        try {
            const response = await fetch(`/check-username?username=${username}`);
            const data = await response.json();
            if (data.available) {
                successMessage = 'Username available!';
                errorMessage = '';
                formDisabled = false;
            } else {
                errorMessage = 'This username is already taken.';
                successMessage = '';
                formDisabled = true;
            }
        } catch (error) {
            console.error('Error checking username availability:', error);
        }
    };

    const validateUsername = (username) => {
        let error = '';

        if (username.includes(' ')) {
            error += 'Your username cannot contain spaces. ';
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            error += 'Your username can only contain letters, numbers, and \'_\'. ';
        }

        if (/^\d+$/.test(username)) {
            error += 'Include a non-number character. ';
        }

        if (username.length < 5) {
            error += 'Your username must be at least 5 characters long. ';
        }

        return error;
    };

    const handleInput = async () => {
        const error = validateUsername(username);
        if (error) {
            errorMessage = error;
            successMessage = '';
            formDisabled = true;
        } else {
            errorMessage = '';
            await checkUsernameAvailability(username);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`/select-username`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            });

            const data = await response.json();
            if (data.error) {
                errorMessage = data.error;
                successMessage = '';
                formDisabled = true;
            } else {
                window.location.href = '/messages';
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
</script>

<style>
    body {
        background-color: #000000;
        color: #ffffff;
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
    }

    .card {
        background-color: #1f1f1f;
        padding: 20px;
        border-radius: 10px;
        width: 400px;
    }

    h2 {
        color: #ffffff;
        font-size: 24px;
        margin-bottom: 10px;
    }

    h3 {
        color: #ffffff;
        font-size: 18px;
        margin-bottom: 20px;
    }

    .form-group {
        position: relative;
        margin: 0 auto;
        width: 100%;
    }

    .form-group input {
        background-color: #333333;
        border: none;
        border-radius: 5px;
        color: #ffffff;
        font-size: 16px;
        padding: 10px 15px;
        width: calc(100% - 30px);
        margin-left: 30px;
    }

    .error-message {
        color: red;
        font-size: 12px;
        margin-top: 5px;
    }

    .available-message {
        color: green;
        font-size: 12px;
        margin-top: 5px;
    }

    .submit-button {
        background-color: #4CAF50;
        border: none;
        border-radius: 5px;
        color: #ffffff;
        cursor: pointer;
        font-size: 16px;
        padding: 10px 20px;
        margin-top: 20px;
    }

    .submit-button:disabled {
        background-color: #888888;
        cursor: not-allowed;
    }

    .submit-button[disabled] {
        opacity: 0.6; 
    }
</style>

<body class="d-flex flex-column align-items-center justify-content-center">
    <div class="card mt-5">
        <h2>What should we call you?</h2>
        <h3 class="mb-4">Your @username is unique. You can't change it later.</h3>
        <form id="username-form" on:submit={handleSubmit}>
            <input type="hidden" name="_csrf" value={csrfToken}>
            <div class="form-group position-relative mx-auto">
                <span style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: white;">@</span>
                <input type="text" id="username" name="username" bind:value={username} placeholder="Username" on:input={handleInput} required>
            </div>
            {#if errorMessage}
            <div class="error-message">{errorMessage}</div>
            {/if}
            {#if successMessage}
            <div class="available-message">{successMessage}</div>
            {/if}
            <button class="submit-button mt-5" class:enabled={!formDisabled} type="submit" disabled={formDisabled}>Next</button>
        </form>
    </div>
</body>
