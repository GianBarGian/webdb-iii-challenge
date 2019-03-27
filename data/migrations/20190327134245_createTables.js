
exports.up = function(knex, Promise) {
    const createCohortsTable = () => {
        return knex.schema.createTable('cohorts', table => {
            table.increments();
            table.string('name', 128).notNullable;
            table.timestamps(true, true);
        });
    }
    const createStudentsTable = () => {
        return knex.schema.createTable('students', table => {
            table.increments();
            table.string('name', 128).notNullable;
            table
                .int('cohort_id')
                .unsigned()
                .references('id')
                .inTable('cohorts')
                .onDelete('CASCADE')
                .onUpdate('CASCADE');
            table.timestamps(true, true);
        })
    }

    return createCohortsTable()
        .then(createStudentsTable);
};

exports.down = function(knex, Promise) {
  const dropCohortsTable = () => {
      return knex.schema.dropTableIfExists('cohorts');
  }
  const dropStudentsTable = () => {
      return knex.schema.dropTableIfExists('students');
  }

  return dropCohortsTable()
    .then(dropStudentsTable);
};
