const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false
    },
});

pool.connect()
    .then(client => {
      console.log('Connected to PostgreSQL');
      
      return client.query(`SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name   = 'emails'
      ) AS exists;`)
        .then(result => {
          const exists = result.rows[0].exists;
          if (!exists) {
            return client.query(`CREATE TABLE emails (
              id SERIAL PRIMARY KEY,
              recipient TEXT NOT NULL,
              subject TEXT NOT NULL,
              content TEXT NOT NULL,
              status TEXT NOT NULL CHECK (status IN ('sent', 'scheduled')),
              schedule_time TIMESTAMP DEFAULT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`)
              .then(() => {
                console.log('Table created');
                client.release();
              })
              .catch(err => {
                console.error('Error creating table', err);
                client.release();
              });
          } else {
            console.log('Table already exists');
            client.release();
          }
        })
        .catch(err => {
          console.error('Error executing query', err);
          client.release();
        });
    })
    .catch(err => console.error('Database connection error', err));

module.exports = pool;
