import User from './user.js';
import Task from './task.js';

User.hasMany(Task);
Task.belongsTo(User);

(async () => {
    //await User.sync({ force: true, });
    //await Task.sync({ force: true, });
})()

export { User, Task, };