
function Activity(json) {
  this.actor = json[actor];
  this.source = json[source];
  this.timestamp = json[timestamp];
  this.taskId = json[taskId];
}