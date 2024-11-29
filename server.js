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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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
    <style>
        * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to bottom right, #111E25 0%, #111 100%);
  font-family: 'Lato', sans-serif;
}

body {
  background-color: #111E25;
  color:"#fff";
}

input, 
button {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -300%);
  display: block;
  width: 70vw;
  opacity: 0;
  pointer-events: none;
  transition: all .5s cubic-bezier(.4, .25, .8, .3);
}

input {
  padding: .25rem 0;
  border: 0;
  border-bottom: 1px solid #bb1515;
  outline: 0;
  background: transparent;
  color: #fff;
  font-size: 3rem;
  line-height: 4rem;
  letter-spacing: .125rem;
  transition: all .5s cubic-bezier(.4, .25, .8, .3);
}

input::selection {
  background: rgba(187, 21, 21, 0.25);
}

button,
.signup-button {
  padding: .25em 0;
  border: 0;
  outline: 0;
  background: #bb1515;
  color: rgba(#fff, 0.85);
  font-size: 2rem;
  line-height: 3.6rem;
  letter-spacing: .0625rem;
  box-shadow: 0 3px 5px 1px rgba(#000, 0.25);
  text-shadow: 0 -2px 0 rgba(#000, 0.25), 0 1px 0 rgba(#fff, 0.2);
}

input:focus,
button:focus {
  opacity: 1;
  transform: translate(-50%, -100%);
  pointer-events: auto;
  transition: all .4s cubic-bezier(.1, .45, .1, .85) .5s;
  z-index: 10;
}

input:focus ~ input,
input:focus ~ button {
  transform: translate(-50%, 500%);
  transition: all .5s ease-in;
}

input:focus ~ label .label-text {
  transform: translate(-50%, 300%);
  transition: all .5s ease-in;
}

input:focus ~ .tip {
  opacity: 1;
}

input:focus ~ .signup-button,
button:focus ~ .signup-button {
  opacity: 0;
}

input:focus + label .label-text {
  opacity: 1;
  transform: translate(-50%, -100%);
  transition: all .3s cubic-bezier(.1, .45, .1, .85) .4s;
}

input:focus + label .nav-dot:before {
  background: darken(#bb1515, 5%);
  box-shadow: 0 0 0 .15rem #111, 0 0 .05rem .26rem #bb1515;
}

.tip {
  position: fixed;
  top: 57%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  opacity: 0;
  color: #fff;
  font-size: .875rem;
  font-weight: 300;
  letter-spacing: .125rem;
  text-transform: uppercase;
  text-align: right;
  transition: opacity .25s .5s;
}

.signup-button,
.signup-button-trigger {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -100%);
  width: 70vw;
  padding: .25rem 0;
  line-height: 3.6rem;
  text-align: center;
  pointer-events: none;
  cursor: pointer;
  transition: opacity .4s .3s;
  color:"#fff";
}

.signup-button-trigger {
  opacity: 0;
  pointer-events: auto;
  color:#ffffff;
  cursor:pointer
}

.label-text {
  position: fixed;
  top: calc(50% - 4rem);
  left: 50%;
  transform: translate(-50%, -300%);
  width: 70vw;
  padding: 3.125rem 0 1.5rem;
  text-transform: uppercase;
  color: #fff;
  opacity: 0;
  font-size: 1.125rem;
  font-weight: 300;
  letter-spacing: .125rem;
  pointer-events: none;
  transition: all .4s cubic-bezier(.4, .25, .8, .3) .05s;
}

.nav-dot {
  cursor: pointer;
  position: fixed;
  padding: .625rem 1.25rem .625rem .625rem;  
  top: 52%;
  right: 1.25rem;
}

.nav-dot:before {
  content: '';  
  display: inline-block;  
  border-radius: 50%;
  width: .375rem;
  height: .375rem;
  margin-right: .625rem;  
  position: fixed;
  background-color: lighten(#111E25, 3%);
  border: 0;
  transition: all 0.25s;
}

.nav-dot:hover:before {
  width: .625rem;
  height: .625rem;
  margin-top: -.125rem;
  margin-left: -.125rem;
  background-color: darken(#bb1515, 5%);
}

label[for="input-1"] .nav-dot {
  margin-top: -125px;
}

label[for="input-2"] .nav-dot {
  margin-top: -100px;
}

label[for="input-3"] .nav-dot {
  margin-top: -75px;
}

label[for="input-4"] .nav-dot {
  margin-top: -50px;
}

label[for="input-5"] .nav-dot {
  margin-top: -25px;
}

form {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

    </style>
</head>
<body>
    <form action="/" method="POST">
  <input id="input-1" type="text" placeholder="Topic name" name="chapterName" required autofocus />
  <label for="input-1">
    <span class="label-text">" AI MCQs Generator " </span>
    <span class="nav-dot"></span>
    <div class="signup-button-trigger">Generate Your MCQs</div>
  </label>


  <button type="submit">Generate Your MCQs</button>
  <p class="tip">Press Tab</p>
  <div class="signup-button">Generate Your MCQs</div>

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
    let generatedMCQs = await simulateAIResponse(chapterName);
    // generatedMCQs = generatedMCQs.replace(/\n/g, "<br>");



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
    console.log((generatedMCQs.a[0]))
    res.render('index', { generatedMCQ:generatedMCQs});
    
});

// Simulated AI response
async function simulateAIResponse(chapterName) {
    const MODEL_NAME = "gemini-1.5-pro-latest";
    // const API_KEY = "AIzaSyBWRIWfnFxUvexQsZEe_Aba5ZDFO__T74w";
    // const API_KEY = "AIzaSyB3MgtWjE9Wn_wLXxC5jzcJ34ZvVZ7eCm0" 
    // const API_KEY ="AIzaSyC9_-DC6m3oXM2fYtrpIWuX79r9P9pMtmM"
    const API_KEY ="AIzaSyCCbwcBC5YvBqB0hi45zbBgsIlp3CQ2f0g"

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
    const result = await chat.sendMessage("Prepare 20 mcq from chapter ," + chapterName + "with answer key at last . Each question should have 4 answer choices, and the correct answer should be clearly marked At the end, provide an answer key with the correct option for each question so that i can just copy and paste it. Format it as follows:" +  `
1. Which of the following is a common property of acids?
(a) They taste bitter.
(b) They feel slippery.
(c) They turn litmus paper blue.
(d) They react with metals to produce hydrogen gas.

2. Which of the following is a strong acid?
(a) Acetic acid
(b) Hydrochloric acid
(c) Citric acid
(d) Carbonic acid

3. What is the pH of a neutral solution?
(a) 0
(b) 7
(c) 14
(d) 10

4. Which of the following is a weak acid?
(a) Sulfuric acid
(b) Nitric acid
(c) Formic acid
(d) Hydrochloric acid

5. What is the chemical formula for hydrochloric acid?
(a) HCl
(b) H2SO4
(c) HNO3
(d) CH3COOH

6. Which of the following is a diprotic acid?
(a) HCl
(b) H2SO4
(c) HNO3
(d) CH3COOH

7. What is the name of the ion formed when an acid dissolves in water?
(a) Hydroxide ion
(b) Hydronium ion
(c) Oxide ion
(d) Chloride ion

8. Which of the following is a base?
(a) HCl
(b) NaOH
(c) H2O
(d) CO2

9. What is the pH of a solution with a hydronium ion concentration of 1 x 10^-4 M?
(a) 4
(b) -4
(c) 10
(d) -10

10. What is the conjugate base of HCl?
(a) Cl-
(b) H2O
(c) OH-
(d) H3O+

11. Which of the following is a triprotic acid?
(a) H3PO4
(b) H2SO4
(c) HNO3
(d) CH3COOH

12. What happens to the pH of a solution when an acid is added?
(a) It increases.
(b) It decreases.
(c) It stays the same.
(d) It depends on the acid.

13. A solution with a pH of 2 is considered:
(a) Strongly acidic
(b) Weakly acidic
(c) Neutral
(d) Basic

14. What is the chemical formula for sulfuric acid?
(a) HNO3
(b) H2SO4
(c) HCl
(d) H3PO4


15. Acids react with carbonates to produce:
(a) Hydrogen gas
(b) Carbon dioxide gas
(c) Oxygen gas
(d) Nitrogen gas

16. A proton donor is another term for a(n):
(a) Acid
(b) Base
(c) Salt
(d) Oxide

17. The reaction between an acid and a base is called:
(a) Neutralization
(b) Oxidation
(c) Reduction
(d) Decomposition


18. Which acid is found in vinegar?
(a) Acetic acid
(b) Citric acid
(c) Lactic acid
(d) Tartaric acid

19. What is the concentration of hydronium ions in pure water at 25°C?
(a) 1.0 x 10^-7 M
(b) 1.0 x 10^-14 M
(c) 1.0 x 10^0 M
(d) 1.0 x 10^7 M

20. Which of the following is NOT a characteristic of a strong acid?
(a) Completely ionizes in water.
(b) Has a low pH.
(c) Reacts slowly with metals.
(d) Conducts electricity well.


**Answer Key:**

1. d
2. b
3. b
4. c
5. a
6. b
7. b
8. b
9. a
10. a
11. a
12. b
13. a
14. b
15. b
16. a
17. a
18. a
19. a
20. c
        `)
    console.log(result.response.candidates[0].content.parts[0].text)
    let res = result.response.candidates[0].content.parts[0].text
    const parseQuestions = (input) => {
        const lines = input.trim().split('\n');
        let questions = [];
        let i = 0;
    
        while (i < lines.length) {
            const line = lines[i].trim();
            const questionMatch = line.match(/^(\d+)[.:]\s(.+)/); // Match questions with . or :
            if (questionMatch) {
                const question = {
                    questionNumber: parseInt(questionMatch[1]),
                    question: questionMatch[2],
                    options: []
                };
    
                // Fetch the next 4 lines as options
                for (let j = 1; j <= 4 && i + j < lines.length; j++) {
                    const optionLine = lines[i + j].trim();
                    const optionMatch = optionLine.match(/^\(([a-d])\)\s(.+)/);
                    if (optionMatch) {
                        question.options.push({
                            option: optionMatch[1],
                            text: optionMatch[2].trim()
                        });
                    }
                }
                questions.push(question);
                i += 5; // Skip the question and its 4 options
            } else {
                i++; // Move to the next line if no question is found
            }
        }
        questions = questions.slice(0, questions.length - 4); // Removes the last 4 records

        return questions;
    };

    const parseAnswerKey = (input) => {
        const lines = input.trim().split('\n');
        let answers = [];
        let inAnswerMode = true;
    
        lines.forEach(line => {
            line = line.trim();
    
            // Check if "Answer Key" or "Answer" is encountered
            if (/^Answer Key[:]?/i.test(line) || /^Answer[:]?/i.test(line)) {
                inAnswerMode = true;
                return; // Move to the next line
            }
    
            if (true) {
                const answerMatch = line.match(/(\d+)[.:]\s*[a-d]/gi); // Find patterns like 1. c or 2: a
                if (answerMatch) {
                    answerMatch.forEach(answer => {
                        const [questionNumber, correctOption] = answer.match(/\d+|[a-d]/gi);
                        answers.push({
                            questionNumber: parseInt(questionNumber),
                            correctOption: correctOption
                        });
                    });
                }
            }
        });

        answers = answers.filter(item => item.correctOption !== 'A');
    
        return answers;
    };
    
    
    const parsedQuestions = parseQuestions(res);
    // console.log(parsedQuestions);
    const parsedAnswers = parseAnswerKey(res);
    console.log("hahahaha")
    // console.log(parsedAnswers)

// Output JSON
// console.log(JSON.stringify(parsedQuestions, null, 2));
    // console.log(typeof(parsedQuestions))
    return {"q":parsedQuestions , "a":parsedAnswers}
    // return res
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
