
exports.seed = function(knex, Promise) {
  return knex('students').del()
    .then(function () {
      return knex('students').insert([
        {cohort_id: 1, name: 'Giacomo'},
        {cohort_id: 1, name: 'Connor'},
        {cohort_id: 1, name: 'Maxime'},
        {cohort_id: 1, name: 'Diana'},
        {cohort_id: 1, name: 'Sean'},
        {cohort_id: 1, name: 'Mark'},
        {cohort_id: 1, name: 'Anthony'}
      ]);
    });
};
