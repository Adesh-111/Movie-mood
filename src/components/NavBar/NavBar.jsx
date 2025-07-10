import "./NavBar.css";
import data from "../../Context/ContextAPI";

function NavBar() {
    return ( <>
    <div className="movie-mood-navbar">
        <img src={data.logo} alt="" />
        <h1>
            {data.name}
        </h1>
        
    </div>
    </> );
}

export default NavBar;