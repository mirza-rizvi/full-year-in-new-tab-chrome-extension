import { render } from 'preact';
import App from './components/App';
import './styles/tokens.css';
import './styles/global.css';

const root = document.getElementById('root');
if (root) render(<App />, root);
