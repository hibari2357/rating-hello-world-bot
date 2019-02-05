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
    var icons = [":mojave_dynamic_2:", ":mojave_dynamic_3:", ":mojave_dynamic_6:", ":mojave_dynamic_7:", ":mojave_dynamic_9:", ":mojave_dynamic_11:", ":mojave_dynamic_15:"];

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

    var icon = icons[0];
    if(hours>=4 && hours<7) icon = icons[0];
    else if(hours>=7 && hours<10) icon = icons[1];
    else if(hours>=10 && hours<12) icon = icons[2];
    else if(hours>=12 && hours<14) icon = icons[3];
    else if(hours>=14 && hours<16) icon = icons[4];
    else if(hours>=16 && hours<19) icon = icons[5];
    else icon = icons[6];

    var payload = {
      username: "Hello Mojave",
      text:`@${username} Perf:${Math.round(performance)} Rating:${Math.round(newRating)} ${comment} ${color}`,
      as_user: false,
      icon_emoji: `${icon}`
    }

    res.send(payload);
    robot.brain.set(username, JSON.stringify(userobj));
  })
}