import nodemon from "nodemon";

nodemon({
    script: './src/server.js',
    ext: 'js ts',
    exec: 'node',	
});