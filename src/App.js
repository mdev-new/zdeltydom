import './App.css';

import Button from '@mui/material/Button';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import React, { useState } from 'react';

import { Helmet } from "react-helmet";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Slide from '@mui/material/Slide';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

import SearchIcon from '@mui/icons-material/Search';

import IconButton from '@mui/material/IconButton';


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { jizdni_rad } from './jr.js'

const destinace = [
        "Pardubice",
        "Hradec Králové hl.n.",
       // "Opatovice nad Labem",
       // "Kolín",
       // "Choceň",
       // "Ústí nad Orlicí",
        "Všestary",
       // "Žamberk",
       // "Přelouč",
       // "Chrudim"
];

const hours_minutes = (mins) => `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`


const closest = (array, pivot) => [array.filter(e => (e > pivot)/* && Math.abs(e-pivot) < 4*60*/)[0]];

const capitalizeFirst = (text) => text.charAt(0).toUpperCase() + text.slice(1)


function najdi(zacatek, konec, cas) {

	if(!(zacatek in jizdni_rad)) return null;

	let linka = jizdni_rad[zacatek]; // toto je garantovano

	let casy = linka.map(odjezd => odjezd.cas);
	let odjezdy = casy.filter(o => o >= cas);

	let _moznosti = {}

	for(const odjezd of odjezdy) {

		let indexSpoje = linka.findIndex(p => p.cas == odjezd)
		if(indexSpoje == -1) return null; // dnes uz nic nejede

		let spoj = linka[indexSpoje];
		let typ = capitalizeFirst(spoj.typ)
		let zastavky = spoj.zastavky

		if(spoj.typ == "trol" || spoj.typ == "bus") {
			if(spoj.typ == "trol") typ = "Trolejbus";
			else if(spoj.typ == "bus") typ = "Autobus";
			typ += " " + spoj.cislo_linky;
		}

		let cesta = [[typ, `${hours_minutes(spoj.cas)}`, `${hours_minutes(spoj.cas+spoj.delka_jizdy)}`], [...zastavky]]//.slice(zastavky.indexOf(zacatek))

		for(const stanice of zastavky.slice(1)) {

			if(stanice == konec) {
				_moznosti[stanice] = cesta;
				break;
			}

			let s = (typeof jizdni_rad[stanice] == 'string') ? jizdni_rad[stanice] : stanice;

			let found = najdi(s, konec, spoj.cas + spoj.delka_jizdy)

			if(found != null) {
				if(!(s in _moznosti)) {
					_moznosti[s] = {prijezd: [], odjezd: []};
				}

				_moznosti[s].prijezd.push([cesta]);
				_moznosti[s].odjezd.push(found);
			}

		}

	}

	return _moznosti;

}

function najdi_spojeni (destinace, controls) {

	if(destinace == "Pardubice") {
		controls.setDlgTitle("Jseš kokot?");
		controls.setDlgContent("Podívej se z okna nebo na mapu a MOŽNÁ ti dojde proč jseš debil...");
		controls.setOpen(true);
		return;
	} else if(destinace == "") {
		controls.setDlgTitle("Jseš kokot?");
		controls.setDlgContent("Zadej kam chceš jet trotle, nebo tě pošlu za vránama");
		controls.setOpen(true);
		return;
	}

	let today = new Date();
	let time = today.getHours() * 60 + today.getMinutes();
 
	let cesty = {};
	cesty["Pardubice-Pardubičky"] = (najdi("Pardubice-Pardubičky", destinace, time));
	cesty["K Nemocnici"]          = (najdi("K Nemocnici"         , destinace, time));
	cesty["Štrossova"]            = (najdi("Štrossova"           , destinace, time));
	cesty["Na Okrouhlíku"]        = (najdi("Na Okrouhlíku"       , destinace, time));

	console.log(cesty)

	controls.setResult(cesty)

};

function ziskejCesty(root, cesta = []) {

}

function DestinationSelector({setDest}) {
	return (
	<Autocomplete
		disablePortal
		id="destination-input"
		options={destinace}
		onChange={(event, value) => setDest(value)}
		sx={{ width: 300 }}
		renderInput={(params) => <TextField {...params} label="Destinace" />}
	/>
	);
}

function App() {

	const [selectedDest, setSelectedDest] = useState("");
	const [open, setOpen] = useState(false);
	const [dlgContent, setDlgContent] = useState("");
	const [dlgTitle, setDlgTitle] = useState("");

	const [result, setResult] = useState([]);

	const handleClose = () => setOpen(false);

	return (
	<div className="application">
	<Helmet>
		<meta charSet="utf-8" />
		<title>Hledání spojení</title>
	</Helmet>

	<div
		className="App"
		style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'column'
		}}
	>

	<h1>
		Delta Jede Domů
	</h1>

	<h2>
		Najdi si efektivní spojení domů
	</h2>

	{/* Dialog pro kokoty */}
	<Dialog
		open={open}
		onClose={handleClose}
	>
		<DialogTitle>
			{ dlgTitle }
		</DialogTitle>
		<DialogContent>
			<DialogContentText className="box">
				{ dlgContent }
			</DialogContentText>
		</DialogContent>
		<DialogActions>
			<Button variant="contained" disableElevation onClick={handleClose}>OK</Button>
		</DialogActions>
	</Dialog>

	<Stack direction="row" spacing={2}>
		<DestinationSelector setDest={setSelectedDest} />
		<Button
			variant="contained"
			size="small"
			onClick={() => najdi_spojeni(selectedDest, {setOpen, setDlgTitle, setDlgContent, setResult})}
		>
			<SearchIcon />
		</Button>
	</Stack>

	</div>

	<br />
	<br />

	<Grid container spacing={4} justifyContent="center" alignItems="flex-start">
	{
		Object.entries(result).map(([stanice, data]) => (
			<Grid item>
			<TableContainer component={Paper} sx={{ margin: 'auto' }}>
				<TableHead>
					<TableRow>
							<TableCell align="center"><b>Typ spoje</b></TableCell>
							<TableCell align="center"><b>Čas odjezdu</b></TableCell>
							<TableCell align="center"><b>Čas příjezdu</b></TableCell>
							{/*<TableCell align="right">Doba trvání</TableCell>*/}
							<TableCell align="center"><b>Trasa</b></TableCell>
						</TableRow>
					</TableHead>
				<Table size="small">
				<caption>Výchozí zastávka: {stanice} {(data.length <= 0) ? " - Spojení nenalezeno!" : ""}</caption>
				{/*
					(trasa.length > 0) ? (
					<>
						<TableBody>
							{
								trasa.map((spoj) => (
									<TableRow>
										<TableCell align="center">{spoj[0]}</TableCell>
										<TableCell align="center">{spoj[1]}</TableCell>
										<TableCell align="center">{spoj[2]}</TableCell>
										<TableCell align="center">{[spoj[3][0], spoj[3][spoj[3].length - 1]].join(' - ')}</TableCell>
									</TableRow>
								))
							}
						</TableBody>
					</>) : <></>
				*/}
				</Table>
			</TableContainer>
			</Grid>
		))
	}
	</Grid>

	</div>
	);
}

export default App;
