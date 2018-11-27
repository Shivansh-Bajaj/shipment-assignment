const questionModel = require('../models/all-models').Question;
const tagModel = require('../models/all-models').Tag;
const _ = require('lodash');
module.exports = {
  upsert: async function(data) {
    let question = await questionModel.findOneAndUpdate(data, data, {upsert:true, new:true});
    return question;
  },
  update: async function(data, update) {
    let question = await questionModel.findOneAndUpdate(data, update, {new:true});
    return question;
  },
  create: async function(title, body, tags, user) {
    let tagsId = [];
    let question = new questionModel({
      title: title,
      body: body
    });
    if(user) {
      question.by = user.id;
    }
    if (tags) {
      for (let i in tags) {
        let tag = await tagModel.findOneAndUpdate(tags[i], tags[i], {upsert:true, new:true});
        question.tags.push(tag._id);
      }
    }
    await question.save();
    user.questions.push(question._id);
    await user.save();
    return question;
  },
  getOne: async function(data) {
    let question = await questionModel.findOne(data).populate('by tags answers');
    return question;
  },
  get: async function(data) {
    let question = await questionModel.find(data).populate('by tags');
    return question;
  }
  // addAnswer: async function(answer, question) {
    
  // }
};