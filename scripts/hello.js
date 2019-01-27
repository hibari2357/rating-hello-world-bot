module.exports = (robot) => {
  robot.hear(/hello, world!/i, (res) => {
    var date = new Date();
    var hours = date.getUTCHours() + 9;
    var minutes = date.getMinutes();
    var perfomance = 4000*Math.exp(-(Math.max(5,hours)-5)/3);

    robot.brain.set("user1", 800);
    console.log(perfomance);
    var after = robot.brain.get("user1");
    console.log(after);
  })
}