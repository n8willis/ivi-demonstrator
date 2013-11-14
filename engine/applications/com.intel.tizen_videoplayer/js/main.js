/** 
 * @module VideoPlayer
 */


	var currentVideoTime = 0;
    var trakVideoTime = 120;
    var video;
    var startDuration;
    var statePauseBeforeMoving;
    var vp_filmArray = [] ;
    var currentTrackIndex = 3;
    var videoCarusel;
    var shufleMode = false;
/**
 * Class which provides methods to initialize UI of video player.
 * @class init
 * @constructor
 */
var init = function () {
	

	if (typeof tizen == 'undefined') {
		console.warn("Tizen API not found, linking stub APIs");
		$("<script type='text/javascript' src='../../tizenApplication.js'> </script>").appendTo("body");
	}


	if (typeof ThemeEngine != 'undefined') {
		var te = new ThemeEngine();
		te.addStatusListener(function (aData) {
			window.location.reload();
		});
	} else {
		console.error("ThemeEngine API is not available, please start IVI server.");
	}

	$("#topBarIcons").topBarIconsPlugin('init', 'videoplayer');
	$("#clockElement").ClockPlugin('init', 5);
	$("#clockElement").ClockPlugin('startTimer');
	$('#bottomPanel').bottomPanel('init');

	
	// main video control
	video = document.getElementById("video_frame");
	
	//prev button
	$('#videoButtons').append('<div id="video_prev_Button" class=\"button previousBtn controlsBtn\" ></div>');
	$('#video_prev_Button').on('click', function()
	{
		selectPrevTrack();
	});
	
	//pause button
	$('#videoButtons').append('<div id="video_pauseButton" class=\"button pauseBtn controlsBtn\" ></div>');
	$('#video_pauseButton').on('click', function()
	{
	   PauseVideo();	
	});
	
	//play button
	$('#videoButtons').append('<div id="video_playButton" class=\"button playBtn controlsBtn\" ></div>');
	$('#video_playButton').on('click', function()
	{
	   PlayVideo();	
	});
	
	//next button
	$('#videoButtons').append('<div id="video_next_Button" class=\"button nextBtn controlsBtn\" ></div>');
	$('#video_next_Button').on('click', function()
	{
		selectNextTrack();
	});
	
    //random button	
	$('#videoButtons').append('<div id="video_random_Button" class=\"button shuffleBtn controlsBtn\" ></div>');
	$('#video_random_Button').on('click', function()
	{
		var b = document.getElementById("video_random_Button");
		if(shufleMode)
		{
			b.setAttribute("class", "button shuffleBtn controlsBtn");
			shufleMode = false;
		}
		else
		{
			b.setAttribute("class", "button shuffleBtnActive controlsBtn");
			shufleMode = true;
		}
	});
	
	//listener of ending of track
	video.addEventListener('ended', function(){
          if(shufleMode)
          {
          	 currentTrackIndex = Math.floor((Math.random()*100) % 7);
          	 vp_ChangeVideoSrcByName(vp_filmArray[currentTrackIndex][3],currentTrackIndex);  
          }
          else
          {
          	 selectNextTrack();
          }
        
     });
	
	 //video time control
	 $('#videoTimeBar').videotimeProgressBar("init");
	 $('#videoTimeBar').bind('positionChanged', function (e, data) {
                        clearAnimateRange();
                        trakVideoTime = video.duration;
                        currentVideoTime = Math.floor(data.position * trakVideoTime);
                        updateTime(data.position*100,currentVideoTime);
                        movedRange(currentVideoTime);
                    });
                    
     //volume control
     $('#volumeControl').progressBarPlugin('init', 'volumeControl');
     $('#volumeControl').progressBarPlugin('setVolume', 100);
     setVideoVolume( 100 );
     
      $('#volumeControl').bind('volumeControlTouch', function (e, data) {
                        console.log("volumeControlTouch " + data.position);
                        setVideoVolume( data.position );

                    });
     //carousel
 	var CarouselItem = document.getElementById("CarouselItemID");
	var sett = new Ufrm3DCarouselsettings();
	videoCarusel = new Ufrm3DCarouselList(CarouselItem, sett);
	for(var nNum = 0; nNum < videoCarusel.getListSize(); nNum++)
		videoCarusel.updateListElement(nNum, 'source', vp_filmArray[nNum][1], 'The Best Of ' + nNum);
		
    $(videoCarusel.getListElement()).bind(CAROUSEL_ITEM_DCLICK, function(event){
         //selectHandler(event.item);
         //alert(vp_filmArray[event.item][3]);
         vp_ChangeVideoSrcByName(vp_filmArray[event.item][3],event.item);
	});
	     
		
    //animation
    $('#videoFrameArea').animate({ top: 18 }, 700, "linear", function()
			{
				//$('#videoTimeBar').style.visibility = "visible";
				timeBar = document.getElementById("videoTimeBar");
				timeBar.style.visibility = "visible"; 
			});
    
	$('#videoTimeBar').animate({ top: 380 }, 1100, "linear", function()
			{
				buttonBar = document.getElementById("videoButtons");
				buttonBar.style.visibility = "visible";
			});
	$('#videoButtons').animate({ top: 490 }, 1400, "linear", function()
			{

			});
			

	//LOCAL STORAGE
	var myData = JSON.parse(localStorage.getItem(VIDEO_PLAYER_LOCAL_DATA_NAME));
    if (myData == null)
    {
    	currentTrackIndex = 3;
    	vp_ChangeVideoSrcByName(vp_filmArray[currentTrackIndex][3],currentTrackIndex);
    	$('#volumeControl').progressBarPlugin('setVolume', 100);
        setVideoVolume( 100 );
    }
    else
    {
         vp_SetVideoFromLastMemory(myData.videoIndex, myData.time, myData.paused);
         $('#volumeControl').progressBarPlugin('setVolume', myData.volumeLevel*100);
         setVideoVolume( myData.volumeLevel*100 );
    }

};

