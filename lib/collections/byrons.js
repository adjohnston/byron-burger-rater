//  byrons : collections
//  --------------------

    Byrons = new Mongo.Collection('byrons');


//  schema
//  ------
//  byron = {
//    _id:     String,
//    address: String,
//    photo:   String,
//    votes:   Number,
//    
//    ips: Object,
//      "ips.$.up":   Array,
//      "ips.$.down": Array
// };