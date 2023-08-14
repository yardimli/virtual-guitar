<?php
	require_once('simple_html_dom.php');

	function parse_chords($html)
	{

		$dom = str_get_html($html);

		$chord = explode(' ', $dom->find('.font-dinish', 0)->innertext, 2);

		if ($dom->find('.fret', 0)) {
			$startingFret = $dom->find('.fret', 0)->innertext;
		} else {
			return array('Chord' => $chord[0],
				'Variation' => $chord[1],
				'error' => 'No frets found');
		}


		$fingerings = array();
		$frets = array();
		foreach ($dom->find('.chords-header .chord-cell') as $cell) {
			$value = $cell->innertext;
			$fingerings[] = empty($value) ? '' : $value;
			$frets[] = empty($value) ? '' : $value;
		}


		foreach ($dom->find('.chords-grid div') as $cell) {
			preg_match('/chord-fret-(\d+)/', $cell->class, $fret);
			preg_match('/chord-string-(\d+)/', $cell->class, $string);
			if (empty($fret) || empty($string)) {
				return array('Chord' => $chord[0],
					'Variation' => $chord[1], 'error' => 'No frets or Strings found');
			}
			$frets[$string[1] - 1] = $fret[1];
			$fingerings[$string[1] - 1] = $cell->innertext;
		}
		for ($i = count($frets); $i < 6; $i++) {
			$frets[] = 'x';
		}

		// define your constants
		$tunings = ['E2', 'E2', 'A2', 'D3', 'G3', 'B3', 'E4'];
		$notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
		$stringNotes = [];

		// calculate the notes
		for ($t = 0; $t < count($tunings); $t++) {
			$startingNote = $tunings[$t][0];
			$idx = array_search($startingNote, $notes);
			$start_octave = (int)$tunings[$t][1];
			for ($octave = $start_octave; $octave < 8; $octave++) {
				for ($i = 0; $i < count($notes); $i++) {
					$stringNotes[$t][] = $notes[($i + $idx) % count($notes)] . $octave;
				}
			}
		}
		$chordNotes = array();
		foreach ($frets as $i => $fret) {
			$chordNotes[] = $fret == 'x' ? 'x' : $stringNotes[$i][(int)$startingFret + (int)$fret - 1];
		}

		return array(
			'Chord' => $chord[0],
			'Variation' => $chord[1],
			'StartingFret' => $startingFret,
			'Fingerings' => $fingerings,
			'Frets' => $frets,
			'Notes' => $chordNotes
		);
	}


	$chords = [];

	// Name of your CSV file
	$csvFile = 'guitar_chords.csv';

// Open the CSV file
	$handle = fopen($csvFile, 'r');

// Check if the file is opened successfully
	if ($handle === false) {
		die('Unable to open the file.');
	}

// Read the file line by line
	while (($data = fgetcsv($handle, 0, ",")) !== false) {
		// Process the data here. For example, you may insert the data into the database.
		// For now, let's just print the data.
//		print_r($data[6]);
		$chord = explode("\n", $data[2]);

		//		echo $chord[0].'<br>';
//		var_dump( parse_chords($data[6]) );

		$chord_str = $chord[0];
		if (substr($chord_str, -1) == 'b') {
			//skip this chord
		} else {
			$parsed = parse_chords($data[6]);
			$parsed['Root'] = $chord[0];
			$chords[] = $parsed;
		}
	}

// Close the opened CSV file
	fclose($handle);

	var_dump($chords);

	file_put_contents('guitar_chords_output.json', json_encode($chords, JSON_PRETTY_PRINT));


	exit();

	$html = '<h3 class="font-dinish text-24">G#minor9 Variation 2</h3><div class="frets"><div class="fret">11</div><div class="fret">12</div><div class="fret">13</div><div class="fret">14</div><div class="fret">15</div></div><div class="chords"><div class="chords-header"><div class="chord-cell">x</div><div class="chord-cell"></div><div class="chord-cell"></div><div class="chord-cell"></div><div class="chord-cell"></div><div class="chord-cell">x</div></div><div class="chords-grid"><div class="chord-fret-1 chord-string-2 chord-click">1</div><div class="chord-fret-3 chord-string-3 chord-click">3</div><div class="chord-fret-5 chord-string-4 chord-click">4</div><div class="chord-fret-2 chord-string-5 chord-click">2</div></div></div>';

	var_dump(parse_chords($html));

	//	<h3 class="font-dinish text-24">G#minor9 Variation 2</h3>
	//<div class="frets">
	//  <div class="fret">11</div>
	//  <div class="fret">12</div>
	//  <div class="fret">13</div>
	//  <div class="fret">14</div>
	//  <div class="fret">15</div>
	//</div>
	//<div class="chords">
	//  <div class="chords-header">
	//    <div class="chord-cell">x</div>
	//    <div class="chord-cell"></div>
	//    <div class="chord-cell"></div>
	//    <div class="chord-cell"></div>
	//    <div class="chord-cell"></div>
	//    <div class="chord-cell">x</div>
	//  </div>
	//  <div class="chords-grid">
	//    <div class="chord-fret-1 chord-string-2 chord-click">1</div>
	//    <div class="chord-fret-3 chord-string-3 chord-click">3</div>
	//    <div class="chord-fret-5 chord-string-4 chord-click">4</div>
	//    <div class="chord-fret-2 chord-string-5 chord-click">2</div>
	//  </div>
	//</div>
