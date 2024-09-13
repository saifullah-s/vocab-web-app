// Ensure the browser supports the SpeechRecognition API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';  // Set language to English (US)
    recognition.continuous = true;  // Continue listening even after speech ends
    recognition.interimResults = true;  // Enable interim results for real-time transcription

    const startBtn = document.getElementById('start-btn');
    const actionDiv = document.getElementById('action');
    const imgDiv = document.getElementById('image');  // Div to hold the image
    const wakeWordDiv = document.getElementById('wake-word');  // Div to show wake word text
    const arabicTextDiv = document.getElementById('arabic-text');  // Div for the hidden Arabic text
    const beepSound = document.getElementById('beep-sound');  // Beep sound for alerting user

    let isBeepPlaying = false;  // Flag to indicate if beep is playing

    // Define the trigger words and their associated actions in a dictionary

    const triggerWords = {
        'phone': { arabicText: 'جَوَّالٌ جَوَّالَاتٌ', imageUrl: 'phone.jpg' },
        'sleep': { arabicText: 'نَامَ يَنَامُ نَوْمٌ', imageUrl: 'sleep.png' },
        'book': { arabicText: 'كِتَابٌ كُتُبٌ', imageUrl: 'book.png' },
        'car': { arabicText: 'سَيَّارَةٌ سَيَّارَاتٌ', imageUrl: 'car.jpg' },
        'computer': { arabicText: 'حَاسُوْبٌ', imageUrl: 'computer.png' },
        'return': { arabicText: 'رَجَعَ يَرْجِعُ', imageUrl: 'return.jpg' },
        'go': { arabicText: 'ذَهَبَ يَذْهَبُ', imageUrl: 'go.png' },
        'went': { arabicText: 'ذَهَبَ يَذْهَبُ', imageUrl: 'go.png' },
        'work': { arabicText: 'عَمَلٌ', imageUrl: 'work.jpg' },
        'eat': { arabicText: 'أَكَلَ يَأْكُلُ', imageUrl: 'eat.jpg' },
        'food': { arabicText: 'طَعَامٌ', imageUrl: 'food.jpg' },
        'clothes': { arabicText: 'مَلَابِسٌ', imageUrl: 'clothes.jpg' },
        'how': { arabicText: 'كَيْفَ', imageUrl: 'how.png' },
        'when': { arabicText: 'مَتَى', imageUrl: 'when.jpg' },
        'pray': { arabicText: 'صَلَّى يُصَلِّيْ', imageUrl: 'pray.jpg' },
        'bathroom': { arabicText: 'حَمَّامٌ', imageUrl: 'bathroom.jpg' },
        'bed': { arabicText: 'سَرِيْرٌ', imageUrl: 'bed.jpg' },
        'wake up': { arabicText: 'اِسْتَيْقَظَ يَسْتَيْقِظُ', imageUrl: 'wake_up.jpg' },
        'test': { arabicText: 'اِخْتِبَارٌ', imageUrl: 'exam.jpg' },
        'exam': { arabicText: 'اِخْتِبَارٌ', imageUrl: 'exam.jpg' },
        'kitchen': { arabicText: 'مَطْبَخٌ', imageUrl: 'kitchen.png' },
    };

    // Start listening when the button is clicked
    startBtn.addEventListener('click', () => {
        recognition.start();
        wakeWordDiv.textContent = '';  // Clear previous wake word text
        actionDiv.textContent = '';  // Clear previous actions
        imgDiv.innerHTML = '';  // Clear any previous images
        arabicTextDiv.style.display = 'none';  // Hide Arabic text
    });

    // Handle speech recognition result
    recognition.onresult = (event) => {
        let interimTranscription = '';  // Reset interim transcription
        let finalTranscription = '';    // Store final transcription

        // Loop through the results from SpeechRecognition
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript.trim().toLowerCase();

            // Process final transcription
            if (event.results[i].isFinal) {
                finalTranscription = transcript;  // Store the final transcription

                // Check for triggers in the final transcription
                checkForTriggers(finalTranscription);

            } else {
                // Process interim transcription
                interimTranscription = transcript;  // Reset interim transcription each time

                // Check for triggers in the interim transcription
                checkForTriggers(interimTranscription);
            }
        }
    };


    // Function to check if a transcript contains any trigger word
    const checkForTriggers = (transcript) => {
        for (const trigger in triggerWords) {
            if (transcript.includes(trigger)) {
                const { arabicText, imageUrl } = triggerWords[trigger];
                handleTrigger(trigger, arabicText, imageUrl);
                break;  // Once a trigger word is found, stop checking further
            }
        }
    };

    // Function to handle trigger and temporarily stop recognition to play beep

    const handleTrigger = (wakeWord, arabicText, imageUrl) => {

        displayWakeWordAndImage(wakeWord, arabicText, imageUrl);  // Display wake word and image

        recognition.stop();  // Stop speech recognition to avoid microphone interference

        playBeepAndResume();  // Play the beep and then resume speech recognition

    };

    // Function to display wake word text and image, and show Arabic text below

    const displayWakeWordAndImage = (wakeWord, arabicText, imageUrl) => {
        wakeWordDiv.textContent = wakeWord;  // Show wake word text below the image
        imgDiv.innerHTML = `<img src="${imageUrl}" alt="${wakeWord}">`;  // Show image
        arabicTextDiv.textContent = arabicText;  // Update Arabic text
        arabicTextDiv.style.display = 'block';  // Show Arabic text below, but user has to scroll
    };

    // Function to play beep sound and then resume recognition
    const playBeepAndResume = () => {
        const beepAudio = new Audio('beep.mp3');
        isBeepPlaying = true;  // Set flag to true to prevent recognition restart
        beepAudio.play();
        beepAudio.onended = () => {
            isBeepPlaying = false;  // Reset flag when beep finishes
            recognition.start();  // Resume speech recognition after beep plays
        };
    };

    // Handle errors or end of speech recognition
    recognition.onerror = (event) => {
        actionDiv.textContent = 'Error occurred: ' + event.error;
    };

    // Restart recognition automatically if it stops, unless beep is playing
    recognition.onend = () => {
        if (!isBeepPlaying) {
            recognition.start();  // Automatically restart recognition if beep is not playing
        }
    };

} else {
    alert('Sorry, your browser does not support speech recognition.');
}
