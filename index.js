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

app.get('/api/cohorts', async (req, res, next) => {
    try {
        const cohortsArr = await db('cohorts');
        res.json(cohortsArr);
    } catch {
        next(error500);
    }
})

app.get('/api/cohorts/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const singleCohortArr = await db('cohorts').where({ id });
        singleCohortArr.length
            ? res.json(singleCohortArr[0])
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
        const idArr = await db('cohorts').insert(req.body);
        const singleCohortArr = await db('cohorts').where({ id: idArr[0] });
        res.json(singleCohortArr[0])
    } catch {
        next(error500);
    }
})

app.put('/api/cohorts/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const isUpdated = await db('cohorts').where({ id }).update(req.body);
        const singleCohortArr = await db('cohorts').where({ id });
        isUpdated
            ? res.json(singleCohortArr[0])
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



app.use(errors.defaultError);

app.listen(5000, () => console.log('port 5000'));