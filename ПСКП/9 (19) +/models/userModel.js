let users = [
    { id: 1, name: "Иван" },
    { id: 2, name: "Мария" }
];

module.exports = {
    getAll: () => users,
    create: (user) => {
        const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
        const newUser = { id: maxId + 1, ...user };
        users.push(newUser);
        return newUser;
    },
    getById: (id) => users.find(u => u.id === id),
    update: (id, data) => {
        const index = users.findIndex(u => u.id === id);
        if (index === -1)
            return null;
        users[index] = { ...users[index], ...data };
        return users[index];
    },
    remove: (id) => {
        const index = users.findIndex(u => u.id === id);
        if (index === -1)
            return null;
        return users.splice(index, 1);
    }
};