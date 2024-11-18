const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const path = require('path'); 
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // For form data
app.use(bodyParser.json()); // For JSON data

// Serve static files (CSS, JS if needed later)
app.use(express.static('public'));

// Root route: Show form and handle submission
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI MCQ Generator</title>
        </head>
        <body>
            <h1>AI MCQ Generator</h1>
            <form action="/" method="POST">
                <label for="chapterName">Enter Chapter Name:</label><br>
                <input type="text" id="chapterName" name="chapterName" required><br><br>
                <button type="submit">Generate MCQs</button>
            </form>
        </body>
        </html>
    `);
});

app.post('/', async (req, res) => {
    const { chapterName } = req.body;

    // Validate input
    if (!chapterName) {
        return res.send('<h1>Error: Chapter name is required!</h1><a href="/">Go Back</a>');
    }

    // Simulate AI response
    const generatedMCQs = await simulateAIResponse(chapterName);

    // console.log(toString(generatedMCQs))

    // Render the MCQs as a simple list
    // const mcqList = generatedMCQs
    //     .map(
    //         (mcq, index) => `
    //     <li>
    //         <strong>Q${index + 1}:</strong> ${mcq.question}<br>
    //         <em>Options:</em> ${mcq.options.join(', ')}<br>
    //         <strong>Answer:</strong> ${mcq.answer}
    //     </li>
    // `
    //     )
    //     .join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Generated MCQs</title>
        </head>
        <body>
            <h1>MCQs for Chapter: ${chapterName}</h1>
            <ul>${generatedMCQs}</ul>
            <a href="/">Generate Again</a>
        </body>
        </html>
    `);
});

// Simulated AI response
async function simulateAIResponse(chapterName) {
    const MODEL_NAME = "gemini-1.5-pro-latest";
    const API_KEY = "AIzaSyBWRIWfnFxUvexQsZEe_Aba5ZDFO__T74w"; 

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 1,
        topK: 0,
        topP: 0.95,
        maxOutputTokens: 8192,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
    });
    // return Array.from({ length: 20 }, (_, i) => ({
    //     question: `Sample question ${i + 1} for ${chapterName}?`,
    //     options: ['Option A', 'Option B', 'Option C', 'Option D'],
    //     answer: 'Option A',
    // }));
    const result = await chat.sendMessage("Prepare 20 mcq from chapter" + chapterName)
    console.log(result.response.candidates[0].content.parts[0].text)
    let res = result.response.candidates[0].content.parts[0].text
    return res
}

async function generatePresentation(prompt) {
    const MODEL_NAME = "gemini-1.5-pro-latest";
    const API_KEY = "AIzaSyBWRIWfnFxUvexQsZEe_Aba5ZDFO__T74w"; 

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 1,
        topK: 0,
        topP: 0.95,
        maxOutputTokens: 8192,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
    });

    const result = await chat.sendMessage("prepare a powerpoint presentation on topic "+prompt+` with the actual content in it so that i can just copy and paste it.....output type : ## Routing in Computer Networks: Navigating the Information Superhighway

    **Slide 1: Title Slide**
    
    *   **Title:** Routing: The Backbone of Network Communication
    *   **Subtitle:** Understanding how information travels across networks
    *   **Your Name/Affiliation**
    *   **Date**
    
    **Slide 2: Introduction to Routing**
    
    *   **What is Routing?** The process of selecting paths in a network along which to send data packets.
    *   **Importance of Routing:** 
        *   Enables communication between devices in different networks.
        *   Forms the foundation of the internet and all interconnected networks.
        *   Impacts network performance, reliability, and security.
    
    **Slide 3: Key Routing Concepts**
    
    *   **Routers:** Specialized network devices that forward data packets based on routing information.
    *   **Routing Table:** A data table stored in routers that lists the available paths to different destinations.
    *   **Routing Protocols:** Standardized sets of rules that govern how routers share information and select paths.
    *   **Metrics:** Parameters used by routing protocols to determine the best path, such as hop count, bandwidth, and delay.
    
    **Slide 4: Types of Routing Protocols**
    
    *   **Interior Gateway Protocols (IGPs):** Used within a single autonomous system (AS), e.g., within an organization's network.
        *   Examples: RIP, OSPF, EIGRP
    *   **Exterior Gateway Protocols (EGPs):** Used for routing between different AS, e.g., between different organizations or ISPs.
        *   Example: BGP (Border Gateway Protocol)
    
    **Slide 5: Routing Algorithms**
    
    *   **Distance Vector Routing:** Routers share routing information with neighbors, calculating the best path based on distance or hop count.
    *   **Link State Routing:** Routers build a complete picture of the network topology and calculate the best path based on various metrics.
    
    **Slide 6: Routing Challenges and Considerations**
    
    *   **Scalability:** Managing routing efficiently in large and complex networks.
    *   **Security:** Protecting routing information from attacks and ensuring reliable communication.
    *   **Quality of Service (QoS):** Prioritizing certain types of traffic for better performance.
    *   **Convergence Time:** The time it takes for routers to update their routing tables and reach a consistent state after a network change.
    
    **Slide 7: Conclusion**
    
    *   Routing is fundamental to network communication and the functioning of the internet.
    *   Understanding routing concepts and protocols is essential for network design, management, and troubleshooting.
    *   Efficient routing enables reliable, secure, and high-performance network connectivity.
    
    **Additional Slides (Optional):**
    
    *   **Slide 8: Routing in the Real World:** Examples of routing applications in different network environments (enterprise, data center, service provider).
    *   **Slide 9: Future of Routing:** Emerging trends and technologies in routing, such as software-defined networking (SDN) and intent-based networking (IBN).
    *   **Slide 10: Q&A** 
    
    **Please note:** This is a basic outline. You may need to adapt and expand the content based on your specific audience and presentation goals. Remember to include relevant visuals like diagrams, network maps, and screenshots to enhance your presentation.`);
    const response = result.response;
    console.log(response.text());


    const presentationString = response.text();

  
    const slidesContent = presentationString.split("**Slide");


    slidesContent.shift();


    const slides = [];


    slidesContent.forEach((slide, index) => {
    
        const slideNumber = index + 1;

    
        const titleStartIndex = slide.indexOf(":") + 1;
        const titleEndIndex = slide.indexOf("\n");
        const title = slide.slice(titleStartIndex, titleEndIndex).trim();

    
        const contentStartIndex = titleEndIndex + 1;
        const content = slide.slice(contentStartIndex).trim();

        // Creating slide object
        const slideObj = {};
        slideObj[`Slide ${slideNumber}`] = { title, content };

        // Adding slide object to slides array
        slides.push(slideObj);
    });

    console.log(slides[1]['Slide 2'].content);

    return slides;
}



// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
