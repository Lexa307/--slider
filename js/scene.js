
/*global THREE*/
/**
 * @author Dmitry Solovev <https://vk.com/id138002875>
 */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 0.1, 10000 );
const renderer = new THREE.WebGLRenderer({antialias:true});
let GlobalIndex=0;
const models=[{model:null},{model:null},{model:null}];
const clickcheker = new THREE.Mesh(new THREE.PlaneGeometry( 7, 7, 1,1 ),new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} ));
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
let windowHalfX,windowHalfY,mouseX,mouseY;
document.body.appendChild( renderer.domElement );
const d=document.createElement('div');

d.style.width='100%';

d.style.height="100%";
d.style.margin="0 0 0 0";
d.style.padding="0 0 0 0";
d.style.top="0";
d.style.left="0";
d.style.position="absolute";
d.style.opacity="0.0";

d.style.background='#221a41';

document.body.appendChild(d);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(0,0);
const loader = new THREE.GLTFLoader();
const pointtexture = new THREE.TextureLoader().load( 'textures/point.png' );
const plustexture = new THREE.TextureLoader().load( 'textures/point_plus.png' );
const flashtexture = new THREE.TextureLoader().load( 'textures/flash.png' );
windowHalfX = window.innerWidth / 2;
windowHalfY = window.innerHeight / 2;
mouseX=mouseY=0;
THREE.DRACOLoader.setDecoderPath( 'js/draco/' );
loader.setDRACOLoader( new THREE.DRACOLoader() );
function LoadBridge(){
	loader.load(
			// resource URL
			'models/new_rem_bridgegltf.gltf',
			// called when the resource is loaded
			function ( gltf ) {

				let ind = 0;
				for (let i of gltf.scene.children[2].children){
					switch(ind){
						case 0:i.material = new THREE.MeshLambertMaterial({transparent:true,opacity:0.9,wireframe:false,color:0x1d1b37,emissive:0x000000});
						break;
						case 1:i.material = new THREE.MeshLambertMaterial({transparent:true,opacity:0.3,wireframe:false,color:0xffffff,emissive:0x353846});
						break;
						case 2:i.material = new THREE.MeshLambertMaterial({transparent:true,opacity:1,wireframe:false,color:0x454559,emissive:0x000000});
						break;
						case 3:i.material = new THREE.MeshLambertMaterial({transparent:true,opacity:1,wireframe:false,color:0xffffff,emissive:0x000000});
					}
					ind++;
				}

				for (let i of gltf.scene.children){
					if(i.name=='river'){
						i.material = new THREE.MeshBasicMaterial({color:0x373766, transparent:true, opacity:0.52});
						i.position.z+=16;
					}
				}

				gltf.scene.rotation.y+=Math.PI/2;
				gltf.scene.position.y-=Math.PI*6;
				gltf.scene.position.z+=Math.PI*2;
				
				
				models[1].model=gltf.scene;
				
			},
			// called while loading is progressing
			function ( xhr ) {

				//console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

			},
			// called when loading has errors
			function ( error ) {
		
				console.log( 'An error happened' );
			}
			);
}
function LoadFactory(){
	loader.load('models/factory.gltf',function ( gltf ) {
			let grcount = 0;
			let purpmaterial = new THREE.MeshLambertMaterial({transparent:true,opacity:0.9,wireframe:false,color:0xffffff});
				for(let i of gltf.scene.children){
					if(i.children.length!=0){
				
						if(i.name=='red'||i.name=='yellow'||i.name=='green'||i.name=='blue'||i.name=='purp'){
			 				let groupcolor = new THREE.Color( Math.random(),Math.random(), Math.random() );
			 				let tmpmaterial = new THREE.MeshLambertMaterial({color:groupcolor,transparent:true})
			 				if(i.name=='yellow'){
			 					tmpmaterial = new THREE.MeshLambertMaterial({color:0x5d6372,transparent:true,opacity:1});
			 				}
			 				if(i.name=='blue'){
			 					tmpmaterial = new THREE.MeshLambertMaterial({color:0xb8b8b9,transparent:true,opacity:0.8});
			 				}
			 				if(i.name=='purp'){
			 					tmpmaterial = new THREE.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:1});
			 				}
			 				if(i.name=='green'){
			 					tmpmaterial = new THREE.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:0.8});
			 				}
			 				if(i.name=='red'){
			 					tmpmaterial = new THREE.MeshLambertMaterial({color:0x050714,transparent:true,opacity:0.3});
			 				}

			 				for (let j of i.children){
			 					j.material = tmpmaterial;
							}
				
						}	
				
					}else{
						i.material = purpmaterial;
					}
		
		
				}
			gltf.scene.position.y+=80;
			gltf.scene.position.x+=100;
			gltf.scene.rotation.z+=Math.PI*2;
			
			models[2].model=gltf.scene;
			
		},
	// called while loading is progressing
	function ( xhr ) {

	//	console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {
		console.log( 'An error happened' );
	});
}
class initfactory{
	constructor(){
		TweenMax.killAll();
		this.maincurve = new THREE.CurvePath();
		this.texture = pointtexture;
		this.spriteMaterial = new THREE.SpriteMaterial( {map: this.texture,  transparent:true,depthTest:false } );
		const light = new THREE.PointLight( 0xa1a1c2, 1, 20000 );
		scene.background= new THREE.Color(0x221a41);
		light.position.set( 312.86610164166655, 166.51330968343603, 189.0765995307099);
		light.castShadow = true;            // default false
		scene.add( light );
		const lightsp = new THREE.HemisphereLight( 0xc3c3f7, 0x46466e, 0.6 );//0xa1a1c2, 0xa1a1c2, 1
		scene.add( lightsp );
		this.factoryanimation = {
			point:null,
			ready:false,
			ind:0,
			linepointfloat:0.4,
			animating:false,
	
			step0:()=>{
				TweenMax.killAll();
				this.factoryanimation.point.children[0].visible=false;
				this.factoryanimation.animating=true;
				this.factoryanimation.point.material.map = pointtexture;
				TweenMax.to(this.factoryanimation,3,{linepointfloat:0.4,ease: Power2.easeOut,onUpdate:()=>{
				this.factoryanimation.point.position.set(this.maincurve.getPointAt(this.factoryanimation.linepointfloat).x,this.maincurve.getPointAt(this.factoryanimation.linepointfloat).y,this.maincurve.getPointAt(this.factoryanimation.linepointfloat).z);
				},onComplete:()=>{
					this.factoryanimation.animating=false;
					
				}});
				TweenMax.to(camera.position,3,{x:1026.6348174297823,y:250.68991167435124,z:233.76332634535098});
				this.factoryanimation.ind=0;
				this.factoryanimation.fadeback();
			},
	
			step1:()=>{
				
				this.factoryanimation.animating=true;
				TweenMax.to(this.factoryanimation,3,{linepointfloat:0.98,ease: Power2.easeOut,onUpdate:()=>{
					this.factoryanimation.point.position.set(this.maincurve.getPointAt(this.factoryanimation.linepointfloat).x,this.maincurve.getPointAt(this.factoryanimation.linepointfloat).y,this.maincurve.getPointAt(this.factoryanimation.linepointfloat).z);
						},onComplete:()=>{
							this.factoryanimation.point.material.map = plustexture;
							this.factoryanimation.animating=false;
							this.factoryanimation.point.children[0].visible=true;
							TweenMax.to(this.factoryanimation.point.children[0].material,1,{opacity:0,repeat:-1});
							TweenMax.to(this.factoryanimation.point.children[0].scale,1,{x:2.5,y:2.5,repeat:-1});
					}});
				TweenMax.to(camera.position,3,{x:51.43743331684462,  y:229.3725250471521,  z:37.041625576757866});
				this.factoryanimation.ind=1;
			},
			initstart:()=>{
				
				this.factoryanimation.point = new THREE.Sprite(this.spriteMaterial);
				this.factoryanimation.point.position.set(this.maincurve.getPointAt(this.factoryanimation.linepointfloat).x,this.maincurve.getPointAt(this.factoryanimation.linepointfloat).y,this.maincurve.getPointAt(this.factoryanimation.linepointfloat).z);
				this.factoryanimation.point.scale.set(7,7,1.0);
				this.factoryanimation.point.add(new THREE.Sprite(new THREE.SpriteMaterial( {map: flashtexture,  transparent:true,opacity:1,depthTest:false } )));
				this.factoryanimation.point.children[0].visible=false;
				this.factoryanimation.point.name = "factorypoint";
				scene.add(this.factoryanimation.point);
				camera.position.set( 1026.6348174297823, 250.68991167435124, 233.76332634535098);
				this.factoryanimation.ready= true;
				this.factoryanimation.step1();
			},
			fadeback:()=>{
				TweenMax.to(d.style,1.5,{opacity:1,onComplete:()=>{
					for(let i=scene.children.length;i>=0;i--){
						scene.remove(scene.children[i]);
				
					}
			//init next scene
			
					a = new initbridge(1);
					GlobalIndex = 1;
					
					}});
			}
	
	
		}
		function loadfactory(f){
			let loadCheker = setInterval(()=>{
					if(models[2].model===null){
							
			}else{
				scene.add(models[2].model);
				f();
				TweenMax.to(d.style,1.5,{opacity:0});
				clearInterval(loadCheker);
			}
			},10)
		

	};
	function initcurve(maincurve){//initcurve
		let color = new THREE.Color();
	
		maincurve.add( new THREE.QuadraticBezierCurve3(
 		new THREE.Vector3( 1200, 80,  -129 ),
 		new THREE.Vector3( 260, 80, -129 ),
 		new THREE.Vector3( 255, 80, -129  ),
		));
		maincurve.add( new THREE.QuadraticBezierCurve3(
		new THREE.Vector3( 255, 80, -129 ),
 		new THREE.Vector3( 244, 80, -129 ),
		new THREE.Vector3( 244, 80, -135  ),
		));
		maincurve.add( new THREE.QuadraticBezierCurve3(
		new THREE.Vector3( 244, 80, -135 ),
		new THREE.Vector3( 244, 80, -170 ),
		new THREE.Vector3( 244, 80, -170  ),
		));
		let positions = [];
		let colors1 = [];
		var points = maincurve.getPoints( 50 );
		for(let i = 0; i<points.length; i++){
			positions.push(points[i].x,points[i].y,points[i].z);
			color.setHSL( 1.0, 1.0, 0.5 );
			colors1.push( color.r, color.g, color.b );
		}
		let testgeom  = new THREE.LineGeometry();
		testgeom.setPositions( positions );//experimental curve
		testgeom.setColors( colors1 );
 
		let material = new THREE.LineMaterial( { color : 0xA03439, linewidth: 3, vertexColors: THREE.VertexColors, dashed: false} );
		material.resolution.set( window.innerWidth, window.innerHeight );
		let lineCurve1 = new THREE.Line2(testgeom,material);
		lineCurve1.computeLineDistances();
		lineCurve1.scale.set(1,1,1);

		scene.add(lineCurve1);

	};
		initcurve(this.maincurve);
		loadfactory(this.factoryanimation.initstart);
		
	}
}
class initbridge{
	constructor(fromindex){
		TweenMax.killAll();
		this.maincurve = new THREE.CurvePath();
		this.texture = pointtexture;
		this.spriteMaterial = new THREE.SpriteMaterial( {map: this.texture,  transparent:true,depthTest:false } );
		const light = new THREE.PointLight( 0xa1a1c2, 1, 20000 );
		scene.background= new THREE.Color(0x221a41);
		light.position.set( 312.86610164166655, 166.51330968343603, 189.0765995307099);
		light.castShadow = true;            // default false
		scene.add( light );
		const lightsp = new THREE.HemisphereLight( 0xc3c3f7, 0x46466e, 0.6 );//0xa1a1c2, 0xa1a1c2, 1
		scene.add( lightsp );
		
		function initcurve(maincurve){
			let zdist = -60; //for lover curve
			maincurve.add( new THREE.QuadraticBezierCurve3(
 			new THREE.Vector3( -900,11,1.1 ),
			new THREE.Vector3( -820,11,1.1 ),
			new THREE.Vector3( -790,5,-10 ),
			));
			maincurve.add( new THREE.QuadraticBezierCurve3(
 			new THREE.Vector3( -790,5,-10 ),
			new THREE.Vector3( -720,5,-40 ),//-28
			new THREE.Vector3( -700,5, -40 ),
			));
			maincurve.add( new THREE.QuadraticBezierCurve3(
			new THREE.Vector3( -700,5,-40 ),
			new THREE.Vector3( -500,5,-40 ),
			new THREE.Vector3( -220,1,zdist ),
			));

			maincurve.add(new THREE.QuadraticBezierCurve3(
			new THREE.Vector3( -220,1,zdist  ),
			new THREE.Vector3( -195,2,zdist ),
			new THREE.Vector3( -190,-8.5,zdist ),
			));
			maincurve.add(new THREE.QuadraticBezierCurve3(
			new THREE.Vector3( -190,-8.5,zdist ),
			new THREE.Vector3( -180,-17,zdist ),
			new THREE.Vector3( -170,-17,zdist ),
			));
			maincurve.add(new THREE.QuadraticBezierCurve3(
		 	new THREE.Vector3(-170,-17,zdist  ),
			new THREE.Vector3( -160,-17,zdist ),
			new THREE.Vector3( 160,-17,zdist ),
			));
			maincurve.add(new THREE.QuadraticBezierCurve3(
			new THREE.Vector3( 160,-17,zdist ),
			new THREE.Vector3( 175,-15,zdist ),
			new THREE.Vector3( 180,-8.5,zdist ),
			));
			maincurve.add(new THREE.QuadraticBezierCurve3(
			new THREE.Vector3( 180,-8.5,zdist ),
			new THREE.Vector3( 185,1,zdist ),
			new THREE.Vector3( 200,1,zdist ),
			));
			maincurve.add(new THREE.QuadraticBezierCurve3(
			new THREE.Vector3( 200,1,zdist ),
			new THREE.Vector3( 200,1,zdist ),
			new THREE.Vector3( 1000,1,zdist ),
			));
			let linegeometry2 = new THREE.Geometry();
			linegeometry2.vertices.push(
			new THREE.Vector3( -3000,  11,  1.1 ),
			new THREE.Vector3( 1000,  11,  1.1 ),
			);

			let positions2 = [];
			let colors2 = [];
			let positions1 = [];
			let colors1 = [];
			let color = new THREE.Color();

			let points = maincurve.getPoints( 50 );
			for(let i = 0; i<points.length; i++){
				positions1.push(points[i].x,points[i].y,points[i].z);
				color.setHSL( 1.0, 1.0, 0.5 );
				colors1.push( color.r, color.g, color.b );
			}
			for(let i = 0; i<linegeometry2.vertices.length; i++){
				positions2.push(linegeometry2.vertices[i].x,linegeometry2.vertices[i].y,linegeometry2.vertices[i].z);
				color.setHSL( 1.0, 1.0, 0.5 );
				colors2.push( color.r, color.g, color.b );
			}

			let geometry = new THREE.BufferGeometry().setFromPoints(points  );
			let testgeom  = new THREE.LineGeometry();
			testgeom.setPositions( positions1 );//experimental curve
			testgeom.setColors( colors1 );
 
			let testgeom2  = new THREE.LineGeometry();
			testgeom2.setPositions( positions2 );//experimental curve
			testgeom2.setColors( colors2 );
 
			let material = new THREE.LineMaterial( { color : 0xA03439, linewidth: 3, vertexColors: THREE.VertexColors, dashed: false} );

			let lineCurve1 = new THREE.Line2(testgeom,material);
			lineCurve1.computeLineDistances();
			lineCurve1.scale.set(1,1,1);

			scene.add(lineCurve1);

			let lineCurve2 = new THREE.Line2(testgeom2,material);
			lineCurve2.computeLineDistances();
			lineCurve2.scale.set(1,1,1);

			scene.add(lineCurve2)

			material.resolution.set( window.innerWidth, window.innerHeight );
		}
		
		this.animationBridge ={
			stepindex:0,
			focuspoint:new THREE.Vector3(),
			floatstep:0,
			obj:0,
			obj2:0,
			animating:false,
			geometry: 0,
			material: 0,
			ready:false,
			initstart:()=>{
				this.animationBridge.obj = new THREE.Sprite( this.spriteMaterial );
				this.animationBridge.obj.scale.set(10,10,1.0);
				this.animationBridge.obj.name = "bridgepoint1";
				this.animationBridge.obj.add(new THREE.Sprite(new THREE.SpriteMaterial( {map: flashtexture,  transparent:true,opacity:1,depthTest:false } )));
				this.animationBridge.obj.position.set(-2000,  11,  1.1);
				this.animationBridge.obj2 = new THREE.Sprite( this.spriteMaterial );
				this.animationBridge.obj2.scale.set(10,10,1.0);
				this.animationBridge.obj2.add(new THREE.Sprite(new THREE.SpriteMaterial( {map: flashtexture,  transparent:true,opacity:1,depthTest:false } )));
				this.animationBridge.obj2.name = "bridgepoint2";
				this.animationBridge.obj.material.map=this.animationBridge.obj2.material.map=pointtexture;
				this.animationBridge.obj.children[0].visible=false;
				this.animationBridge.obj2.children[0].visible=false;
				scene.add(this.animationBridge.obj);
				scene.add(this.animationBridge.obj2);
				this.animationBridge.obj2.visible=false;
				camera.position.set(-2100,  254,  -364);
				camera.lookAt(this.animationBridge.obj.position);
				this.animationBridge.focuspoint= new THREE.Vector3(20,0,0).add(this.animationBridge.obj.position);
				this.animationBridge.animating=false;
				this.animationBridge.obj.material.depthTest=false;
				this.animationBridge.obj2.material.depthTest=false;
				this.animationBridge.ready=true;
				this.animationBridge.step1();
		
			},
			initend:()=>{
				this.animationBridge.stepindex=2;
				this.animationBridge.floatstep=0.7;
				this.animationBridge.obj = new THREE.Sprite( this.spriteMaterial );
				this.animationBridge.obj.scale.set(10,10,1.0);
				this.animationBridge.obj.name = "bridgepoint1";
				this.animationBridge.obj.add(new THREE.Sprite(new THREE.SpriteMaterial( {map: flashtexture,  transparent:true,opacity:1,depthTest:false } )));
				this.animationBridge.obj.position.set(470,11,1.1);
				this.animationBridge.obj2 = new THREE.Sprite( this.spriteMaterial );
				this.animationBridge.obj2.scale.set(10,10,1.0);
				this.animationBridge.obj2.add(new THREE.Sprite(new THREE.SpriteMaterial( {map: flashtexture,  transparent:true,opacity:1,depthTest:false } )));
				this.animationBridge.obj2.name = "bridgepoint2";
				this.animationBridge.obj.material.map=this.animationBridge.obj2.material.map=pointtexture;
				this.animationBridge.obj2.position.set(this.maincurve.getPointAt(0.7).x,this.maincurve.getPointAt(0.7).y,this.maincurve.getPointAt(0.7).z);//
				this.animationBridge.obj.children[0].visible=false;
				this.animationBridge.obj2.children[0].visible=false;
				scene.add(this.animationBridge.obj);
				scene.add(this.animationBridge.obj2);
				this.animationBridge.obj2.visible=true;
				camera.position.set(351.3846720065625,  226.33691718298594, -380.72489270467176);
				camera.lookAt(this.animationBridge.obj.position);
				this.animationBridge.focuspoint= new THREE.Vector3(20,0,0).add(this.animationBridge.obj.position);
				this.animationBridge.animating=false;
				this.animationBridge.obj.material.depthTest=false;
				this.animationBridge.obj2.material.depthTest=false;
				this.animationBridge.ready=true;
				this.animationBridge.step1();
			},
			step0:()=>{
				TweenMax.killAll();
				this.animationBridge.obj.children[0].visible=false;
				this.animationBridge.obj2.children[0].visible=false;
				this.animationBridge.animating=true;
				this.animationBridge.obj.material.map=this.animationBridge.obj2.material.map=pointtexture;
				this.animationBridge.backfade();
				TweenMax.to(this.animationBridge.obj.position,2,{x:-900,y:11,z:1.1,ease: Power2.easeOut,
				onComplete:()=>{this.animationBridge.obj2.visible=false;TweenMax.to(this.animationBridge.obj.position,2,{x:-2000,ease: Power2.easeOut,onComplete:()=>{this.animationBridge.animating=false; }})}});
	
				TweenMax.to(camera.position,4,{x:-2100,  y:254,  z:-364,ease: Power2.easeOut});
				TweenMax.to(this.animationBridge,2,{floatstep:0.0,ease: Power2.easeOut,
				onUpdate:()=>{this.animationBridge.obj2.position.set(this.maincurve.getPointAt(this.animationBridge.floatstep).x,this.maincurve.getPointAt(this.animationBridge.floatstep).y,this.maincurve.getPointAt(this.animationBridge.floatstep).z)},
				});
				this.animationBridge.stepindex=0;
			},
			step1:()=>{ 
				this.animationBridge.animating=true;
					if(this.animationBridge.stepindex==0){
						TweenMax.to(this.animationBridge.obj.position,1,{x:-900,y:11,z:1.1,ease: Power2.easeOut,
						onComplete:()=>{this.animationBridge.obj2.visible=true; TweenMax.to(this.animationBridge.obj.position,4,{x:-15,y:11,z:1.1,ease: Power2.easeOut});
						TweenMax.to(this.animationBridge,3,{floatstep:0.5,ease: Power2.easeOut,onComplete:()=>{this.animationBridge.animating=false;this.animationBridge.obj.material.map=this.animationBridge.obj2.material.map=plustexture;TweenMax.to(this.animationBridge.obj.children[0].material,1,{opacity:0,repeat:-1});
				TweenMax.to(this.animationBridge.obj.children[0].scale,1,{x:2.5,y:2.5,repeat:-1});
							TweenMax.to(this.animationBridge.obj2.children[0].material,1,{opacity:0,repeat:-1});
				TweenMax.to(this.animationBridge.obj2.children[0].scale,1,{x:2.5,y:2.5,repeat:-1});
				this.animationBridge.obj.children[0].visible=true;
				this.animationBridge.obj2.children[0].visible=true;
						},onUpdate:()=>{this.animationBridge.obj2.position.set(this.maincurve.getPointAt(this.animationBridge.floatstep).x,this.maincurve.getPointAt(this.animationBridge.floatstep).y,this.maincurve.getPointAt(this.animationBridge.floatstep).z )}});
						}
		 
						});
		//4
		
					}
				if(this.animationBridge.stepindex==2){
					TweenMax.to(this.animationBridge.obj.position,4,{x:-15,y:11,z:1.1,ease: Power2.easeOut});
					TweenMax.to(this.animationBridge,4,{floatstep:0.5,ease: Power2.easeOut,onComplete:()=>{this.animationBridge.animating=false;this.animationBridge.obj.material.map=this.animationBridge.obj2.material.map=plustexture;TweenMax.to(this.animationBridge.obj.children[0].material,1,{opacity:0,repeat:-1});
				TweenMax.to(this.animationBridge.obj.children[0].scale,1,{x:2.5,y:2.5,repeat:-1});
						TweenMax.to(this.animationBridge.obj2.children[0].material,1,{opacity:0,repeat:-1});
				TweenMax.to(this.animationBridge.obj2.children[0].scale,1,{x:2.5,y:2.5,repeat:-1});
					this.animationBridge.obj.children[0].visible=true;
					this.animationBridge.obj2.children[0].visible=true;
					},onUpdate:()=>{this.animationBridge.obj2.position.set(this.maincurve.getPointAt(this.animationBridge.floatstep).x,this.maincurve.getPointAt(this.animationBridge.floatstep).y,this.maincurve.getPointAt(this.animationBridge.floatstep).z )}
				
					});
			
				}
				TweenMax.to(camera.position,4,{x:351.3846720065625,  y:226.33691718298594, z:-380.72489270467176,ease: Power2.easeOut});
		
				this.animationBridge.stepindex=1;
			},
			step2:()=>{
				TweenMax.killAll();
				this.animationBridge.obj.children[0].visible=false;
				this.animationBridge.obj2.children[0].visible=false;
				this.animationBridge.obj.material.map=this.animationBridge.obj2.material.map=pointtexture;
				this.animationBridge.animating=true;
				this.animationBridge.endfade();
				TweenMax.to(this.animationBridge.obj.position,4,{x:470,y:11,z:1.1,ease: Power2.easeOut,onComplete:()=>{/* go to factory*/}});
		
		
				TweenMax.to(this.animationBridge,4,{floatstep:0.7,ease: Power2.easeOut,onComplete:()=>{this.animationBridge.animating=false;},onUpdate:()=>{this.animationBridge.obj2.position.set(this.maincurve.getPointAt(this.animationBridge.floatstep).x,this.maincurve.getPointAt(this.animationBridge.floatstep).y,this.maincurve.getPointAt(this.animationBridge.floatstep).z)}});
				this.animationBridge.stepindex=2;
			},
				endfade(){
					
					TweenMax.to(d.style,1.5,{opacity:1,onComplete:()=>{
					for(let i=scene.children.length;i>=0;i--){
						scene.remove(scene.children[i]);
				
					}
			//init next scene
			
					a = new initfactory();
					GlobalIndex = 2;
					
					}});
			
		
				},
				backfade(){
					
							TweenMax.to(d.style,1.5,{opacity:1,onComplete:()=>{
					for(let i=scene.children.length;i>=0;i--){
						scene.remove(scene.children[i]);
				
					}
			//init next scene
			
					a = new initstation(1);
					GlobalIndex = 0;
					
					}});
				}
		};
		function loadbridge(f1,f2){
			let loadCheker = setInterval(()=>{
				if (models[1].model===null){
						
			}else{
				scene.add(models[1].model);
				if(fromindex==1){
						f2();
					}else{
						f1();
					}
					
					TweenMax.to(d.style,1.5,{opacity:0});
					clearInterval(loadCheker);
			}
			},10);
			

		}
		
		initcurve(this.maincurve);
		loadbridge(this.animationBridge.initstart,this.animationBridge.initend);
	
		
	}
}


