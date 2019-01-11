db.credit_inquiry.find({status:'confirmed').count()

db.credit_inquiry.find({'hash':'7e0976d94f203187aebfeb899674280e758b60bec6578b5025fb999b7137b333'})

db.credit_inquiry.update( { "hash" : '7e0976d94f203187aebfeb899674280e758b60bec6578b5025fb999b7137b333' } , { $set : { "status" : "imported"} },false,true )

db.credit_inquiry.update( { "status” : ‘confirmed’ } , { $set : { "status" : "imported"} },false,true )