//update time-slider
function updateTime(_position, _currentTime)
{
    $('#videoTimeBar').videotimeProgressBar("show", _position, _currentTime);
}

//update time slider
function updateTimeByCurrentTime(_currentTime)
{
    var _position = Math.floor(currentVideoTime / trakVideoTime *100);
    $('#videoTimeBar').videotimeProgressBar("show", _position, currentVideoTime, vp_filmArray[currentTrackIndex][2]);
}

/** 
 * JQuery method which invokes function callback after html document DOM is ready. 
 * @event $(document).ready
 * @param function() {Callback} Reference to callback function. 
 */
//$(document).ready(init);
$(document).ready(init);

/**
 * Store state of video before application closing.
 * @method window.onbeforeunload
 * @static
 **/
window.onbeforeunload = function () {
	vp_SaveDataToStorage();
}


var PlayVideo = this.PlayVideo = function()
{
   if(video.paused)
   {
      video.play();
      startDuration = setInterval(initDuration,1000/66);
   }
}

var PauseVideo = this.PauseVideo = function()
{
   if(!video.paused)
   {
      video.pause();
   }
   clearInterval(startDuration);
}

function initDuration()
{
  currentVideoTime = video.currentTime;
  trakVideoTime = video.duration;
  updateTimeByCurrentTime();
}

var startMovingVideo = this.startMovingVideo = function()
{
   currentVideoTime = video.currentTime;
   clearAnimateRange() ;
}

var finishRewMovingVideo = this.finishRewMovingVideo = function()
{
   finishMovingVideo(-10);
}

var finishFwMovingVideo = this.finishFwMovingVideo = function()
{
   finishMovingVideo(10);
}

function movedRange(time)
{
   video.currentTime = time;
   if (!statePauseBeforeMoving)
   {
	 PlayVideo();
   }
}

function selectPrevTrack()
{
	if(shufleMode)
    {
        currentTrackIndex = Math.floor((Math.random()*100) % 7);
    }
	else if (currentTrackIndex > 0)
	{
		currentTrackIndex --;
	}
	else
	{
		currentTrackIndex = (vp_filmArray.lenght - 1);
	}
	videoCarusel.selectItem(currentTrackIndex);
	vp_ChangeVideoSrcByName(vp_filmArray[currentTrackIndex][3],currentTrackIndex);
}