class initstation{
	 constructor(fromindex) {
	 	TweenMax.killAll();
    this.trg = new THREE.Vector3( 228.76723844414474,  86.13118278072474,  -203.60076379452582);//edit pls
	this.maincurve = new THREE.CurvePath();
	this.texture = pointtexture;
	this.spriteMaterial = new THREE.SpriteMaterial( {map: this.texture,  transparent:true,depthTest:false } );
	const light = new THREE.PointLight( 0xa1a1c2, 1, 20000 );
	scene.background= new THREE.Color(0x221a41);
	light.position.set( 312.86610164166655, 166.51330968343603, 189.0765995307099);
	light.castShadow = true;            // default false
	scene.add( light );
	const lightsp = new THREE.HemisphereLight( 0xc3c3f7, 0x46466e, 0.6 );//0xa1a1c2, 0xa1a1c2, 1
	scene.add( lightsp );
	this.stationanimation = {
		point:null,
		ready:false,
		ind:0,
		linepointfloat:0,
		animating:false,
	
		step0:()=>{
			this.stationanimation.animating=true;
			TweenMax.to(this.stationanimation,3,{linepointfloat:0.0,ease: Power2.easeOut,onUpdate:()=>{
				this.stationanimation.point.position.set(this.maincurve.getPointAt(this.stationanimation.linepointfloat).x,this.maincurve.getPointAt(this.stationanimation.linepointfloat).y,this.maincurve.getPointAt(this.stationanimation.linepointfloat).z);
			},onComplete:()=>{
				this.stationanimation.animating=false;
				
			}});
			TweenMax.to(camera.position,3,{x: 166.89964963341342, y: 223.46932037001454, z: -386.1775738127469,onComplete:()=>{
				this.stationanimation.point.material.map = plustexture;
				this.stationanimation.point.children[0].visible = true;
				TweenMax.to(this.stationanimation.point.children[0].material,1,{opacity:0,repeat:-1});
				TweenMax.to(this.stationanimation.point.children[0].scale,1,{x:2.5,y:2.5,repeat:-1});
			}});
			this.stationanimation.ind=0;
		
		},
	
		step1:()=>{
			TweenMax.killAll();
			this.stationanimation.point.children[0].visible=false;
			this.stationanimation.animating=true;
			this.stationanimation.point.material.map = pointtexture;
			TweenMax.to(this.stationanimation,3,{linepointfloat:0.6,ease: Power2.easeOut,onUpdate:()=>{
				this.stationanimation.point.position.set(this.maincurve.getPointAt(this.stationanimation.linepointfloat).x,this.maincurve.getPointAt(this.stationanimation.linepointfloat).y,this.maincurve.getPointAt(this.stationanimation.linepointfloat).z);
			},onComplete:()=>{
				this.stationanimation.animating=false;
			}});
			TweenMax.to(camera.position,3,{x: 500.89964963341342, y: 223.46932037001454, z: -386.1775738127469, onComplete:()=>{
				//this.stationanimation.endfade();
			}});
			this.stationanimation.endfade();
			this.stationanimation.ind=1;
		},
		initstart:(mc)=>{
			this.stationanimation.point = new THREE.Sprite(this.spriteMaterial);
			this.stationanimation.point.position.set(this.maincurve.getPointAt(this.stationanimation.linepointfloat).x,this.maincurve.getPointAt(this.stationanimation.linepointfloat).y,this.maincurve.getPointAt(this.stationanimation.linepointfloat).z);
			this.stationanimation.point.scale.set(7,7,1.0);
			this.stationanimation.point.add(new THREE.Sprite(new THREE.SpriteMaterial( {map: flashtexture,  transparent:true,opacity:1,depthTest:false } )));
			this.stationanimation.point.children[0].visible = false;
			this.stationanimation.point.name="stationpoint";
			
			scene.add(this.stationanimation.point);
			
			camera.position.set(  166.89964963341342,  223.46932037001454,  -386.1775738127469);
			if(fromindex==1){
				camera.position.set(  500.89964963341342,  223.46932037001454,  -386.1775738127469);
				this.stationanimation.linepointfloat=1.0;
			}
			this.stationanimation.ready= true;
			this.stationanimation.step0();
		},
		endfade(){
			
			TweenMax.to(d.style,1.5,{opacity:1,onComplete:()=>{
				for(let i=scene.children.length;i>=0;i--){
				scene.remove(scene.children[i]);
				
			}
			//init next scene
			
			a = new initbridge();
			GlobalIndex = 1;
			
			}});
			
		
		}
	
	
	}
	 function initcurve (mc){//initcurve
		let color = new THREE.Color();
	
		mc.add( new THREE.QuadraticBezierCurve3(
 		new THREE.Vector3( -100, -30,  -65 ),
 		new THREE.Vector3( -130, -30,  -65 ),
		new THREE.Vector3( 1000, -30,  -65  ),
		));
	
		let positions = [];
		let colors1 = [];
		var points = mc.getPoints( 50 );
		for(let i = 0; i<points.length; i++){
			positions.push(points[i].x,points[i].y,points[i].z);
			color.setHSL( 1.0, 1.0, 0.5 );
			colors1.push( color.r, color.g, color.b );
		}
		let testgeom  = new THREE.LineGeometry();
		testgeom.setPositions( positions );//experimental curve
		testgeom.setColors( colors1 );
 
		let material = new THREE.LineMaterial( { color : 0xA03439, linewidth: 3, vertexColors: THREE.VertexColors, dashed: false,transparent:true} );
		material.resolution.set( window.innerWidth, window.innerHeight );
		let lineCurve1 = new THREE.Line2(testgeom,material);
		lineCurve1.computeLineDistances();
		lineCurve1.scale.set(1,1,1);

		scene.add(lineCurve1);
	
		
	}
	function loadstation(f){
		if(models[0].model===null){
			loader.load('models/ELSTATION.gltf',function ( gltf ) {//station model
		//console.log(gltf);
		//scene.add(gltf.scene);
		let grcount = 0;
		let purpmaterial = new THREE.MeshLambertMaterial({transparent:true,opacity:0.9,wireframe:false,color:0xffffff});
		for(let i of gltf.scene.children){

			 if(i.name=='building'||'tubes'||'window'||'wires'||'laps'){
			 
			 	let groupcolor = new THREE.Color( Math.random(),Math.random(), Math.random() );
			 	let tmpmaterial = new THREE.MeshLambertMaterial({color:groupcolor,transparent:true})
			 	if(i.name=='building'){
			 		tmpmaterial = new THREE.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:0.8});
			 	}
			 	if(i.name=='floor'){
			 		tmpmaterial = new THREE.MeshLambertMaterial({color:0x1a1434,transparent:true,opacity:0.57});
			 	}
			 	if(i.name=='tubes'){
			 		tmpmaterial = new THREE.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:0.7,	});
			 	}
			 	if(i.name=='window'){
			 		tmpmaterial = new THREE.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:0.58});
			 	}
			 	if(i.name=='wires'){
			 		tmpmaterial = new THREE.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:0.8});
			 	}
			 	if(i.name=='laps'){
			 		tmpmaterial = new THREE.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:0.8});
			 	}
			 	i.material = tmpmaterial;	

			 }
		}

	scene.add(gltf.scene);
	models[0].model=gltf.scene;
	animate();
	f();
	LoadBridge();
	LoadFactory();
	TweenMax.to(d.style,1.5,{opacity:0});
	},
	// called while loading is progressing
	function ( xhr ) {

		//console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );
    
	});
		}else{
			scene.add(models[0].model);
			f();
			TweenMax.to(d.style,1.5,{opacity:0});
		}
		
	};

	initcurve(this.maincurve);
	loadstation(this.stationanimation.initstart);
  }

	
	
}


