const answerModel = require('../models/all-models').Answer;
const questionModel = require('../models/all-models').Question;

module.exports = {
  getAnswerByQuestion: async function(id) {
    let answers = await answerModel.find({"question": id}).populate('by');
    return answers;
  },
  upsert: async function(data) {
    let answer = await answerModel.findOneAndUpdate(data, data, {upsert:true, new:true});
    return answer;
  },
  create: async function(body, question, user) {
    let answer = new answerModel({body: body, question: question});
    if(user) {
      answer.by = user;
    }
    await answer.save();
    await questionModel.findOneAndUpdate({"_id": question}, {"$push": {answers: answer}});
    // answer = await answer.populate('by');
    return answer;
  },
  get: async function(data) {
    let answer = await answerModel.findOne(data);
    return answer;
  },
  upvote: async function(answerId, user) {
    let answer = await answerModel.findOne({"_id": answerId});
    if(answer.upvote.indexOf(user) === -1) {
      answer.upvote.push(user);
      answer.downvote.pull(user);
      answer.votes += 1;
      await answer.save();
    };
    return answer;
  },
  downvote: async function(answerId, user) {
    let answer = await answerModel.findOne({"_id": answerId});
    if(answer.downvote.indexOf(user) === -1) {
      answer.downvote.push(user);
      answer.upvote.pull(user);
      answer.votes -= 1;
      await answer.save();
    };
    return answer;
  }
};