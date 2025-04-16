const mssql = require("mssql");

const config = {
    user: 'jokimi',
    password: 'jokimi',
    server: 'localhost',
    port: 1433,
    database: "psca_lab16",
    options: {
        trustServerCertificate: true
    }
};

function Db(cb) {
    this.getOneRecord = async (table, key, value) => {
        try {
            const pool = await mssql.connect(config);
            const result = await pool
                .request()
                .input("value", mssql.VarChar, value)
                .query(`SELECT * FROM ${table} WHERE ${key} = @value`);
            return result.recordset.length ? result.recordset[0] : null;
        }
        catch (err) {
            console.error(`Error fetching ${table} with ${key}=${value}:`, err);
            return null;
        }
    };

    this.getFullTable = async (tableName) => {
        try {
            const pool = await mssql.connect(config);
            const result = await pool.request().query(`SELECT * FROM ${tableName}`);
            return result.recordset;
        }
        catch (err) {
            console.error(`Error fetching data from ${tableName}:`, err);
            return [];
        }
    };

    this.insertOrUpdate = async (tableName, args) => {
        try {
            const pool = await mssql.connect(config);
            const keys = Object.keys(args);
            const values = Object.values(args);
            const query = `
                IF EXISTS (SELECT * FROM ${tableName} WHERE ${keys[0]} = @value0)
                BEGIN
                    UPDATE ${tableName} SET ${keys.slice(1).map((key, i) => `${key} = @value${i + 1}`).join(", ")}
                    WHERE ${keys[0]} = @value0
                END
                ELSE 
                BEGIN
                    INSERT INTO ${tableName} (${keys.join(", ")}) VALUES (${keys.map((_, i) => `@value${i}`).join(", ")})
                END`;
    
            const request = pool.request();
            keys.forEach((key, i) => {
                request.input(`value${i}`, values[i]);
            });
            await request.query(query);
            return args;
        }
        catch (err) {
            console.error("Ошибка при вставке/обновлении:", err);
            return null;
        }
    };    

    this.deleteEntry = async (tableName, key, value) => {
        try {
            const pool = await mssql.connect(config);
            const result = await pool
                .request()
                .input("value", mssql.VarChar, value)
                .query(`DELETE FROM ${tableName} WHERE ${key} = @value`);
            return result.rowsAffected[0] > 0;
        }
        catch (err) {
            console.error(`Error deleting from ${tableName} with ${key}=${value}:`, err);
            return false;
        }
    };

    this.getTeachersByFaculty = async ({ FACULTY }) => {
        try {
            console.log(`Fetching teachers for faculty: ${FACULTY}`);
            const pool = await mssql.connect(config);
            const result = await pool.request()
                .input("FACULTY", mssql.VarChar, FACULTY)
                .query(`SELECT TEACHER.*, PULPIT.FACULTY FROM TEACHER 
                        INNER JOIN PULPIT ON TEACHER.PULPIT = PULPIT.PULPIT 
                        WHERE PULPIT.FACULTY = @FACULTY`);
            
            console.log(`Query results: ${JSON.stringify(result.recordset)}`);
            return result.recordset;
        }
        catch (err) {
            console.error(`Error fetching teachers for faculty ${FACULTY}:`, err);
            return [];
        }
    };

    this.getSubjectsByFaculties = async ({ FACULTY }) => {
        try {
            const pool = await mssql.connect(config);
            const result = await pool.request()
                .input("FACULTY", mssql.VarChar, FACULTY)
                .query(`SELECT SUBJECT.*, PULPIT.PULPIT_NAME, PULPIT.FACULTY FROM SUBJECT 
                        INNER JOIN PULPIT ON SUBJECT.PULPIT = PULPIT.PULPIT 
                        WHERE PULPIT.FACULTY = @FACULTY`);
            return result.recordset;
        }
        catch (err) {
            console.error(`Error fetching subjects for faculty ${FACULTY}:`, err);
            return [];
        }
    };
    
    this.connect = mssql.connect(config, (err) => {
        cb(err, this);
    });
}

exports.DB = (cb) => new Db(cb);