let a = new initstation();


function animate() {
   
	requestAnimationFrame( animate );
	
	if(GlobalIndex==0){
			if(a.stationanimation.ready){
				camera.lookAt(a.stationanimation.point.position);
			}

		if(!a.stationanimation.animating&&a.stationanimation.ready){
			switch (a.stationanimation.ind){
				case 0:
					camera.position.x += ( mouseX*0.06 - camera.position.x+166.89 ) * 0.01;
 					camera.position.y += ( - mouseY*0.06 - camera.position.y+223.46 ) * 0.01;
 		
 					break;
 				case 1:
 					camera.position.x += ( mouseX*0.06 - camera.position.x+200 ) * 0.01;
 					camera.position.y += ( - mouseY*0.06 - camera.position.y+223.46 ) * 0.01;
 			
 					break;
			}
	
		}
	}
	if(GlobalIndex==1){
			if(a.animationBridge.animating){
	
		a.animationBridge.focuspoint=new THREE.Vector3(20,0,0).add(a.animationBridge.obj.position);
		camera.lookAt(a.animationBridge.focuspoint);

	//	renderer.clearDepth(); // important!
	
	}else{
		if(a.animationBridge.ready){
			switch(a.animationBridge.stepindex){
				case 0:
					camera.position.x += ( mouseX*0.06 - camera.position.x-2000 ) * 0.01;
					camera.position.y += ( - mouseY*0.06 - camera.position.y+254 ) * 0.01;
					camera.lookAt(a.animationBridge.focuspoint);
					// code
					break;
				case 1:
					camera.position.x += ( mouseX*0.06 - camera.position.x+351 ) * 0.01;
					camera.position.y += ( - mouseY*0.06 - camera.position.y+226 ) * 0.01;
					camera.lookAt(a.animationBridge.focuspoint);
					break;
				case 2:
					camera.position.x += ( mouseX*0.06 - camera.position.x+351 ) * 0.01;
					camera.position.y += ( - mouseY*0.06 - camera.position.y+206 )* 0.01;
					camera.lookAt(a.animationBridge.focuspoint);
					break;
			}
				
		}
		
	}
	}
	if(GlobalIndex==2){
		if(a.factoryanimation.ready){
			camera.lookAt(a.factoryanimation.point.position);
		}

		if(!a.factoryanimation.animating&&a.factoryanimation.ready){
			switch (a.factoryanimation.ind){
				case 0:
				camera.position.x += ( mouseX*0.06 - camera.position.x+1026 ) * 0.01;
 				camera.position.y += ( - mouseY*0.06 - camera.position.y+250 ) * 0.01;
 		
 				break;
 				case 1:
 				camera.position.x += ( mouseX*0.06 - camera.position.x+51 ) * 0.01;
 				camera.position.y += ( - mouseY*0.06 - camera.position.y+229 ) * 0.01;
 			
 				break;
			}
	
		}
	}


	renderer.clearDepth();
//controls.update();
	renderer.render( scene, camera );

}

