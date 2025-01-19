import logo from "../../public/logo.svg"

const Header = (handleSignOut) => { 

    return (
        <header>
            <img src={logo} alt="logo" />
            <button onClick={handleSignOut} id="signout">Logga ut</button>
        </header>
    );
};

export default Header;