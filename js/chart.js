const tareas = [{
	indice: 1,
	nombre: 'Tarea 1',
	duracion: 1,
	perecedera: []
}, {
	indice: 2,
	nombre: 'Tarea 2',
	duracion: 4,
	perecedera: [1]
}, {
	indice: 3,
	nombre: 'Tarea 3',
	duracion: 7,
	perecedera: [1]
}, {
	indice: 4,
	nombre: 'Tarea 4',
	duracion: 7,
	perecedera: [2]
}, {
	indice: 5,
	nombre: 'Tarea 5',
	duracion: 1,
	perecedera: [3]
}, {
	indice: 6,
	nombre: 'Tarea 6',
	duracion: 3,
	perecedera: [4]
}, {
	indice: 7,
	nombre: 'Tarea 7',
	duracion: 5,
	perecedera: [5]
}, {
	indice: 8,
	nombre: 'Tarea 8',
	duracion: 2,
	perecedera: [5]
}, {
	indice: 9,
	nombre: 'Tarea 9',
	duracion: 2,
	perecedera: [6]
}, {
	indice: 10,
	nombre: 'Tarea 10',
	duracion: 2,
	perecedera: [7, 8]
}, {
	indice: 11,
	nombre: 'Tarea 11',
	duracion: 2,
	perecedera: [9, 10]
}];
var TAREAS = {
	data: tareas
};
var escalaTiempo = 'meses';

function calcularFechaFinal(inicio, duracion) {
	const fechaInicio = new Date(2023, 0, 1 + inicio);
	if (escalaTiempo === 'dias') {
		return new Date(fechaInicio.getTime() + duracion * 24 * 60 * 60 * 1000);
	} else if (escalaTiempo === 'meses') {
		return new Date(fechaInicio.getFullYear(), fechaInicio.getMonth() + duracion, fechaInicio.getDate());
	}
}
let diaInicio = 0;
const datosGantt = tareas.map((tarea) => {
	const inicio = diaInicio;
	diaInicio += tarea.duracion;
	return {
		x: tarea.nombre,
		y: [
			new Date(2023, 0, 1 + inicio)
			.getTime(), calcularFechaFinal(inicio, tarea.duracion)
			.getTime()
		],
		// fillColor: tarea.perecedera.length > 0 ? 'red' : 'blue',
	};
});
const options = {
	series: [{
		data: datosGantt
	}],
	chart: {
		height: 350,
		type: 'rangeBar'
	},
	plotOptions: {
		bar: {
			horizontal: true
		}
	},
	xaxis: {
		type: 'datetime'
	},
};
const chart = new ApexCharts(document.getElementById('chart_div'), options);

function actualizarTablaYGrafico() {
	var tablaBody = document.getElementById("tabla-body");
	tablaBody.innerHTML = "";
	TAREAS.data.forEach(function(registro) {
		var fila = document.createElement("tr");
		fila.innerHTML = "<th class='w3-center'>" + registro.indice + "</td>" +
		"<td>" + registro.nombre + "</td>" +
		"<th class='w3-center'>" + registro.duracion + "</td>" +
		"<th class='w3-center'>" + registro.perecedera.join(", ") + "</td>";
		tablaBody.appendChild(fila);
	});
}
document.getElementById("formulario").addEventListener("submit", function(event) {
	event.preventDefault();
	IndiceAuto();
	var indice = parseInt(document.getElementById("indice").value);
	var nombre = document.getElementById("nombre").value;
	var duracion = parseInt(document.getElementById("duracion").value);
	var perecedera = document.getElementById("perecedera").value.split(",").map(function(item) {
		return parseInt(item.trim());
	});
	TAREAS.data.push({
		indice: indice,
		nombre: nombre,
		duracion: duracion,
		perecedera: perecedera
	});
	document.getElementById("formulario").reset();
	let diaInicio = 0;
	const datosGantt = TAREAS.data.map((tarea) => {
		const inicio = diaInicio;
		diaInicio += tarea.duracion;
		return {
			x: tarea.nombre,
			y: [
				new Date(2023, 0, 1 + inicio)
				.getTime(),
				calcularFechaFinal(inicio, tarea.duracion)
				.getTime()
			],
		};
	});
	const newOptions = {
		series: [{
			data: datosGantt
		}],
		chart: {
			height: 350,
			type: 'rangeBar'
		},
		plotOptions: {
			bar: {
				horizontal: true
			}
		},
		xaxis: {
			type: 'datetime'
		},
	};
	chart.updateOptions(newOptions);
	actualizarTablaYGrafico();
	IndiceAuto();
});

function IndiceAuto() {
	let indice = document.getElementById("indice");
	indice.value = TAREAS.data.length + 1;
	indice.disabled = true;
}
IndiceAuto();
chart.render();
actualizarTablaYGrafico();