function PointSceneControl(direction){
	if(GlobalIndex==0){
		if(!a.stationanimation.animating&&a.stationanimation.ready){
			if(direction=='left'){
				switch (a.stationanimation.ind) {
 					case 0:a.stationanimation.step1();
 					break;
 				}	
			}
			if(direction=='right'){
				switch (a.stationanimation.ind) {
 			
 					case 1:a.stationanimation.step0();	
 					break;
 				}
			}
		}
	}
	if(GlobalIndex==1){
		if(!a.animationBridge.animating&&a.animationBridge.ready){
			if(direction=='left'){
				switch (a.animationBridge.stepindex) {
 					case 0:a.animationBridge.step1();
 					break;
 					case 1:a.animationBridge.step2();	
 					break;
 				}
			}
			if(direction=='right'){
				switch (a.animationBridge.stepindex) {
 					case 2:a.animationBridge.step1();
 					break;
 					case 1:a.animationBridge.step0();	
 					break;
 				}
			}
		}
			

		
	}
	if(GlobalIndex==2){
		if(!a.factoryanimation.animating&&a.factoryanimation.ready){
			if(direction=='left'){
				switch (a.factoryanimation.ind) {
 					case 0:a.factoryanimation.step1();
 					console.log('lol');
 					break;
 				}
			}
			if(direction=='right'){
				switch (a.factoryanimation.ind) {
 					case 1:a.factoryanimation.step0();	
 					break;
 				}
			}
		}
	}
}


	



