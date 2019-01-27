module.exports = (robot) => {
  robot.hear(/hello, world!/i, (res) => {
    var date = new Date();
    var hours = (date.getUTCHours() + 9)%24;
    var minutes = date.getMinutes();
    var performance = 4000*Math.exp(-(Math.max(5,hours+minutes/60)-5)/3);
    var username = res.envelope.user.name;
    var data = robot.brain.get(username);

    // if(!data){
      var newuser = {
        name:username,
        history:[{
          date:date,
          performance:performance,
          newRating:(performance*0.9 + 800*0.9*0.9)/(0.9 + 0.9*0.9)
        }]
      };
      robot.brain.set(username, JSON.stringify(newuser));
      data = JSON.stringify(newuser);
    // }

    // console.log(data);


    // robot.brain.set("user1", 800);
    // var after = robot.brain.get("user1");
    // console.log(after);
  })
}