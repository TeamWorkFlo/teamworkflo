
function Task(json) {
   this.id = json[id];
   this.assignee = json[assignee];
   this.component = json[component];
   this.feature = json[feature];
   this.name = json[name];
   this.description = json[description];
   this.milestone = json[milestone];
   this.importance = json[importance];
   this.startDate = json[startDate];
   this.completionDate = json[completionDate];
   this.status = json[status];
   this.estimatedTime = json[estimatedTime];
}