window.addEventListener( 'resize', onWindowResize, false );
			
			function onWindowResize() {
				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}
			function onMouseMove( event ) {
				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			
				//console.info("mouseX: "+ mouseX+" "+"mouseY: "+ mouseY);
			}
document.addEventListener( 'mousemove', onMouseMove );
	
window.addEventListener("mousewheel", function(e){
 	//console.log(e.deltaY)
 	
 		 	if(e.deltaY==100){
 		
 		PointSceneControl('left');
 	}else{
 		PointSceneControl('right');
 	}
 		
 	

 });
 function tap(argument) {
 		if(GlobalIndex==0){
		if(!a.stationanimation.animating&&a.stationanimation.ready){
			raycaster.setFromCamera( mouse, camera );
 			let intersects = raycaster.intersectObjects( scene.children );
 			if(intersects.length>0){
 				
 				if(intersects[0].object.name=="stationpoint"){
 						console.log("нажата точка станции!")
 						
 				}

 			}
		}
	}
	if(GlobalIndex==1){
		if(!a.animationBridge.animating&&a.animationBridge.ready){
			raycaster.setFromCamera( mouse, camera );
 			let intersects = raycaster.intersectObjects( scene.children );
 			if(intersects.length>0){
 				
 				if(intersects[0].object.name == "bridgepoint1"){
 					console.log("нажата верхняя точка моста!")
 					
 				}
 				if(intersects[0].object.name == "bridgepoint2"){
 					console.log("нажата нижняя точка моста!")
 					
 				}
 				
 			}
		}
			

		
	}
	if(GlobalIndex==2){
		if(!a.factoryanimation.animating&&a.factoryanimation.ready){
			raycaster.setFromCamera( mouse, camera );
 			let intersects = raycaster.intersectObjects( scene.children );
 			if(intersects.length>0){
 				
 				if(intersects[0].object.name=="factorypoint"){
 						console.log("нажата точка завода!")
 				}

 			}
		}
	}
 	

 }
 window.addEventListener('click',tap,false);
 
