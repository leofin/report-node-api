require("./setup_mongo.js")

User = require("./models/user.js")
Step = require("./models/step.js")
Flow = require("./models/flow.js")
Activity = require("./models/activity.js")
FlowStatistics = require("./models/flow_statistics.js")
UserHistory = require("./models/user_history.js")

let step_hash = {};
let revert_steps = {};
let flow_hash = {};
let flows = [];
let init = 0;
let size = 1000;

let incrementFlowStatistics = (statistics, status) => {
  let column = "count_activities_"+status+"ed"
  FlowStatistics.update({flow: statistics.flow}, {$inc: {column: 1}}, log_id_error);
}

let incrementStepStatistics = (id, statistics, status) => {
  let column = "count_activities_"+status+"ed"
  FlowStatistics.update({flow: id, 'steps._id': statistics.id}, {$inc: {column: 1}}, log_id_error);
}

let log_id_error = (err, args) => {
  if(err){
    console.log(err)
  }else {
    console.log(args)
  }
}

let populateUserHistoryByUser = () => {
  let usersHistories = [];
  User.find({}, (err, users) => {
    users.forEach((user) => {
      let userHistory = new UserHistory({name: user.name, user: user.id, email: user.email, alias: user.alias});
      usersHistories.push(userHistory); 
    });
    UserHistory.create(usersHistories, (t) => console.log("saved data " + t) );
  });
}

let populateUserHistoryByActivity = (activity, flow_id, step_id, type) => {

  let status = activity.status;
  let occured = activity.occured;
  let column;
  let newActivity;
  let user_id = activity.user;

  if(flow_id == 0) {
    return ;
  }

  UserHistory.findOneAndUpdate(
    {user: user_id},
    {"$addToSet": {'flows': {flow: flow_id} } },
    {upsert: true}).exec( (err, userHistory)=> {
      if(err){
        console.log(err)
      }else{
        console.log(userHistory)
      }


      if(type = "step"){
        newActivity = {step: step_id, occured: occured};
        column = "flows.$.step_activities_" + status + "ed";
      }else{
        newActivity = {occured: occured};
        column = "flows.$.activities_" + status + "ed";
      }
   
      console.log(newActivity);
      console.log(column);

      let pushObject =  {};
      pushObject[column] = newActivity;

      UserHistory.findOneAndUpdate(
        {user: user_id, 'flows.flow': flow_id},
        {"$push": pushObject},
        {upsert: true}
      ).exec((err, arg) => {
        if(err){
          console.log(err);
        }else{
          console.log(arg);
        }
      });
    });
}

//Metodo só para popular as UsersHistories, porém também é populado no populateReports
let populateUsersHistories = function(size, offset) { 
  Activity.find({}).limit(size).skip(offset).exec((err, regActivities) => {
    regActivities.forEach((activity) => {
      let step_id;
      let flow_id;
      let type = activity.type;
      let query;


      if(type == "step"){
        step_id = String(activity.step);
        flow_id = String(step_hash[step_id].flow);
        query = {flow: String(flow_id), 'steps.step': String(step_id)};
      }else{
        flow_id = activity.flow;
        query = {flow: flow_id};
      }

      populateUserHistoryByActivity(activity, flow_id, step_id, type);
    });
  });
}


let populateReports = function(size, offset) { 
  Activity.find({}).limit(size).skip(offset).exec((err, regActivities) => {
    regActivities.forEach((activity) => {
      let step_id;
      let flow_id;
      let type = activity.type;
      let query;


      if(type == "step"){
        step_id = String(activity.step);
        flow_id = String(step_hash[step_id].flow);
        query = {flow: String(flow_id), 'steps.step': String(step_id)};
      }else{
        flow_id = activity.flow;
        query = {flow: flow_id};
      }

      populateUserHistoryByActivity(activity, flow_id, step_id, type);
      console.log(query)

      FlowStatistics.findOne(query).exec((err, flow_statistics) => {

        if(flow_statistics){
          console.log("não existe flowStatistics para query")
          return;
        }

        if (type == "step"){
          let step = flow_statistics.steps.filter((step) => {return step.step == step_id;})[0]
          if(step){
            incrementStepStatistics(flow_statistics.flow, step, activity.status)
          }else{
            console.log("Parece não existir: " + step_id + "|" + step)
          }
        } else {
          incrementFlowStatistics(flow_statistics, activity.status);
        }

        flow_statistics.save((err, args) => {
          if(err) {
            console.log(err);
          }
        });      
      });
    });
  });
}

let populateFlowStatistics = (revert_steps, flow_hash) => {
  Object.keys(revert_steps).forEach( (flow_key) => {
    let stepDatas = revert_steps[flow_key];
    let flowId = String(flow_key);
    let flowTitle = flow_hash[flowId].title;

    let flowStatistics = new FlowStatistics({title: flowTitle, flow: flowId});

    stepDatas.forEach((stepData) => {
      flowStatistics.steps.push({title: stepData.title, step: String(stepData.step)});
    })
    
    flows.push(flowStatistics);
  });
  FlowStatistics.create(flows, (t) => {
    console.log("saved data" + t);
    console.log("starting migrate...");
    processInBatch(size, init);
  });
}

let populateFlowHash = function(hash) {
  Flow.find({}, (err, regs) => {
    regs.forEach((item) => {
      hash[item.id] = {title: item.title};
    })
  });
  populateFlowStatistics(revert_steps, flow_hash);
}

let agrupateStepIdByFlow = function(hash, revert_hash) {
  Object.keys(hash).forEach( (item) => {
    let flow_id = hash[item].flow;
    if(!revert_hash[flow_id]) {
      revert_hash[flow_id] = [];
    }
    revert_hash[flow_id].push({step: item, title: hash[item].title});
  });
  populateFlowHash(flow_hash);
}

let populateStepHash = function(hash, revert_steps) {
  Step.find({}, (err, regs) => {
    regs.forEach((item) => {
      hash[item.id] = {flow: item.flow, title: item.title};
    })
  });
  agrupateStepIdByFlow(hash, revert_steps);
}

let processInBatch = (size, init) => {
  let init_c = init;
  let init_time = 2000;
  if(init_c >= 3585577) {
    console.log("finished");
    return ;
  }
  
  populateReports(size,init_c);

  setTimeout(function() {
    init_c += size;
    console.log("init_c:" + init_c);
    processInBatch(size, init_c) 
  }, init_time);
  
}

//Metodo para popular só as UsersHistories em batch, porém já é populado no metodo anterior junto com o FlowStatistics
let processInBatch2 = (size, init, limit) => {
  let init_c = init;
  let init_time = 2000;
  if(init_c >= limit) {
    console.log("finished");
    return ;
  }
  
  populateUsersHistories(size,init_c);

  setTimeout(function() {
    init_c += size;
    console.log("init_c:" + init_c);
    processInBatch2(size, init_c, limit) 
  }, init_time);
  
}

let migrateBD = (step_hash, revert_steps) => {
  populateStepHash(step_hash, revert_steps);
}

populateUserHistoryByUser();
migrateBD(step_hash, revert_steps);
