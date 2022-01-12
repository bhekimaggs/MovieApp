import React, {useState, useEffect } from 'react';
import './Header.css';
import Button from '@material-ui/core/Button';
import logo from '../../assets/logo.svg';
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Link } from 'react-router-dom';



const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
}

const TabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

const Header=(props)=> {

    const [modalIsOpen,setModalIsOpen]=useState(false);
    const [value,setValue]=useState(0);
    const [username,setUsername]=useState("");
    const [usernameRequired,setUsernameRequired]=useState("dispNone");
    const [password,setPassword]=useState("");
    const [passwordRequired,setPasswordRequired]=useState("dispNone");
    const [email,setEmail]=useState("");
    const [firstname,setFirstname]=useState("");
    const [lastname,setLastname]=useState("");
    const [mobile,setMobile]=useState("");
    const [passwordReg,setPasswordReg]=useState("");
    const [emailRequired,setEmailRequired]=useState("dispNone");
    const [firstnameRequired,setFirstnameRequired]=useState("dispNone");
    const [lastnameRequired,setLastnameRequired]=useState("dispNone");
    const [mobileRequired,setMobileRequired]=useState("dispNone");
    const [passwordRegRequired,setPasswordRegRequired]=useState("dispNone");
    const [registrationSuccess,setRegistrationSuccess]=useState(false);
    const [loggedIn,setLoggedIn]=useState( sessionStorage.getItem('access-token') == null ? false : true);


    const openModalHandler = () => {
        setModalIsOpen(true);
    }

    const closeModalHandler = () => {
        setModalIsOpen(false);
    }
    const tabChangeHandler = (event, value) => {
        setValue(value);
    }

    const loginClickHandler = () => {
        username === "" ? setUsernameRequired("dispBlock") : setUsernameRequired("dispNone");
        password === "" ? setPasswordRequired("dispBlock") : setPasswordRequired("dispNone");

        if (username === "" || password === "") { return }

       
        let dataLogin = null

        let xhrLogin = new XMLHttpRequest();
        xhrLogin.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(xhrLogin.getResponseHeader('access-token'));

                sessionStorage.setItem('uuid', JSON.parse(this.responseText).id);
                sessionStorage.setItem('access-token', xhrLogin.getResponseHeader('access-token'));

                setLoggedIn(true);
                closeModalHandler();
            }
        })


        xhrLogin.open("POST", props.baseUrl + "auth/login");
        xhrLogin.setRequestHeader("Authorization", "Basic " + window.btoa(username + ":" + password));
        xhrLogin.setRequestHeader("Content-Type", "application/json");
        xhrLogin.setRequestHeader("Cache-Control", "no-cache");
        xhrLogin.send(dataLogin);

    }
    const inputUsernameChangeHandler = (e) => {
        setUsername(e.target.value)
    }

    const inputPasswordChangeHandler = (e) => {
        setPassword(e.target.value)
    }


    const inputEmailChangeHandler = (e) => {
        setEmail(e.target.value)

    }

    const inputFirstnameChangeHandler = (e) => {
        setFirstname(e.target.value)

    }

    const inputLastnameChangeHandler = (e) => {
        setLastname(e.target.value)

    }

    const inputMobileChangeHandler = (e) => {
        setMobile(e.target.value)

    }

    const inputPasswordRegChangeHandler = (e) => {
        setPasswordReg(e.target.value)

    }

    const logoutHandler = () => {
        console.log(sessionStorage.getItem('access-token'));
        sessionStorage.removeItem('uuid');
        sessionStorage.removeItem('access-token');
        setLoggedIn(false)

    }
    const registerClickHandler = () => {
        email === "" ? setEmailRequired("dispBlock") : setEmailRequired("dispNone");
        firstname === "" ? setFirstnameRequired("dispBlock") : setFirstnameRequired("dispNone");
        lastname === "" ? setLastnameRequired("dispBlock") : setLastnameRequired("dispNone");
        mobile === "" ? setMobileRequired("dispBlock") : setMobileRequired("dispNone");
        passwordReg === "" ? setPasswordRegRequired("dispBlock") : setPasswordRegRequired("dispNone");
        if (email === "" || firstname === "" || lastname === "" || mobile === "" || passwordReg === "") { return; }

        let dataSignUp = JSON.stringify({
            "email_address": email,
            "first_name": firstname,
            "last_name": lastname,
            "mobile_number": mobile,
            "password": passwordReg
        })

        let xhrSignup = new XMLHttpRequest();
        xhrSignup.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
                setRegistrationSuccess(true)
            }
        })

        xhrSignup.open("POST", props.baseUrl + "signup");
        xhrSignup.setRequestHeader("Content-Type", "application/json");
        xhrSignup.setRequestHeader("Cache-Control", "no-cache");
        xhrSignup.send(dataSignUp);

    }

        return (
            <div>
                <header className="app-header">
                    <img src={logo} className="app-logo" alt="logo" />
                    {!loggedIn ?
                        <div className="login-button">
                            <Button variant="contained" color="default" onClick={openModalHandler}>Login</Button>
                        </div>
                        :
                        <div className="login-button">
                            <Button variant="contained" color="default" onClick={logoutHandler}>Logout</Button>
                        </div>}
                    {props.showBookShowButton === "true" && !loggedIn ?
                        <div className="bookshow-button">
                            <Button variant="contained" onClick={openModalHandler} color="primary">
                                BOOK SHOW</Button>
                        </div> : ""}
                    {props.showBookShowButton === "true" && loggedIn ?
                        <div className="bookshow-button">
                            <Link to={"/bookshow/" + props.id}><Button variant="contained" color="primary">
                                BOOK SHOW</Button></Link>
                        </div> : ""}
                </header>
                <Modal
                    ariaHideApp={false}
                    isOpen={modalIsOpen}
                    contentLabel="Login"
                    onRequestClose={closeModalHandler}
                    style={customStyles}>
                    <Tabs className="tabs" value={value} onChange={tabChangeHandler}>
                        <Tab label="Login" />
                        <Tab label="Register" />
                    </Tabs>
                    {value === 0 &&
                        <TabContainer>
                            <FormControl required>
                                <InputLabel htmlFor="username"> Username </InputLabel>
                                <Input id="username" type="text" username={username} onChange={inputUsernameChangeHandler} />
                                <FormHelperText className={usernameRequired}><span className="red">required</span></FormHelperText>
                            </FormControl><br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="password"> Password </InputLabel>
                                <Input id="password" type="password" onChange={inputPasswordChangeHandler} />
                                <FormHelperText className={passwordRequired}><span className="red">required</span></FormHelperText>
                            </FormControl><br /><br />
                            <Button variant="contained" color="primary" onClick={loginClickHandler}>LOGIN</Button>
                        </TabContainer>}
                    {value === 1 && <TabContainer>
                        <FormControl required>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <Input id="email" type="email" onChange={inputEmailChangeHandler} />
                            <FormHelperText className={emailRequired}><span className="red">required</span></FormHelperText>
                        </FormControl><br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="firstname">First Name</InputLabel>
                            <Input id="firstname" onChange={this.inputFirstnameChangeHandler} />
                            <FormHelperText className={firstnameRequired}><span className="red">required</span></FormHelperText>
                        </FormControl><br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="lastname">Last Name</InputLabel>
                            <Input id="lastname" onChange={this.inputLastnameChangeHandler} />
                            <FormHelperText className={lastnameRequired}><span className="red">required</span></FormHelperText>
                        </FormControl><br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="mobile">Mobile Number</InputLabel>
                            <Input id="mobile" onChange={inputMobileChangeHandler} />
                            <FormHelperText className={mobileRequired}><span className="red">required</span></FormHelperText>
                        </FormControl><br /><br />
                        <FormControl required aria-describedby="name-helper-text">
                            <InputLabel htmlFor="passwordReg">Password</InputLabel>
                            <Input type="password" id="passwordReg" onChange={inputPasswordRegChangeHandler} />
                            <FormHelperText className={passwordRegRequired}><span className="red">required</span></FormHelperText>
                        </FormControl><br /><br />
                        {registrationSuccess === true &&
                            <FormControl>
                                <span className="successText"> Registration Successful. Please Login!</span>
                            </FormControl>}<br /><br />
                        <Button variant="contained" color="primary" onClick={registerClickHandler}>
                            REGISTER
                        </Button>
                    </TabContainer>}


                </Modal>
            </div>
        )
}

export default Header;
