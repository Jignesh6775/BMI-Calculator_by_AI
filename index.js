const express = require("express");
const port = process.env.port || 8090
const cors = require("cors")
const app = express();
require("dotenv").config();
app.use(express.json());
app.use(cors())
const { Configuration, OpenAIApi } = require("openai");


const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

app.get("/", (req, res)=>{
  try {
    res.status(200).send({ message: "Welcome to BMI by AI, please use POST method" })
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
})

app.post("/", async (req, res) => {
  try {
    const message = req.body.msg
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system", content: `
        Please provide your height and weight, and I'll calculate your BMI (Body Mass Index) score without showing the calculation. Additionally, based on your BMI score, I will classify you into one of the following categories: Underweight(Bahot Patla), Fit, Overweight(Mota), or Obese(Bahot zyada mota). If you are Overweight, I will suggest some home workout exercises. If you are Underweight, I will recommend a good diet plan to help you gain weight.

        Instructions:

        Enter your height (in meters) and weight (in kilograms) in the format "height, weight" (e.g., "1.75, 70").
        I will calculate your BMI score and classify you accordingly.
        If you are Obese, I will suggest some home workout exercises and say that Abe thoda kum khaya kar.
        If you are Overweight, I will suggest some home workout exercises.
        If you are Underweight, I will recommend a good diet plan to help you gain weight.
        Example Input: "1.75, 70"

        Example Output:

        BMI Score: 22.86
        Classification: Fit
        Suggestion: Keep up the good work!
   ` },
      { role: "user", content: `${message}` }],
      max_tokens: 100,
      temperature: 0,
    })
    res.status(200).send(response.data.choices[0].message.content)
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
})





// Start the server
app.listen(port, async () => {
  try {
    console.log(`Server is running on port ${port}`)
  } catch (error) {
    console.log(error.message)
  }
});

