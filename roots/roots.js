const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const PersonFilePath = path.join(__dirname, '..', 'db', 'db_person.json');
const debug = require('debug')('app:routes');

const SuccessesFilePath = path.join(__dirname, '..', 'db', 'Successes.json');


router.get('/', (req, res) => {
    debug('GET /');
    res.render ('index');   
});


// Ruta para buscar personas por edad en días
router.get('/buscar', (req, res) => {
    const edadAnios = parseInt(req.query.edad); // Convertir a entero
    if (isNaN(edadAnios) || edadAnios <= 0) {
        return res.status(400).send('La edad ingresada no es válida.');
    }

    // Convertir edad de años a días
    const edadDias = edadAnios * 365;

    // Leer el archivo JSON de personas
    fs.readFile(PersonFilePath, 'utf8', (err, data) => {
        if (err) {
            debug('Error al leer el archivo de personas: %O', err);
            return res.status(500).send('Error al leer el archivo de personas.');
        }

        // Parsear los datos existentes
        const personas = JSON.parse(data);

        // Filtrar personas por edad en días
        const personasFiltradas = personas.filter(persona => {
            // Calcular la edad en días
            const edadPersonaDias = persona.edad * 365;
            return edadPersonaDias > edadDias; // Filtrar mayores a la edad ingresada
        });

        debug('Personas encontradas por edad en días: %O', personasFiltradas);

        // Renderizar la vista con los resultados
        res.render('resultados', { personas: personasFiltradas });
    });
});


router.post('/submit', (req, res) => {
    const newPerson = req.body;
    debug('Solicitud POST recibida en /submit con datos: %O', newPerson);

    // Leer el archivo JSON existente
    fs.readFile(PersonFilePath, 'utf8', (err, data) => {
        if (err) {
            debug('Error al leer el archivo de personas: %O', err);
            return res.status(500).send('Error al leer el archivo de personas.');
        }

        // Parsear los datos existentes
        const personas = JSON.parse(data);
        debug('Personas existentes cargadas: %O', personas);

        // Crear una nueva persona con un ID único
        const newId = personas.length ? personas[personas.length - 1].id + 1 : 1;
        const personToSave = {
            id: newId,
            ...newPerson
        };

        // Agregar la nueva persona al array
        personas.push(personToSave);
        debug('Nueva persona agregada: %O', personToSave);

        // Guardar el archivo JSON actualizado
        fs.writeFile(PersonFilePath, JSON.stringify(personas, null, 2), 'utf8', (err) => {
            if (err) {
                debug('Error al guardar el archivo de personas: %O', err);
                return res.status(500).send('Error al guardar el archivo de personas.');
            }

            debug('Archivo de personas actualizado con éxito');
            // Renderizar la vista de éxito
            res.render('success');
        });
    });
});


// Middleware para guardar la hora y el tipo de petición en successes.json
router.use((req, res, next) => {
    const successData = {
        time: new Date().toISOString(),
        method: req.method
    };

    // Leer el archivo JSON de éxitos
    fs.readFile(SuccessesFilePath, 'utf8', (err, data) => {
        if (err) {
            debug('Error al leer el archivo de éxitos: %O', err);
            return res.status(500).send('Error al leer el archivo de éxitos.');
        }

        // Parsear los datos existentes
        const successes = JSON.parse(data);

        // Agregar el nuevo éxito al array
        successes.push(successData);
        debug('Nuevo éxito agregado: %O', successData);

        // Guardar el archivo JSON actualizado
        fs.writeFile(SuccessesFilePath, JSON.stringify(successes, null, 2), 'utf8', (err) => {
            if (err) {
                debug('Error al guardar el archivo de éxitos: %O', err);
                return res.status(500).send('Error al guardar el archivo de éxitos.');
            }

            debug('Archivo de éxitos actualizado con éxito');
            next();
        });
    });
});


module.exports = router;