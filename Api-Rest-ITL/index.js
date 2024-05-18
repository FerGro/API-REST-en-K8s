import express from 'express';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 80;  // Asegúrate de que el puerto es 80

app.use(express.json());

const readData = () => {
    try {
        const data = fs.readFileSync('./db.json');
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync('./db.json', JSON.stringify(data, null, 2));
    } catch (error) {
        console.log(error);
    }
};

app.get('/', (req, res) => {
    res.send('API REST ITL con Node.js');
});

app.get('/Carreras', (req, res) => {
    const data = readData();
    res.json(data.Carreras);
});

app.get('/Carreras/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const carrera = data.Carreras.find((carrera) => carrera.id === id);
    if (carrera) {
        res.json(carrera);
    } else {
        res.status(404).json({ message: 'Carrera no encontrada' });
    }
});

app.post('/Carreras', (req, res) => {
    const data = readData();
    const body = req.body;
    const newCarrera = {
        id: data.Carreras.length + 1,
        ...body,
    };
    data.Carreras.push(newCarrera);
    writeData(data);
    res.status(201).json(newCarrera);
});

app.put('/Carreras/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const carreraIndex = data.Carreras.findIndex((carrera) => carrera.id === id);
    if (carreraIndex === -1) {
        res.status(404).json({ message: 'Carrera no encontrada' });
        return;
    }
    data.Carreras[carreraIndex] = { ...data.Carreras[carreraIndex], ...req.body };
    writeData(data);
    res.json({ message: 'Carrera actualizada con éxito' });
});

app.delete('/Carreras/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const carreraIndex = data.Carreras.findIndex((carrera) => carrera.id === id);
    if (carreraIndex === -1) {
        res.status(404).json({ message: 'Carrera no encontrada' });
        return;
    }
    data.Carreras.splice(carreraIndex, 1);
    writeData(data);
    res.json({ message: 'Carrera eliminada con éxito' });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
