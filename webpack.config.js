import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  context: __dirname,
  target: 'node',
  entry: './main.js',
  output: {
    filename: 'main.cjs',
    path: path.resolve(__dirname, 'dist'),
  },
};