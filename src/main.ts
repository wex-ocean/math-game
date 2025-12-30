import './assets/styles/main.css';
import './assets/styles/layout.css'; // We need to create this
import './assets/styles/components.css'; // And this
import { UIManager } from './ui/UIManager';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (app) {
    new UIManager(app);
  }
});
