async function captureAndSolve() {
  const fileInput = document.getElementById('file-input');
  
  // Check if file input is supported
  if (!fileInput || !fileInput.capture) {
    alert('File capture is not supported on this device.');
    return;
  }

  try {
    const blob = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      fileInput.onchange = () => {
        if (fileInput.files.length > 0) {
          reader.readAsDataURL(fileInput.files[0]);
        }
      };
    });

    // Send the image blob to your backend for AI text recognition and equation solving
    // Example: Send the blob using fetch API
    const response = await fetch('your-backend-endpoint', {
      method: 'POST',
      body: blob,
      headers: {
        'Content-Type': 'image/*' // Adjust content type based on your backend requirements
      }
    });

    const result = await response.json();

    // Display the solution obtained from AI text recognition and equation solving
    const solutionContainer = document.getElementById('solution-container');
    solutionContainer.innerHTML = `
      <div>
        <h2>Solution:</h2>
        <p>${result.equation} can be solved using...</p>
        <p>Step 1: Apply theorem X</p>
        <p>Step 2: Use rule Y</p>
        <p>Step 3: Apply theorem Z</p>
        <p>Final solution: ${result.solution}</p>
      </div>
    `;
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while processing the image.');
  }
}