let initialPoint;
let finalPoint;
document.addEventListener('touchstart', function(event) {
event.preventDefault();
event.stopPropagation();
initialPoint=event.changedTouches[0];
}, false);
document.addEventListener('touchend', function(event) {
event.preventDefault();
event.stopPropagation();
finalPoint=event.changedTouches[0];
let xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
let yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
if (xAbs > 20 || yAbs > 20) {
if (xAbs > yAbs) {
if (finalPoint.pageX < initialPoint.pageX){
/*СВАЙП ВЛЕВО*/
		PointSceneControl('right');
}
else{
/*СВАЙП ВПРАВО*/
		PointSceneControl('left');
}
}
else {
if (finalPoint.pageY < initialPoint.pageY){
/*СВАЙП ВВЕРХ*/}
else{
/*СВАЙП ВНИЗ*/}
}
}
}, false);

			
window.addEventListener( 'mousemove', onDocumentMouseMove, false );
				//
window.addEventListener( 'resize', onWindowResize, false );
			
			function onWindowResize() {
				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}
			function onDocumentMouseMove( event ) {
				mouseX = ( event.clientX - windowHalfX );
				mouseY = ( event.clientY - windowHalfY );
				//console.info("mouseX: "+ mouseX+" "+"mouseY: "+ mouseY);
			}

