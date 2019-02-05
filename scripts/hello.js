module.exports = (robot) => {
  robot.hear(/hello, world/i, (res) => {
    var date = new Date();
    var hours = (date.getUTCHours() + 9)%24;
    var minutes = date.getMinutes();
    var performance = 4000*Math.exp(-(Math.max(5,hours+minutes/60)-5)/3);
    var username = res.envelope.user.name;
    var newRating = (performance*0.9 + 800*0.9*0.9)/(0.9 + 0.9*0.9);
    var userobj = {
      name:username,
      history:[{
        date:date,
        performance:performance,
        newRating: newRating
      }]
    };
    var comment = "";
    var color = "#000000";
    var colors = ["#808080","#804000" ,"#008000" ,"#00C0C0" ,"#0000FF", "#C0C000", "#FF8000", "#FF0000"];

    var user = robot.brain.get(username);
    if(user){
      userobj = JSON.parse(user);
      var history = userobj.history;
      var times = history.length;
      var A = performance*0.9 + 800*Math.pow(0.9, times+2);
      var B = 0.9 + Math.pow(0.9, times+2);
      for(var i=0; i<times; i++){
        A += history[times-1-i].performance * Math.pow(0.9, i+2);
        B += Math.pow(0.9, i+2);
      }
      newRating = A/B;
      var highest = true;
      for(var i=0; i<times; i++){
        if(history[i].newRating > newRating) highest = false;
      }

      history.push({
        date:date,
        performance:performance,
        newRating:newRating
      });
      var currentRating = history[times-1].newRating;
      comment = "(";
      if(newRating - currentRating >= 0) comment += "+";
      comment += `${Math.round(newRating - currentRating)}`;
      if(highest) comment += ", highest!";
      comment += ")";
    }

    var color_index = Math.floor(Math.round(newRating)/400);
    if(color_index > 7) color_index = 7;
    color = colors[color_index];

    res.send(`@${username} performance:${Math.round(performance)} rating:${Math.round(newRating)} ${comment} ${color}`);
    robot.brain.set(username, JSON.stringify(userobj));
  })
}