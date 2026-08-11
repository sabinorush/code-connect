import './style.css'
import { createLoginPage } from './components/pages/LoginPage/LoginPage'

document.querySelector<HTMLDivElement>('#app')!.replaceChildren(createLoginPage())
