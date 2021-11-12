'use strict'

const SERVER = 'http://localhost:3000'


window.addEventListener('load', () => {
    cargarDatos()
    setLiseteners()
})
//Metodos listener

function setLiseteners() {
    document.getElementById('new-student').addEventListener('submit', async (event) => {
        event.preventDefault()

        const newAlumno = {
            "nombre": document.getElementById('name').value,
            "apellido": document.getElementById('surname').value,
            "email": document.getElementById('email').value,
            "fecnac": document.getElementById('fecnac').value,
            "grupo": null
        }

        var addAlumno = await subirDatos(newAlumno)
        renderAlumno(addAlumno)
    })
    document.getElementById('del-student').addEventListener('submit', async (event) => {
        event.preventDefault()

        const id = Number(document.getElementById('id').value)
        try {
            await pedirDato(id)
        } catch (err) {
            renderErrorMessage('El alumno con id: ' + id + ' no existe')
            return
        }

        if (confirm('Estas seguro que deseas eliminar el alumno con id: ' + id + ' ?')) {
            try {
                await eliminarDatos(id)
                renderDelAlumno(id)
            } catch (err) {
                renderErrorMessage(err)
            } 
        }
    })
}
//Metodos para render

function renderAlumno(alumno) {
    const tbodyDeAlumnos = document.querySelector('div#alumnos tbody')
    const newAlumnoRow = document.createElement('tr')
    newAlumnoRow.id = 'al-' + alumno.id
    newAlumnoRow.innerHTML = `
        <th> ${alumno.id} </th>
        <th> ${alumno.nombre} </th>
        <th> ${alumno.email} </th>
        <th> ${alumno.fecnac} </th>
    `
    tbodyDeAlumnos.appendChild(newAlumnoRow)
}

function renderErrorMessage(message) {
    const divMessagesUI = document.getElementById('messages')
    const newMessageDiv = document.createElement('div')
    newMessageDiv.className = "col-sm-12 alert alert-danger alert-dismissible fade show"
    newMessageDiv.innerHTML = `
        <span><strong>ATENCIÓN: </strong>${message}</span>
        <button type="button" class="btn-close" data-bs-dismiss="alert" onclick="this.parentElement.remove()"></button>`
    
    divMessagesUI.appendChild(newMessageDiv)
}

function renderDelAlumno(id) {
    const delAlumnoRow = document.getElementById('al-' + id)
    delAlumnoRow.remove()
}
//Metodos API

async function cargarDatos() {
    try {
        let datosAlumnos = await pedirDatos()
        datosAlumnos.forEach( alumno => {renderAlumno(alumno)});
    } catch (err) {
        renderErrorMessage(err)
    }
}

async function pedirDatos() {
    const response = await fetch(SERVER + '/alumnos')
    const myData = await response.json()
    return myData
}

async function pedirDato(id) {
    const response = await fetch(SERVER + '/alumnos/' + id)
    const myData = await response.json()
    return myData
}

async function subirDatos(data) {
    const response = await fetch(SERVER + '/alumnos', {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    const myData = await response.json()
    return myData
}

async function eliminarDatos(id) {
    const response = await fetch(SERVER + '/alumnos/' + id , {
        method: 'DELETE',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    const myData = await response.json()
    return myData
}