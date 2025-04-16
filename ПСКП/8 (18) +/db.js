const Sequelize = require('sequelize');

const sequelize = new Sequelize('psca_lab16', 'jokimi', 'jokimi', {
    host: 'localhost', dialect: 'mssql',
    pool: {
        max: 10,
        min: 0,
        idle: 10000,
        acquire: 100000
    },
});
const {Faculty, Pulpit, Subject, Auditorium_type, Auditorium} = require('./models').ORM(sequelize);

class DB {
    connection = sequelize.authenticate();

    getFaculties = () => {
        return this.connection.then(() => Faculty.findAll());
    }
    getPulpits = () => {
        return this.connection.then(() => Pulpit.findAll());
    }
    getSubjects = () => {
        return this.connection.then(() => Subject.findAll());
    }
    getAuditoriumsTypes = () => {
        return this.connection.then(() => Auditorium_type.findAll());
    }
    getAuditoriums = () => {
        return this.connection.then(() => Auditorium.findAll());
    }
    insertFaculties = (faculty, facultyName) => {
        return this.connection.then(() => Faculty.create({
            faculty: faculty,
            faculty_name: facultyName
        }));
    }
    insertPulpits = (pulpit, pulpitName, faculty) => {
        return this.connection.then(() => Pulpit.create({pulpit: pulpit, pulpit_name: pulpitName, faculty: faculty}));
    }
    insertSubjects = (subject, subjectName, pulpit) => {
        return this.connection.then(() => Subject.create({
            subject: subject,
            subject_name: subjectName,
            pulpit: pulpit
        }));
    }
    insertAuditoriumTypes = (audType, audTypeName) => {
        return this.connection.then(() => Auditorium_type.create({
            auditorium_type: audType,
            auditorium_typename: audTypeName
        }));
    }
    insertAuditoriums = (auditorium, audName, audCapacity, audType) => {
        return this.connection.then(() => Auditorium.create({
            auditorium: auditorium,
            auditorium_name: audName,
            auditorium_capacity: audCapacity,
            auditorium_type: audType
        }));
    }
    updateFaculties = async (faculty, facultyName) => {
        let fac = await this.connection.then(() => Faculty.findByPk(faculty));
        if (fac === null) {
            throw new Error("Faculty does not exist");
        }
        return this.connection.then(() =>
            Faculty.update({faculty_name: facultyName}, {where: {faculty: faculty}})
        );
    }
    updatePulpits = async (pulpit, pulpitName, faculty) => {
        let pulp = await this.connection.then(() => Pulpit.findByPk(pulpit));
        if (pulp === null) {
            throw new Error("Pulpit does not exist");
        }
        return this.connection.then(() =>
            Pulpit.update({pulpit_name: pulpitName, faculty: faculty}, {where: {pulpit: pulpit}})
        );
    }
    updateSubjects = async (subject, subjectName, pulpit) => {
        let subj = await this.connection.then(() => Subject.findByPk(subject));
        if (subj === null) {
            throw new Error("Subject does not exist");
        }
        return this.connection.then(() =>
            Subject.update({subject_name: subjectName, pulpit: pulpit}, {where: {subject: subject}}));
    }
    updateAuditoriumTypes = async (audType, audTypeName) => {
        let type = await this.connection.then(() => Auditorium_type.findByPk(audType));
        if (type === null) {
            throw new Error("Auditorium type does not exist");
        }
        return this.connection.then(() =>
            Auditorium_type.update({auditorium_typename: audTypeName}, {where: {auditorium_type: audType}}));
    }
    updateAuditoriums = async (auditorium, audName, audCapacity, audType) => {
        let aud = await this.connection.then(() => Auditorium.findByPk(auditorium));
        if (aud === null) {
            throw new Error("Auditorium does not exist");
        }
        return this.connection.then(() =>
            Auditorium.update({
                auditorium_name: audName,
                auditorium_capacity: audCapacity,
                auditorium_type: audType
            }, {where: {auditorium: auditorium}}));
    }
    deleteFaculty = async (faculty) => {
        let fac = await this.connection.then(() => Faculty.findByPk(faculty));
        if (fac === null) {
            throw new Error("Faculty does not exist");
        }
        return this.connection.then(() => Faculty.destroy({where: {faculty: faculty}}));
    }
    deletePulpit = async (pulpit) => {
        let pulp = await this.connection.then(() => Pulpit.findByPk(pulpit));
        if (pulp === null) {
            throw new Error("Pulpit does not exist");
        }
        return this.connection.then(() => Pulpit.destroy({where: {pulpit: pulpit}}));
    }
    deleteSubject = async (subject) => {
        let subj = await this.connection.then(() => Subject.findByPk(subject));
        if (subj === null) {
            throw new Error("Subject does not exist");
        }
        return this.connection.then(() => Subject.destroy({where: {subject: subject}}));
    }
    deleteAuditoriumType = async (audType) => {
        let type = await this.connection.then(() => Auditorium_type.findByPk(audType));
        if (type === null) {
            throw new Error("Auditorium type does not exist");
        }
        return this.connection.then(() => Auditorium_type.destroy({where: {auditorium_type: audType}}));
    }
    deleteAuditorium = async (auditorium) => {
        let aud = await this.connection.then(() => Auditorium.findByPk(auditorium));
        if (aud === null) {
            throw new Error("Auditorium does not exist");
        }
        return this.connection.then(() => Auditorium.destroy({where: {auditorium: auditorium}}));
    }
}

exports.DB = DB;