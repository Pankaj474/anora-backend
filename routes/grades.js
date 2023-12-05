const {Router} = require("express");
const Answers = require("../models/Answers");
const Question = require('../models/Questions')
const router = Router();

router.get("/get/:currency_id", async (req, res) => {
    const {
        currency_id
    } = req.params;
    console.log(currency_id)
    let questions =await Question.find().exec();
    let response
    if(questions && questions.length){
        const answersData = await Answers.findOne({currency_id})
        if(!answersData){
            response = questions.map(el => {
                return {_id: el._id, question: el.question, category: el.category, answer: ""}
            })     
        }
        else{
            response = questions.map(el =>{
                const answerOfQuestion = answersData.answers.filter(answer => answer.question_id == el._id)
                if(answerOfQuestion.length){ 
                    return {_id: el._id, question: el.question, category: el.category, answer: answerOfQuestion[0].answer}
                }else{
                    return {_id: el._id, question: el.question, category: el.category, answer: ""}
                }
            })
        }
    }
    res.send(response);
});

router.post("/post/:currency_id", async (req, res) => {
    const {
        currency_id
    } = req.params;
    let answers = [...req.body.answers]
    let answersData = await Answers.findOne({currency_id: currency_id})
    if(answersData){
        answersData.answers = answersData.answers.map(el => {
            const toUpdate = answers.filter(answer => answer.question_id == el.question_id)
            console.log(toUpdate)
            if(toUpdate.length){
                el.answer = toUpdate[0].answer
                answers = answers.filter(answer => answer.question_id != el.que)
                return el
            }
            return el
        })
        answersData.answers = [...answersData.answers, ...answers]
    }else{
        answersData = new Answers()
        answersData.currency_id = currency_id
        answersData.answers = answers
    }
    await answersData.save()
    res.send('Data Inserted');
});

module.exports = router;