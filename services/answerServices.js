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
    let answer = await answerModel.findOneAndUpdate({"_id": answerId}, {"$push": {"upvote": user}, "$pull": {"downvote": user}, "$inc": {votes: 1}});
    return answer;
  },
  downvote: async function(answerId, user) {
    let answer = await answerModel.findOneAndUpdate({"_id": answerId}, {"$pull": {"upvote": user}, "$push": {"downvote": user}, "$inc": {votes: -1}});
    return answer;
  }
};