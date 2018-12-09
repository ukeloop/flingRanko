var $window = $(window);

if($window.width() > $window.height()){
  // hd
  var STAGE_WIDTH = 1280;
  var STAGE_HEIGHT = 720;
} else {
  // iPhone 8 Plus 9:16
  var STAGE_WIDTH = 720;
  var STAGE_HEIGHT = 1280;
}
STAGE_HEIGHT -= 80;
var STAGE_COLOR = '0xa0a0a0';


// XXX: debounce
$window.resize(onResize);
var scale = initScale();


function initScale() {
  var width;
  var height;
  var ratioWidth;
  var ratioHeight;

  width = $window.width();
  height = $window.height() -80;
  ratioWidth = width / STAGE_WIDTH;
  ratioHeight = height / STAGE_HEIGHT;
  if (ratioWidth < ratioHeight) {
    return ratioWidth;
  } else {
    return ratioHeight;
  }
}

function onResize() {
  scale = initScale();
  stage.view.style.width = ~~(STAGE_WIDTH * scale) + 'px';
  stage.view.style.height = ~~(STAGE_HEIGHT * scale) + 'px';
}

var stage = new PIXI.Application($window.width(), (STAGE_HEIGHT * scale), {backgroundColor : STAGE_COLOR, preserveDrawingBuffer: true});
document.getElementById('canvas').appendChild(stage.view);

createBunny();



/* createBunny
------------------------------*/
$('.add').on('click', createBunny);

function createBunny(){
  var bunny = PIXI.Sprite.fromImage('./assets/img/skin.png');

  // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
  bunny.interactive = true;

  // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
  bunny.buttonMode = true;

  // center the bunny's anchor point
  bunny.anchor.set(0.5);

  // make it a bit bigger, so it's easier to grab
  bunny.scale.set(scale);


  // setup events
  bunny
      // events for drag start
      .on('mousedown', onDragStart)
      .on('touchstart', onDragStart)
      // events for drag end
      .on('mouseup', onDragEnd)
      .on('mouseupoutside', onDragEnd)
      .on('touchend', onDragEnd)
      .on('touchendoutside', onDragEnd)
      // events for drag move
      .on('mousemove', onDragMove)
      .on('touchmove', onDragMove);

  // move the sprite to its designated position
  bunny.position.x = stage.screen.width / 2;
  bunny.position.y = stage.screen.height / 2;

  // add it to the stage
  stage.stage.addChild(bunny);

  // Listen for animate update
  stage.ticker.add(function(delta) {
      // just for fun, let's rotate mr rabbit a little
      // delta is 1 if running at 100% performance
      // creates frame-independent transformation
      bunny.rotation += 0.1 * delta;
  });
}



/* Remove
------------------------------*/
$('.remove').on('click', removeBunny);

function removeBunny(){
  stage.stage.removeChild(stage.stage.children[(stage.stage.children.length - 1)]);
}


/* Save canvas
------------------------------*/
$('#canvas_save').on('click', function (e) {
  var imgUrl = stage.view.toDataURL("image/png");
  $(this).attr("href", imgUrl);
});


/* Drag and Drop
------------------------------*/

function onDragStart(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd()
{
    this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;
}

function onDragMove()
{
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}