let scrollPos = 0;
// adding scroll event
window.addEventListener('scroll', function(){
		if(!a.stationanimation.animating&&a.stationanimation.ready){
  // detects new state and compares it with the new one
  if ((document.body.getBoundingClientRect()).top > scrollPos){
  	
  		PointSceneControl('right');
  }
	
	else{
		PointSceneControl('left');
		
	}
	
	// saves the new position for iteration.
	scrollPos = (document.body.getBoundingClientRect()).top;
		}
});

let scrolling = false;
let oldTime = 0;
let newTime = 0;
let isTouchPad;
let eventCount = 0;
let eventCountStart;

let mouseHandle = function (evt) {
	
    let isTouchPadDefined = isTouchPad || typeof isTouchPad !== "undefined";
   // console.log(isTouchPadDefined);
    if (!isTouchPadDefined) {
        if (eventCount === 0) {
            eventCountStart = new Date().getTime();
        }

        eventCount++;

        if (new Date().getTime() - eventCountStart > 100) {
                if (eventCount > 10) {
                    isTouchPad = true;
                } else {
                    isTouchPad = false;
                }
            isTouchPadDefined = true;
        }
    }

    if (isTouchPadDefined) {
    	
        // here you can do what you want
        // i just wanted the direction, for swiping, so i have to prevent
        // the multiple event calls to trigger multiple unwanted actions (trackpad)
        if (!evt) evt = event;
        let direction = (evt.detail<0 || evt.wheelDelta>0) ? 1 : -1;

        if (isTouchPad) {
            newTime = new Date().getTime();

            if (!scrolling && newTime-oldTime > 550 ) {
                scrolling = true;
                if (direction < 0) {
                    // swipe down
                  PointSceneControl('left');
                } else {
                    // swipe up
                  PointSceneControl('right');
                }
                setTimeout(function() {oldTime = new Date().getTime();scrolling = false}, 500);
            }
        } else {
            if (direction < 0) {
            	PointSceneControl('left');
            	
                // swipe down
            } else {
                // swipe up
               PointSceneControl('right');
            }
        }
    }
	
}
document.addEventListener("mousewheel", mouseHandle, false);
document.addEventListener("DOMMouseScroll", mouseHandle, false);