import cluster from 'cluster';
import os from 'os';
import app from './app';

console.log(cluster);
console.log(os);

app.listen(3333);
