store.registerModel("user",{
    firstname:Lyte.attr("string"),
    lastname:Lyte.attr("string"),
    fullname:Lyte.attr("string"),
    email : Lyte.attr("string", {default:"vignesh@gmail.com"}),
    password:Lyte.attr("string"),
    phone:Lyte.attr("number",{default: 7904590195}),
    DOB:Lyte.attr("string"),
    gander:Lyte.attr("string"),
    address:Lyte.attr("string"),
    landmark:Lyte.attr("string"),
    city:Lyte.attr("string"),
    state:Lyte.attr("string"),
    zipcode:Lyte.attr("string"),
    _fullname : function(){
        this.$.set("fullname", this.firstname +" " +this.lastname);
    }.observes("firstname" , "lastname"),
});
