const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile').development;
const errors = require('./middlewares/errors');

const db = knex(knexConfig);
const app = express();

const error500 = {
    status: 500,
    message: "something went wrong",
};

const error404 = {
    status: 404,
    message: "Selected Id doesn't exists!"
}

app.use(helmet());
app.use(express.json());

//COHORTS ENDPOINTS

app.get('/api/cohorts', async (req, res, next) => {
    try {
        const cohortsArr = await db('cohorts').select('id', 'name');
        res.json(cohortsArr);
    } catch {
        next(error500);
    }
})

app.get('/api/cohorts/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const singleCohort = await db('cohorts').select('id', 'name').where({ id }).first();
        singleCohort
            ? res.json(singleCohort)
            : next(error404);
    } catch {
        next(error500);
    }
})

app.get('/api/cohorts/:id/students', async (req, res, next) => {
    const { id } = req.params;

    try {
        const studentsArr = await db('students')
                                    .select('students.id', 'students.name')
                                    .innerJoin('cohorts', 'students.cohort_id', 'cohorts.id')
                                    .where({ 'cohort_id': id });
        studentsArr.length
            ? res.json(studentsArr)
            : next({
                status: 404,
                message: "Selected Id doesn't exists or there are no students here"
            }); 
    } catch {
        next(error500);
    }
})

app.post('/api/cohorts', async (req, res, next) => {
    try {
        const id = await db('cohorts').insert(req.body).first();
        const singleCohort = await db('cohorts').select('id', 'name').where({ id }).first();
        res.json(singleCohort)
    } catch {
        next(error500);
    }
})

app.put('/api/cohorts/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const isUpdated = await db('cohorts').where({ id }).update(req.body);
        const singleCohort = await db('cohorts').select('id', 'name').where({ id }).first();
        isUpdated
            ? res.json(singleCohort)
            : next(error404);
    } catch {
        next(error500);
    }
})

app.delete('/api/cohorts/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const isDeleted = await db('cohorts').where({ id }).del()
        isDeleted
            ? res.json({ message: "Delete succesful" })
            : next(error404);
    } catch {
        next(error500);
    }
})

// STUDENTS ENDPOINTS

app.get('/api/students', async (req, res, next) => {
    try {
        const studentsArr = await db('students').select('id', 'name');
        res.json(studentsArr);
    } catch {
        next(error500);
    }
})

app.get('/api/students/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const singleStudent = await db('students').select('id', 'name').where({ id }).first;
        singleStudent
            ? res.json(singleStudent)
            : next(error404);
    } catch {
        next(error500);
    }
})

app.post('/api/students', async (req, res, next) => {
    try{
        const id = await db('students').insert(req.body).first();
        const singleStudent = await db('students').select('id', 'name').where({ id }).first();
        res.json(singleStudent);
    } catch {
        next(error500);
    }
})

app.put('/api/students/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const isUpdated = await db('students').where({ id }).update(req.body)
        const singleStudent = await db('students').select('id', 'name').where({ id }).first();
        isUpdated
            ? res.json(singleStudent)
            : next(error404);
    } catch {
        next(error500);
    }
})

app.delete('/api/students/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const isDeleted = await db('students').where({ id }).del();
        isDeleted
            ? res.json({ message: "Delete succesful" })
            : next(error404);
    } catch {
        next(error500);
    }
})

app.use(errors.defaultError);

app.listen(5000, () => console.log('port 5000'));