function selectNextTrack()
{
	
	
	if(shufleMode)
    {
        currentTrackIndex = Math.floor((Math.random()*100) % 7);
    }
	else if (currentTrackIndex < (vp_filmArray.lenght - 1))
	{
		currentTrackIndex ++;
	}
	else
	{
		currentTrackIndex = 0;
	}
	videoCarusel.selectItem(currentTrackIndex);
	vp_ChangeVideoSrcByName(vp_filmArray[currentTrackIndex][3],currentTrackIndex);
}

function finishMovingVideo(interval)
{
   currentVideoTime = currentVideoTime + interval;
   video.currentTime = currentVideoTime;
   updateTimeByCurrentTime();
   if (!statePauseBeforeMoving)
   {
    PlayVideo();
   }
}

function clearAnimateRange()
{
   clearInterval(startDuration);
   statePauseBeforeMoving = video.paused;
   PauseVideo();
}

function setVideoVolume( volume )
{
	if (volume > 100) {
       volume = 100;
    } else if (volume < 0) {
       volume = 0;
    }
    video.volume = volume/100;
}

function vp_ChangeVideoSrcByName(src, index)
{
 
  PauseVideo();
  video.src = src;
  video.addEventListener("canplay", function() {
  	                                 currentVideoTime = 0;
  	                                 trakVideoTime = video.duration;
  	                                 currentTrackIndex = index;
  	                                 video.currentTime = 0;
  	                                 videoCarusel.selectItem(currentTrackIndex);
  	                                 updateTimeByCurrentTime();
  	                                 PlayVideo();
                                     }, false);
						 
}

function vp_SetVideoFromLastMemory(index, time, paused)
{
 
  //PauseVideo();
  currentTrackIndex = index;
  video.src = vp_filmArray[currentTrackIndex][3];
  currentVideoTime = time;
  video.addEventListener("canplay", function() {
  	                                 video.currentTime = currentVideoTime;
  	                                 trakVideoTime = video.duration;
  	                                 currentTrackIndex = index;
  	                                 videoCarusel.selectItem(currentTrackIndex);
  	                                 updateTimeByCurrentTime();
  	                                 if(!paused)
  	                                   {
  	                                 	  PlayVideo();
  	                                   }
                                     }, false);
						 
}

function vp_SaveDataToStorage()
{
	/*
	 *var VIDEO_PLAYER_LOCAL_DATA_NAME = 'videoPlayerLocalDataId';
    */
   	var dataforStorage = new VideoPlayerData();
    dataforStorage.time = currentVideoTime;
    dataforStorage.name = vp_filmArray[currentTrackIndex][2];
    dataforStorage.paused = video.paused;
    dataforStorage.videoIndex = currentTrackIndex;
    dataforStorage.volumeLevel = video.volume;
    localStorage.setItem(VIDEO_PLAYER_LOCAL_DATA_NAME, JSON.stringify(dataforStorage));
}

function PlayPauseVideo()
{
	if(video.paused)
	{
	   PlayVideo();
	}
	else
	{
		PauseVideo();
	}
}


  //array of video-data
  vp_filmArray[0] = [0,"../../media/track_png/Big_Buny_0.png","Big Buck Bunny Loves","../../media/video/Big_Buck_Bunny.ogv"];
  vp_filmArray[1] = [1,"../../media/track_png/avatar1.png","James Cameron - Avatar","../../media/video/Avatar.ogv"];
  vp_filmArray[2] = [2,"../../media/track_png/AfterEarth2.png","After Earth Official Trailer","../../media/video/AfterEarth2.ogv"];
  vp_filmArray[3] = [3,"../../media/track_png/Big_Buny3.png","Big Buck Bunny","../../media/video/Big_Buny3.ogv"];
  vp_filmArray[4] = [4,"../../media/track_png/batman4.png","The Dark Knight Rises","../../media/video/batman4.ogv"];
  vp_filmArray[5] = [5,"../../media/track_png/Dackness5.png","Star Trek Into Darkness","../../media/video/Dackness5.ogv"];
  vp_filmArray[6] = [6,"../../media/track_png/JJ.png","G.I.Joe 2 - Retaliation","../../media/video/GIJoe6.ogv"];
  vp_filmArray.lenght = 7;

