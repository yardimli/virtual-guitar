let fretCount = 20;
let guitarStrings = [
	'E2', 'A2', 'D3', 'G3', 'B3', 'E4'
];
let instrument_name = 'acoustic_guitar_steel';

let thick_top = false;
let dark_theme = false;

let guitarStringStartPositions = [
	{x: 0, y: 34, angle: -1},
	{x: 0, y: 65, angle: -0.5},
	{x: 0, y: 99, angle: -0.1},
	{x: 0, y: 132, angle: 0.25},
	{x: 0, y: 167, angle: 0.55},
	{x: 0, y: 198, angle: 0.9},
	{x: 0, y: 500, angle: 0}
];


let guitarFretPositions = [40, 180, 500, 770, 1050, 1320, 1540, 1780, 2000, 2200, 2400, 2580, 2760, 2920, 3070, 3230, 3350, 3510, 3630, 3750, 3860];

let sustain = 2.5;

function getNoteSequence(startingNote, n) {
	let notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
	
	// Find octave and note
	let note = startingNote.slice(0, -1);
	let octave = parseInt(startingNote.slice(-1), 10);
	
	let output = [];
	output.push(startingNote);
	
	let noteIdx = notes.indexOf(note);
	
	for (let i = 0; i < n; i++) {
		noteIdx++;
		// Check if we need to increment the octave
		if (noteIdx >= notes.length) {
			noteIdx = 0;
			octave++;
		}
		
		output.push(notes[noteIdx] + octave);
	}
	
	return output;
}

function playMidi(note) {
	var delay = 0; // play one note every quarter second
	var velocity = 127; // how hard the note hits
	MIDI.setVolume(0, 255);
	console.log(note);
	
	note = note.replace('F#', 'Gb');
	note = note.replace('G#', 'Ab');
	note = note.replace('A#', 'Bb');
	note = note.replace('C#', 'Db');
	note = note.replace('D#', 'Eb');
	
	MIDI.noteOn(0, MIDI.keyToNote[note], velocity, delay);
	MIDI.noteOff(0, MIDI.keyToNote[note], delay + sustain);
}

function refreshFretboard() {
	$("#fret_board").html('');
	$('#fret_board').removeClass('fret_board_light_thick_top');
	$('#fret_board').removeClass('fret_board_dark_thick_top');
	$('#fret_board').removeClass('fret_board_light_thick_bottom');
	$('#fret_board').removeClass('fret_board_dark_thick_bottom');
	
	$("#major-selector").val('');
	$("#minor-selector").val('');
	$("#d7-selector").val('');
	
	var guitarStringsToUse = guitarStrings;
	if (thick_top) {
		$('#fret_board').addClass(dark_theme ? 'fret_board_dark_thick_top' : 'fret_board_light_thick_top');
	} else {
		$('#fret_board').addClass(dark_theme ? 'fret_board_dark_thick_bottom' : 'fret_board_light_thick_bottom');
		guitarStringsToUse = [...guitarStrings].reverse();
	}


// Add a row for each string
	for (let row_counter = 0; row_counter < guitarStringsToUse.length; row_counter++) {
		$("#fret_board").append("<div style='white-space: nowrap; position: absolute; top:" + guitarStringStartPositions[row_counter].y + "px; left:" + guitarStringStartPositions[row_counter].x + "px;' id='row_" + row_counter + "'></div>");
		
		let fret_btn_mute = "<div class='form-check form-switch' style='position: absolute; left:0px; top:" + guitarStringStartPositions[row_counter].y + "px;'>" +
			"<input class='form-check-input fret_mute_btn' data-row_id='" + row_counter + "'  checked type='checkbox' role='switch' style='width:30px; height: 30px;' id='mute_row_" + row_counter + "'></div>";
		$("#row_" + row_counter).append(fret_btn_mute);
		
		
		let frets = getNoteSequence(guitarStringsToUse[row_counter], fretCount);
		for (let fret_counter = 0; fret_counter < frets.length; fret_counter++) {
			
			// Convert the angle from degrees to radians
			let angleInRadians = guitarStringStartPositions[row_counter].angle * Math.PI / 180
			// Calculate the y position
			let yPosition = Math.tan(angleInRadians) * guitarFretPositions[fret_counter] + guitarStringStartPositions[row_counter].y
			
			let button_active = '';
			if (fret_counter === 0) {
				button_active = ' activeBtn';
			}
			
			let stringNameHTML = frets[fret_counter].replace(/(\d+)/g, "<sub>$1</sub>");
			stringNameHTML = stringNameHTML.replace('#', '♯');
			
			let fret_btn = "<div style='position: absolute; left:" + guitarFretPositions[fret_counter] + "px; top:" + yPosition + "px;' class='btn btn-primary fret_btn string_" + row_counter + " " + button_active + "' data-row_id='" + row_counter + "' data-fret='" + frets[fret_counter] + "'>" + stringNameHTML + "</div>";
			$("#row_" + row_counter).append(fret_btn);
			
			
		}
	}
	fret_counter = 0;
	
	// Add a row for fret numbers
	$("#fret_board").append("<div style='white-space: nowrap; position: absolute; top:" + guitarStringStartPositions[guitarStrings.length].y + "px; left:" + guitarStringStartPositions[guitarStrings.length].x + "px;' id='row_" + guitarStrings.length + "'><div style='width:100px; display: inline-block;'></div></div>");
	
	for (let i = 1; i <= fretCount; i++) {
		fret_counter++;
		let btn = "<div style='background-color: #ccc; padding-left:10px; border-radius: 3px; padding-right: 10px; position: absolute; left:" + (guitarFretPositions[fret_counter] + 15) + "px; top:5px;' data-row_id='" + guitarStrings.length + "'>" + i + "</div>";
		$("#row_" + guitarStrings.length).append(btn);
	}
	
	// When a button is clicked...
	$(".fret_btn").off('click').on('click', function () {
		
		playMidi($(this).data('fret'));
		
		// Deselect (remove the 'activeBtn' class from) all other buttons in the row
		$('.string_' + $(this).data('row_id')).removeClass('activeBtn');
		// Select (add the 'activeBtn' class to) the clicked button
		$(this).addClass('activeBtn');
	});
	
	$(".fret_mute_btn").off('click').on('click', function () {
		//toggle mute
		if (!$(this).is(':checked')) {
			$('.string_' + $(this).data('row_id')).addClass('muted');
		} else if ($(this).is(':checked')) {
			$('.string_' + $(this).data('row_id')).removeClass('muted');
		}
	});
}

