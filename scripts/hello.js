module.exports = (robot) => {
  robot.hear(/hello/i, (res) => {
    console.log("heared hello");
    res.send("World!");
  })
}