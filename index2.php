<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8"/>

	<meta name="viewport" content="width=device-width, initial-scale=1">
	<!-- Bootstrap CSS -->
	<link href="css/bootstrap.min.css" rel="stylesheet">
	<script src="js/bootstrap.bundle.min.js"></script>
	<script src="js/code.jquery.com_jquery-3.7.0.min.js"></script>

	<link href="css/guitar.css" rel="stylesheet">


	<!-- polyfill -->
	<script src="inc/shim/Base64.js" type="text/javascript"></script>
	<script src="inc/shim/Base64binary.js" type="text/javascript"></script>
	<script src="inc/shim/WebAudioAPI.js" type="text/javascript"></script>
	<!-- midi.js package -->
	<script src="js/midi/audioDetect.js" type="text/javascript"></script>
	<script src="js/midi/gm.js" type="text/javascript"></script>
	<script src="js/midi/loader.js" type="text/javascript"></script>
	<script src="js/midi/plugin.audiotag.js" type="text/javascript"></script>
	<script src="js/midi/plugin.webaudio.js" type="text/javascript"></script>
	<script src="js/midi/plugin.webmidi.js" type="text/javascript"></script>
	<!-- utils -->
	<script src="js/util/dom_request_xhr.js" type="text/javascript"></script>
	<script src="js/util/dom_request_script.js" type="text/javascript"></script>

	<script src="js/guitar.js" type="text/javascript"></script>
</head>

<body>
<div style="background-color: rgb(59, 130, 246); height: 130px;">
	<h1 class="text-white text-center pt-4 fw-bold" style="font-size:3rem; font-family: ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;">ScoreWind Guitar</h1>
</div>
<div class="m-3 text-center">

	<div class="row mb-3">
		<div class="col-2 text-center">
			<span class="fw-bold">TUNING</span><br>
			<select class="form-control" id="tuning-selector">
				<option>Please select a tuning</option>
			</select>
		</div>
		<div class="col-2 text-center">
			<span class="fw-bold">SOUND</span><br>
			<select class="form-control" id="instrument-selector">
				<option value="acoustic_guitar_nylon">Acoustic Guitar Nylon</option>
				<option value="acoustic_guitar_steel" >Acoustic Guitar Steel</option>
				<option value="electric_guitar_clean" >Electric Guitar Clean</option>
				<option value="electric_guitar_jazz">Electric Guitar Jazz</option>
				<option value="electric_bass_finger">Electric Bass Finger</option>
				<option value="electric_bass_pick">Electric Bass Pick</option>
				<option value="banjo">Banjo</option>
				<option value="viola">Viola</option>
				<option value="violin">Violin</option>
			</select>
		</div>
		<div class="col-1 text-center">
			<span class="fw-bold">THEME</span><br>
			<select class="form-control" id="theme-selector">
				<option value="light">Light</option>
				<option value="dark">Dark</option>
			</select>
		</div>
		<div class="col-2 text-center">
			<span class="fw-bold">STRUM</span><br>
			<div class="btn btn-danger" id="strum_down">Strum Down</div>
			<div class="btn btn-danger" id="strum_up">Strum Up</div>
		</div>
		<div class="col-2 text-center">
			<span class="fw-bold">REVERSE</span><br>
			<div class="form-check form-switch d-inline-block">
				<input class="form-check-input" type="checkbox" role="switch" id="reverse_direction" style="width:50px; height: 30px;">
			</div>
		</div>
	</div>


	<div class="mb-5" id="fret_board_container" style="display: inline-block; width: calc(100vw - 200px); height: 550px; overflow: auto; ">
		<div id="fret_board" class="fret_board_light"></div>
	</div>

</div>
</body>
</html>
