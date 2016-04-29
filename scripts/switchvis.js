function switchSecondary(){
    //var currText = "This is now vis1";
    //alert("You clicked a thing in the secondary vis!");
    //needs to switch rendering between vis 1 and vis 2
    var vis2Body = $("#vis2-body").html();
    var vis1Body = $("#vis1-body").html();
    
    $("#vis2-body").html(vis1Body);
    $("#vis1-body").html(vis2Body);
}

function switchTertiary(){
    //var currText = "This is now vis1";
    //alert("You clicked a thing in the tertiary vis!");
    //needs to switch rendering between vis 1 and vis 3
    var vis3Body = $("#vis3-body").html();
    var vis1Body = $("#vis1-body").html();
    
    $("#vis3-body").html(vis1Body);
    $("#vis1-body").html(vis3Body);
}