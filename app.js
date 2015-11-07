var cp=require('child_process')
var http=require('http')
var keypress = require('keypress');
keypress(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();

if (process.argv[2]=='--server'){
	mode='server'
	port=process.argv[3]
	command=process.argv[4]
	args=process.argv.slice(5).join(' ')
	console.log(args)
}
else if(process.argv[2]=='--client'){
	mode='client'
	ip=process.argv[3]
	port=process.argv[4]
}
else{
	console.log('Must choose if you are client or server')
	process.exit()
}

var _res
if(mode=='client'){
	var readline = require('readline');
	var rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
	});
	console.log('connecting to server',ip +":" + port)

	var client_req=require('net').connect(port,ip,function(){
		client_req.on('data',function(data){
			console.log(data.toString('utf-8'))
			if(data=='EOF'){
				process.exit();
			}
		})		
		rl.on('line',function(a){
			console.log('line')
			console.log(a)
			client_req.write(a)
		})
		client_req.on('error',function(){
			console.log('server said bye bye')
			process.exit()
		})
	})
	// client_req.write('exit\r\n')

	process.stdin.on('keypress',function(chunk,key){
		if(key && key.name === "c" && key.ctrl) {
		  console.log("bye bye client");
		  process.exit();
		}
	})
}
var _req
if(mode=='server'){
	console.log('running:',command)
	console.log('listen to port',port)
	var x=cp.spawn('cmd', '/c dir d:\\ /s',function(){
	})

	x.stdout.on('data',function(a,b){
		console.log(a.toString('utf-8'))
	})
	x.stderr.on('data',function(a,b){
		console.log(a.toString('utf-8'))
	})
	x.on('exit',function(){
		process.exit()
	})

	
	var server=require('net').createServer(function(req){
		_req=req
		req.on('data',function(data){
			x.stdin.write(data + '\r\n')
		})
		x.stdout.on('data',function(a,b){
			req.write(a)
		})		
		x.stderr.on('data',function(a,b){
			req.write(a)
		})
		x.on('exit',function(){
			req.write('EOF')
		})		
		req.on('error',function(){
			// console.log('error')
		})
	}).listen(port)

	process.stdin.on('keypress',function(a,key){
		if(key && key.name === "c" && key.ctrl) {
		  console.log("bye bye client+server");
		  process.exit();
		}
		try{
			process.stdout.write(a)
			x.stdin.write(a)
			if(a[0]=='\r') x.stdin.write('\n')
		}
		catch(asdasd){}
	})
}