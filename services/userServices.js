const userModel = require('../models/all-models').User;
const questionModel = require('../models/all-models').Question;

module.exports = {
  getById: async function(id) {
    let user = await userModel.findOne({"_id": id}).populate('questions favQuestions');
    return user;
  },
  upsert: async function(data) {
    let answer = await answerModel.findOneAndUpdate(data, data, {upsert:true, new:true});
    return answer;
  },
  addFav: async function(question, user) {
    user.favQuestions.push(question);
    await user.save();
    return user;
  },
  remFav: async function(question, user) {
    user.favQuestions.pull(question);
    await user.save();
    return user;
  }
}