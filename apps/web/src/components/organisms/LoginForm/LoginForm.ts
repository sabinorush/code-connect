import { createButton } from '../../atoms/Button/Button'
import { createCheckbox } from '../../atoms/Checkbox/Checkbox'
import { createLink } from '../../atoms/Link/Link'
import { createTextInput } from '../../atoms/TextInput/TextInput'
import { createFormField } from '../../molecules/FormField/FormField'
import { createRememberMeRow } from '../../molecules/RememberMeRow/RememberMeRow'
import { createSocialLoginButton } from '../../molecules/SocialLoginButton/SocialLoginButton'
import arrowForwardIcon from '../../../assets/arrow-forward.svg'
import assignmentIcon from '../../../assets/assignment.svg'

export interface LoginFormData {
  identifier: string
  password: string
  rememberMe: boolean
}

export interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void
  onGithubLogin?: () => void
  onGmailLogin?: () => void
}

export function createLoginForm(props: LoginFormProps = {}): HTMLFormElement {
  const form = document.createElement('form')
  form.className = 'flex w-full flex-col gap-6'
  form.noValidate = true

  const heading = document.createElement('h1')
  heading.className = 'text-3xl font-bold text-white'
  heading.textContent = 'Login'

  const subheading = document.createElement('p')
  subheading.className = 'text-neutral-400'
  subheading.textContent = 'Boas-vindas! Faça seu login.'

  const identifierInput = createTextInput({
    id: 'identifier',
    name: 'identifier',
    placeholder: 'usuario123',
    autoComplete: 'username',
  })
  const identifierField = createFormField({ label: 'Email ou usuário', input: identifierInput })

  const passwordInput = createTextInput({
    id: 'password',
    name: 'password',
    type: 'password',
    placeholder: '******',
    autoComplete: 'current-password',
  })
  const passwordField = createFormField({ label: 'Senha', input: passwordInput })

  const rememberMeCheckbox = createCheckbox({ id: 'remember-me', name: 'rememberMe', checked: true })
  const rememberMeRow = createRememberMeRow({
    checkbox: rememberMeCheckbox,
    checkboxLabel: 'Lembrar-me',
    forgotPasswordHref: '/recuperar-senha',
  })

  const arrowIcon = document.createElement('img')
  arrowIcon.src = arrowForwardIcon
  arrowIcon.alt = ''
  arrowIcon.className = 'h-4 w-4'

  const submitButton = createButton({ label: 'Login', type: 'submit', icon: arrowIcon })

  const dividerLineLeft = document.createElement('span')
  dividerLineLeft.className = 'h-px flex-1 bg-neutral-700'
  const dividerText = document.createElement('span')
  dividerText.textContent = 'ou entre com outras contas'
  const dividerLineRight = document.createElement('span')
  dividerLineRight.className = 'h-px flex-1 bg-neutral-700'
  const divider = document.createElement('div')
  divider.className = 'flex items-center gap-4 text-sm text-neutral-500'
  divider.append(dividerLineLeft, dividerText, dividerLineRight)

  const socialLogins = document.createElement('div')
  socialLogins.className = 'flex justify-center gap-8'
  socialLogins.append(
    createSocialLoginButton({ iconSrc: '/github.png', alt: 'GitHub', label: 'Github', onClick: props.onGithubLogin }),
    createSocialLoginButton({ iconSrc: '/gmail.png', alt: 'Gmail', label: 'Gmail', onClick: props.onGmailLogin }),
  )

  const assignmentIconEl = document.createElement('img')
  assignmentIconEl.src = assignmentIcon
  assignmentIconEl.alt = ''
  assignmentIconEl.className = 'h-4 w-4'

  const signupLink = createLink({ label: 'Crie seu cadastro!', href: '/cadastro', icon: assignmentIconEl })

  const signupPromptText = document.createElement('span')
  signupPromptText.textContent = 'Ainda não tem conta? '

  const signupPrompt = document.createElement('p')
  signupPrompt.className = 'text-center text-sm text-neutral-400'
  signupPrompt.append(signupPromptText, signupLink)

  form.append(
    heading,
    subheading,
    identifierField,
    passwordField,
    rememberMeRow,
    submitButton,
    divider,
    socialLogins,
    signupPrompt,
  )

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    props.onSubmit?.({
      identifier: identifierInput.value,
      password: passwordInput.value,
      rememberMe: rememberMeCheckbox.checked,
    })
  })

  return form
}
