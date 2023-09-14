import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/footer'
import Header from '../components/header'
import styles from '../styles/login.module.scss'
import { BiLeftArrowAlt } from 'react-icons/bi'
import { Formik, Form } from 'formik'
import LoginInput from '../components/inputs/loginInput'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import CircleIconBtn from '../components/buttons/circleIconBtn'
import IMAGES from '../assets/Images'
import DotLoaderSpinner from '../components/loaders'
import {
  useLoginMutation,
  useRegisterMutation,
} from '../store/services/authService'
import { useDispatch } from 'react-redux'
import { setUserSession } from '../store/reducers/authReducer'

const providers = [{ name: 'Google' }, { name: 'Line' }]

export default function LoginScreen({ country }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [userLogin, setUserLogin] = useState({
    login_email: '',
    login_password: '',
  })
  const [userRegister, setUserRegister] = useState({
    register_full_name: '',
    register_email: '',
    register_password: '',
    register_confirm_password: '',
  })

  // ---------- Destructure ----------
  const { login_email, login_password } = userLogin

  const {
    register_full_name,
    register_email,
    register_password,
    register_confirm_password,
  } = userRegister

  // ---------- handleChange ----------
  const handleChange_login = (e) => {
    const { name, value } = e.target
    setUserLogin({ ...userLogin, [name]: value })
  }

  const handleChange_register = (e) => {
    const { name, value } = e.target
    setUserRegister({ ...userRegister, [name]: value })
  }

  // ---------- Validation ----------
  const loginValidation = Yup.object({
    login_email: Yup.string()
      .required('Email address is required.')
      .email('Please enter a valid email address.'),
    login_password: Yup.string().required('Please enter password'),
  })

  const registerValidation = Yup.object({
    register_full_name: Yup.string()
      .required("What's your name ?")
      .min(2, 'First name must be between 2 and 16 characters.')
      .max(16, 'First name must be between 2 and 16 characters.')
      .matches(/^[aA-zZ]/, 'Numbers and special characters are not allowed.'),
    register_email: Yup.string()
      .required('Please enter email.')
      .email('Enter a valid email address.'),
    register_password: Yup.string()
      .required('Please enter password.')
      .min(6, 'Password must be atleast 6 characters.')
      .max(36, "Password can't be more than 36 characters."),
    register_confirm_password: Yup.string()
      .required('Confirm your password.')
      .oneOf([Yup.ref('register_password')], 'Password must match.'),
  })

  const signIn = () => {}

  // ---------- Register Handler ----------

  const [register, register_response] = useRegisterMutation()

  const signUpHandler = async () => {
    try {
      let payload = {
        full_name: register_full_name,
        email: register_email,
        password: register_password,
      }
      await register(payload)
    } catch (error) {
      console.log('Failed to register: ', error)
    }
  }

  // ---------- Login Handler ----------

  const [login, login_response] = useLoginMutation()

  const loginHandler = async () => {
    try {
      let payload = {
        email: login_email,
        password: login_password,
      }
      await login(payload)
    } catch (error) {
      console.log('Failed to login: ', error)
    }
  }

  useEffect(() => {
    if (login_response.isSuccess) {
      localStorage.setItem(
        'user-session',
        JSON.stringify(login_response?.data?.data)
      )
      dispatch(setUserSession(login_response?.data?.data))
      navigate('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login_response.isSuccess])

  useEffect(() => {
    if (register_response.isSuccess) {
      localStorage.setItem(
        'user-session',
        JSON.stringify(register_response?.data?.data)
      )
      dispatch(setUserSession(register_response?.data?.data))
      navigate('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register_response.isSuccess])

  return (
    <>
      {login_response.isLoading && (
        <DotLoaderSpinner loading={login_response.isLoading} />
      )}
      <Header country={country} />
      <div className={styles.login}>
        <div className={styles.login_container}>
          <div className={styles.login_header}>
            <div className={styles.back_svg}>
              <BiLeftArrowAlt />
            </div>
            <span>
              We&apos;d be happy to join us! <Link to="/">Go Store</Link>
            </span>
          </div>
          <div className={styles.login_form}>
            <h1>Sign in</h1>
            <p>
              Get access to one of the best Eshopping services in the world.
            </p>
            <Formik
              enableReinitialize
              initialValues={{
                login_email,
                login_password,
              }}
              validationSchema={loginValidation}
              onSubmit={() => {
                loginHandler()
              }}>
              {() => (
                <Form>
                  <LoginInput
                    icon="email"
                    placeholder="Email Address"
                    type="text"
                    name="login_email"
                    onChange={handleChange_login}
                  />
                  <LoginInput
                    icon="password"
                    placeholder="Password"
                    type="password"
                    name="login_password"
                    onChange={handleChange_login}
                  />
                  <CircleIconBtn type="submit" text="Sign in" />
                  {login_response?.isError && (
                    <span className={styles.error}>
                      {login_response?.error?.data?.error}
                    </span>
                  )}
                  <div className={styles.forgot}>
                    <Link to="/auth/forgot">Forgot password ?</Link>
                  </div>
                </Form>
              )}
            </Formik>
            <div className={styles.login_socials}>
              <span className={styles.or}>Or continue with</span>
              <div className={styles.login_socials_warp}>
                {providers.map((provider) => (
                  <div key={provider.name}>
                    <button
                      className={styles.social_btn}
                      onClick={() => signIn(provider.id)}>
                      <img src={IMAGES[provider.name]} alt="" />
                      Sign in with {provider.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.login_container}>
          <div className={styles.login_form}>
            <h1>Sign up</h1>
            <p>
              Get access to one of the best Eshopping services in the world.
            </p>
            <Formik
              enableReinitialize
              initialValues={{
                register_full_name,
                register_email,
                register_password,
                register_confirm_password,
              }}
              validationSchema={registerValidation}
              onSubmit={() => {
                signUpHandler()
              }}>
              {() => (
                <Form>
                  <LoginInput
                    icon="user"
                    placeholder="Full Name"
                    type="text"
                    name="register_full_name"
                    onChange={handleChange_register}
                  />
                  <LoginInput
                    icon="email"
                    placeholder="Email Address"
                    type="text"
                    name="register_email"
                    onChange={handleChange_register}
                  />
                  <LoginInput
                    icon="password"
                    placeholder="Password"
                    type="password"
                    name="register_password"
                    onChange={handleChange_register}
                  />
                  <LoginInput
                    icon="password"
                    placeholder="Re-Type Password"
                    type="password"
                    name="register_confirm_password"
                    onChange={handleChange_register}
                  />
                  <CircleIconBtn type="submit" text="Sign up" />
                </Form>
              )}
            </Formik>
            <div>
              {register_response?.isError && (
                <span className={styles.error}>
                  {register_response?.error?.data?.error}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer country={country} />
    </>
  )
}
