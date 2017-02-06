var SCREEN_WIDTH = window.innerWidth,
      SCREEN_HEIGHT = window.innerHeight,
      SCREEN_WIDTH_HALF = SCREEN_WIDTH  / 2,
      SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;

      var scene;  // Contains representation information for all objects in your 3D space, 
      var camera; // An object that will act as your viewport into the scene. (determins what we actually see)
      var renderer; // Draws in our browser and displays the objects in the scene from the point of view of the camera.

      // initialize camera
      camera = new THREE.OrthographicCamera( -SCREEN_WIDTH_HALF, SCREEN_WIDTH_HALF, SCREEN_HEIGHT_HALF, -SCREEN_HEIGHT_HALF, 1, 100 );
      // Initialize renderer 
      renderer = new THREE.WebGLRenderer();
      renderer.setClearColor( 0x000000 ); // background color 
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
      document.body.appendChild( renderer.domElement ); // place the renderer in our html DOM


      // Initialize scene 
      scene = new THREE.Scene();
 
      // Place camera within the scene
      scene.add(camera);

      // Add meshes to the scene to render
      var pGeometry = new THREE.CubeGeometry( 25, 25, 10);
      var p1Material = new THREE.MeshPhongMaterial({color: 0xEE0000});
	  
	  var wallGeometry = new THREE.CubeGeometry(12.5,12.5,10);
	  var wallMaterial = new THREE.MeshPhongMaterial({color: 0x8d8d8d});
	  
	  var arenaGeometry = new THREE.CubeGeometry(600,600,1);
	  var arenaMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
	  
	  var arena = new THREE.Mesh(arenaGeometry, arenaMaterial);
      var p1 = new THREE.Mesh(pGeometry, p1Material);
	  
	  
	  
      
	  // Add them to the scene
      scene.add(p1);
	  scene.add(arena);
	  
	  //Inner angled wall coordinates
	  var wallListX1 = [-100,-100,-100,-100,-100,-100,100,100,100,100,100,100,
	  -100,-100,-100,-100,-100,-100,100,100,100,100,100,100,
	  37.5,50,62.5,75,87.5,100,37.5,50,62.5,75,87.5,100,
	  -37.5,-50,-62.5,-75,-87.5,-100,-37.5,-50,-62.5,-75,-87.5,-100];
	  var wallListY1 = [37.5,50,62.5,75,87.5,100,37.5,50,62.5,75,87.5,100,
	  -37.5,-50,-62.5,-75,-87.5,-100,-37.5,-50,-62.5,-75,-87.5,-100,
	  -100,-100,-100,-100,-100,-100,100,100,100,100,100,100,
	  -100,-100,-100,-100,-100,-100,100,100,100,100,100,100];
	  
	  //Number of wall units
	  var lenWall1 = 48;
	  
	  //Add and position walls
	  var wallList1 = [];
	  for (i = 0; i < lenWall1; i++) wallList1[i] = new THREE.Mesh(wallGeometry, wallMaterial);

	  for (i = 0; i < wallList1.length; i++) {
		scene.add(wallList1[i]);
	  }
	  for (i = 0; i < wallList1.length; i++) {
		wallList1[i].position.set(wallListX1[i],wallListY1[i], -11);
	  }
	  
	  p1.position.set(0,0,-11);
	  arena.position.set(0,0,-25);
	  

      // Add light 
      var light = new THREE.AmbientLight(0xffffff); // soft white light
	  scene.add( light );
	  
	  
	  //Raycasting:
	  
	  //Initialize ray vectors
	  var rays = [
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(1, 1, 0),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(1, -1, 0),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(-1, -1, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(-1, 1, 0)
	  ];
	  var caster = new THREE.Raycaster();
	  
	  var obstacles = wallList1
	  var i;
	  var collisions;
	  var sqDistance = 12.5
	  var goYf = true
	  var goYb = true
	  var goXf = true
	  var goXb = true
	  
	  
		
	  var speed = 1
	  
	  function handleKeyDown(event) {
		if (event.keyCode == 87) { //87 is "w"
	      window.isWDown = true;
	    }
		else if (event.keyCode == 83) { //83 is "s"
		  window.isSDown = true;
	    }
		else if (event.keyCode == 65) { //65 is "a"
		  window.isADown = true;
	    }
		else if (event.keyCode == 68) { //68 is "d"
		  window.isDDown = true;
	    }
		else if (event.keyCode == 32) { //32 is spacebar
	      window.isSpaceDown = true;
		  window.isSpaceDown = false;
		}
	  }
      function handleKeyUp(event) {
        if (event.keyCode == 87) {
          window.isWDown = false;
		}
		else if (event.keyCode == 83) {
		  window.isSDown = false;
		}
		else if (event.keyCode == 65) {
		  window.isADown = false;
		}
		else if (event.keyCode == 68) {
		  window.isDDown = false;
        }
      }

	  
      window.addEventListener('keydown', handleKeyDown, false);
      window.addEventListener('keyup', handleKeyUp, false);
	  
	  //Add mouse for aiming and shooting
	  var projector, mouse = { x: 0, y: 0 };
	  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	  
	  function onDocumentMouseDown( event ) {
		console.log("Mouse Clicked.");
	    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	  
	    var mouseVector = new THREE.Vector3( mouse.x, mouse.y, -5 );
		var mouseRayCast = new THREE.Raycaster();
	    mouseRayCast.set(p1.position, mouseVector);
		
		projectileCount++;
		
		scene.add(projList1[projectileCount]);
		projList1[projectileCount].position.set(p1.position.x + 18 * Math.cos(Math.atan(mouse.y/mouse.x)) * Math.abs(mouse.x) / mouse.x, p1.position.y + 18 * Math.sin(Math.atan(mouse.y/mouse.x)) * Math.abs(mouse.x) / mouse.x, p1.position.z);
		
		//Math to coerce vectors to travel the correct directions
		//Note: all velocities are equal
		projList1VectorX[projectileCount] = 3 * Math.cos(Math.atan(mouse.y/mouse.x)) * Math.abs(mouse.x) / mouse.x;
		projList1VectorY[projectileCount] = 3 * Math.sin(Math.atan(mouse.y/mouse.x)) * Math.abs(mouse.x) / mouse.x;
		}
	  
	  var projectileCount = 0
	  
	  var projList1VectorX = [];
	  var projList1VectorY = [];
	  
	  var projectileGeometry = new THREE.SphereGeometry(8,10,10);
	  var projectileMesh = new THREE.MeshPhongMaterial({color: 0x000000});
		
	  var projList1 = [];
	  for (i = 0; i < 100; i++) projList1[i] = new THREE.Mesh(projectileGeometry, projectileMesh);
	  


	
      animate(); 
	  function animate() {
        requestAnimationFrame( animate );
		
	    //For each ray
	    for (i=0; i < rays.length; i += 1){
	    //Set raycast to direction
		  caster.set(p1.position, rays[i]);
	    //Test if raycast intersects with any obstacle mesh
	      collisions = caster.intersectObjects(obstacles);
		
		
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		/// 																																	 ///
		///  NOTE: BUG CONFIRMED - CONDITIONAL ISSUE LOCKING ONE DIRECTION OF MOVEMENT WHEN IN A CORNER PUSHING MULTIPLE DIRECTIONs - FIX LATER  ///
		///																																		 ///
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		//Disable that direction if true
		  if (collisions.length > 0 && collisions[0].distance <= sqDistance) {
		    if ((i == 0 || i == 1 || i == 7) && window.isWDown){
			  goYf = false;}
		    else if ((i == 3 || i == 4 || i == 5) && window.isSDown){
			  goYb = false;}
		    else{
			  goYf = true;
			  goYb = true;
		    }
		    if ((i == 1 || i == 2 || i == 3) && window.isDDown){
			  goXf = false;}
		    else if ((i == 5 || i == 6 || i == 7) && window.isADown){
			  goXb = false;}
		    else{
			  goXf = true;
			  goXb = true;
		    }
		    }
	    }
		
		
		if(window.isWDown){
		  if(goYf){
		    p1.translateY(speed)}
		}
		if(window.isSDown){
		  if(goYb){
		    p1.translateY(-speed)}
		}
		if(window.isADown){
		  if(goXb){
		    p1.translateX(-speed)}
		}
		if(window.isDDown){
		  if(goXf){
		    p1.translateX(speed)}
		}
		if(window.isSpaceDown){
		}
		
		if((window.isWDown && window.isADown) || (window.isWDown && window.isDDown) || (window.isSDown && window.isADown) || (window.isSDown && window.isDDown)){
		  speed = 1.5/1.414}
		else{
		  speed = 1.5}
		
		
		///////////////////////////////////////////////////////
		///      INSERT PROJECTILE PHYSICS HERE             ///
		///////////////////////////////////////////////////////
		console.log(projectileCount);
		if(projectileCount > 0) {
		  for(i=1; i <= projectileCount; i++){
		    projList1[i].translateX(projList1VectorX[i]);
		    projList1[i].translateY(projList1VectorY[i]);		    
		  }
		}
		
		
		render();
	    }

      function render() {
			{  renderer.render( scene, camera );  }
	  }
	  