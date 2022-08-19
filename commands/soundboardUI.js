module.exports = {
	name: 'soundboard',
	description: 'This is a UI for people who don not want to type out commands and just push buttons',
	random:false,
	client:true,
	execute(msg) {
		try{
			msg.reply("Here is the soundboard")
            msg.reply("1️⃣bruh \n2️⃣boowomp  \n3️⃣wow \n4️⃣anime wow \n5️⃣Mom get the camera")
		}catch(err){
			console.log("Error in react");
			console.log(err.stack);
		}
	},
};