function loadInstrument(instrumentName) {
	MIDI.loadResource({
		instrument: instrumentName,
		onprogress: function (state, percent) {
			console.log(state, percent);
		},
		onsuccess: function () {
			MIDI.programChange(0, MIDI.GM.byName[instrumentName].number);
		}
	})
}

function strum(direction) {
	if (direction === 'down') {
		var delayTime = 0; // Set initial delay time
		for (let i = 0; i < 6; i++) {
			let btn = $('#row_' + i).find('.activeBtn');//.data('fret');
			if (!btn.hasClass('muted')) {
				setTimeout(function () {
					btn.click();
				}, delayTime);
				
				delayTime += 50; // Increase delay time after each loop iteration
			}
		}
	} else if (direction === 'up') {
		var delayTime = 0; // Set initial delay time
		for (let i = 5; i >= 0; i--) {
			let btn = $('#row_' + i).find('.activeBtn');//.data('fret');
			if (!btn.hasClass('muted')) {
				setTimeout(function () {
					btn.click();
				}, delayTime);
				
				delayTime += 50; // Increase delay time after each loop iteration
			}
		}
	}
}

$(document).ready(function () {
	
	// Fetch data from a JSON file
	fetch('tunings.json')
		.then(response => response.json())
		.then(data => {
			// Get the dropdown element
			const dropdown = document.getElementById('tuning-selector');
			
			// Iterate through each item in the data array
			data.forEach(item => {
				// Create a new option element
				const option = document.createElement('option');
				option.value = item.notes;
				option.textContent = `${item.instrument} ${item.name} ${item.notes}`;
				
				// Append the option to the dropdown
				dropdown.append(option);
			});
		})
		.catch(error => console.error(error)); // handle error if any
	
	var allButtons = Array.from(document.getElementsByClassName("chord_btn"));
	
	fetch('chords.json')
		.then(response => response.json())
		.then(data => {
			var allData = [...data.MajorChords, ...data.MinorChords, ...data.DominantSeventhChords];
			
			allData.forEach(item => {
				// find the button that corresponds to this chord
				var correspondingButton = allButtons.find(button => button.textContent === item.Chord);
				
				// if a corresponding button was found, add the data-strings attribute to it
				if (correspondingButton) {
					correspondingButton.setAttribute('data-strings', item.Strings.join(','));
				}
			});
		})
		.catch(error => console.error(error)); // handle error if any
	
	
	MIDI.loadPlugin({
		soundfontUrl: "./soundfont/MusyngKite/",
		instrument: instrument_name,
		onprogress: function (state, progress) {
			console.log(state, progress);
		},
		onsuccess: function () {
			MIDI.programChange(0, MIDI.GM.byName[instrument_name].number);
			console.log('MIDI loaded');
		}
	});
	
	refreshFretboard();
	
	$("#tuning-selector").change(function () {
		let tuning = $(this).val();
		guitarStrings = tuning.split(' ');
		refreshFretboard();
	});
	
	$(".chord_btn").on('click',function () {
		let chord = $(this).data('strings');
		let chordStrings = chord.split(',');
		console.log(chordStrings);
		
		if (!thick_top) {
			chordStrings = chordStrings.reverse();
		}
		
		for (let i = 0; i < chordStrings.length; i++) {
			
			$("#mute_row_" + i).prop('checked', false);
			$('#row_' + i).find('.activeBtn').removeClass('activeBtn');
			$('#row_' + i).find('.fret_btn').each(function () {
				if ($(this).data('fret') === chordStrings[i]) {
					$("#mute_row_" + i).prop('checked', true);
					$(this).addClass('activeBtn');
				}
			});
		}
		
		strum('up');
		
	});
	
	$("#instrument-selector").on('change', function () {
		instrument_name = $(this).val();
		loadInstrument(instrument_name);
	});
	
	$("#theme-selector").on('change', function () {
		dark_theme = $(this).val() === 'dark';
		refreshFretboard();
	});
	
	$("#strum_down").click(function () {
		strum('down');
	});
	
	$("#strum_up").click(function () {
		strum('up');
	});
	
	$("#reverse_direction").on('click', function () {
		thick_top = !$(this).is(':checked');
		refreshFretboard();
	});
	
	document.addEventListener('keydown', function (event) {
		if (event.key >= '1' && event.key <= '6') {
			
			var active_row = event.key - 1;
			let activeBtn = $('#row_' + active_row).find('.activeBtn');//.data('fret');
			activeBtn.click();
			
		} else if (['a', 's', 'd', 'w'].includes(event.key)) {
			if (event.key === 's') {
				strum('down');
			}
			if (event.key === 'w') {
				strum('up');
			}
			
			// callFunction(event.key);
		}
	});
	
});
