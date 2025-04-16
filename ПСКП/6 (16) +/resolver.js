const resolver = {
    getFaculties: async ({ FACULTY }, context) => {
        return FACULTY ? [await context.getOneRecord("FACULTY", "FACULTY", FACULTY)] : await context.getFullTable("FACULTY");
    },

    getPulpits: async ({ PULPIT }, context) => {
        return PULPIT ? [await context.getOneRecord("PULPIT", "PULPIT", PULPIT)] : await context.getFullTable("PULPIT");
    },

    getTeachers: async ({ TEACHER }, context) => {
        return TEACHER ? [await context.getOneRecord("TEACHER", "TEACHER", TEACHER)] : await context.getFullTable("TEACHER");
    },

    getSubjects: async ({ SUBJECT }, context) => {
        return SUBJECT ? [await context.getOneRecord("SUBJECT", "SUBJECT", SUBJECT)] : await context.getFullTable("SUBJECT");
    },

    setFaculty: async (args, context) => {
        return (await context.insertOrUpdate("FACULTY", args));
    },

    setTeacher: async (args, context) => {
        return (await context.insertOrUpdate("TEACHER", args));
    },

    setPulpit: async (args, context) => {
        return (await context.insertOrUpdate("PULPIT", args));
    },

    setSubject: async (args, context) => {
        return (await context.insertOrUpdate("SUBJECT", args));
    },

    delFaculty: async ({ FACULTY }, context) => {
        return await context.deleteEntry("FACULTY", "FACULTY", FACULTY);
    },

    delTeacher: async ({ TEACHER }, context) => {
        return await context.deleteEntry("TEACHER", "TEACHER", TEACHER);
    },

    delPulpit: async ({ PULPIT }, context) => {
        return await context.deleteEntry("PULPIT", "PULPIT", PULPIT);
    },

    delSubject: async ({ SUBJECT }, context) => {
        return await context.deleteEntry("SUBJECT", "SUBJECT", SUBJECT);
    },

    getTeachersByFaculty: async ({ FACULTY }, context) => {
        const teachers = await context.getTeachersByFaculty({ FACULTY });
        if (!teachers || teachers.length === 0) {
            return [{ FACULTY: FACULTY.trim(), TEACHERS: [] }];
        }
        const groupedTeachers = teachers.reduce((acc, teacher) => {
            if (!acc[teacher.FACULTY.trim()]) {
                acc[teacher.FACULTY.trim()] = {
                    FACULTY: teacher.FACULTY.trim(),
                    TEACHERS: [],
                };
            }
            acc[teacher.FACULTY.trim()].TEACHERS.push({
                TEACHER: teacher.TEACHER.trim(),
                TEACHER_NAME: teacher.TEACHER_NAME,
                PULPIT: teacher.PULPIT.trim(),
            });
            return acc;
        }, {});
        return Object.values(groupedTeachers);
    },

    getSubjectsByFaculties: async ({ FACULTY }, context) => {
        const subjects = await context.getSubjectsByFaculties({ FACULTY });
        if (!subjects || subjects.length === 0) {
            return [{ FACULTY: FACULTY.trim(), SUBJECTS: [] }];
        }
        const result = {
            FACULTY: subjects[0].FACULTY.trim(),
            SUBJECTS: subjects.map(subject => ({
                SUBJECT: subject.SUBJECT.trim(),
                SUBJECT_NAME: subject.SUBJECT_NAME,
                PULPIT: subject.PULPIT.trim(),
            }))
        };
        return [result];
    },
};

module.exports = resolver;